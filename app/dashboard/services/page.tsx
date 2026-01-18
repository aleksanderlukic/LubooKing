"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Plus, Edit2, Trash2, Check, X } from "lucide-react";

interface Service {
  id: string;
  title: string;
  duration_minutes: number;
  price: number;
  active: boolean;
}

export default function DashboardServicesPage() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState<Service[]>([]);
  const [barberId, setBarberId] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState(30);
  const [price, setPrice] = useState(0);
  const [active, setActive] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      const { data: barber } = await (supabase.from("barbers") as any)
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (!barber) throw new Error("No barber profile found");

      setBarberId(barber.id);
      await loadServices(barber.id);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function loadServices(id: string) {
    const { data, error } = await (supabase.from("services") as any)
      .select("*")
      .eq("barber_id", id)
      .order("created_at", { ascending: false });

    if (error) throw error;
    setServices(data || []);
  }

  function resetForm() {
    setTitle("");
    setDuration(30);
    setPrice(0);
    setActive(true);
    setEditingId(null);
    setShowForm(false);
  }

  function handleEdit(service: Service) {
    setTitle(service.title);
    setDuration(service.duration_minutes);
    setPrice(service.price);
    setActive(service.active);
    setEditingId(service.id);
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      if (editingId) {
        const { error } = await (supabase.from("services") as any)
          .update({
            title,
            duration_minutes: duration,
            price,
            active,
          })
          .eq("id", editingId);

        if (error) throw error;
      } else {
        const { error } = await (supabase.from("services") as any).insert({
          barber_id: barberId,
          title,
          duration_minutes: duration,
          price,
          active,
        });

        if (error) throw error;
      }

      await loadServices(barberId);
      resetForm();
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this service?")) return;

    try {
      const { error } = await (supabase.from("services") as any)
        .delete()
        .eq("id", id);

      if (error) throw error;
      await loadServices(barberId);
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function toggleActive(id: string, currentActive: boolean) {
    try {
      const { error } = await (supabase.from("services") as any)
        .update({ active: !currentActive })
        .eq("id", id);

      if (error) throw error;
      await loadServices(barberId);
    } catch (err: any) {
      setError(err.message);
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Manage Services</h1>
          {!showForm && (
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-5 w-5 mr-2" />
              Add Service
            </Button>
          )}
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm">
            {error}
          </div>
        )}

        {showForm && (
          <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold mb-4">
              {editingId ? "Edit Service" : "Add New Service"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Service Name"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="e.g. Haircut, Beard Trim"
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Duration (minutes)"
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  required
                  min={5}
                  step={5}
                />
                <Input
                  label="Price ($)"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  required
                  min={0}
                  step={1}
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="active"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <label htmlFor="active" className="text-sm">
                  Active (visible to customers)
                </label>
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  {editingId ? "Update Service" : "Add Service"}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        <div className="space-y-4">
          {services.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-gray-600 dark:text-gray-400">
                No services yet. Add your first service to get started!
              </p>
            </div>
          ) : (
            services.map((service) => (
              <div
                key={service.id}
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold">{service.title}</h3>
                      <button
                        onClick={() => toggleActive(service.id, service.active)}
                        className={`px-2 py-1 text-xs rounded-full ${
                          service.active
                            ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400"
                        }`}
                      >
                        {service.active ? "Active" : "Inactive"}
                      </button>
                    </div>
                    <div className="mt-2 flex gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <span>{service.duration_minutes} min</span>
                      <span>${service.price.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(service)}
                      className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(service.id)}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
