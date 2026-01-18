"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

export default function DashboardProfilePage() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [shopName, setShopName] = useState("");
  const [slug, setSlug] = useState("");
  const [address, setAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [travelEnabled, setTravelEnabled] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      const { data: barber, error } = await (supabase.from("barbers") as any)
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error) throw error;

      if (barber) {
        setShopName(barber.shop_name || "");
        setSlug(barber.slug || "");
        setAddress(barber.address || "");
        setPostalCode(barber.postal_code || "");
        setCity(barber.city || "");
        setPhone(barber.phone || "");
        setEmail(barber.email || "");
        setBio(barber.bio || "");
        setTravelEnabled(barber.travel_enabled || false);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await (supabase.from("barbers") as any)
        .update({
          shop_name: shopName,
          slug: slug,
          address,
          postal_code: postalCode,
          city,
          phone,
          email,
          bio,
          travel_enabled: travelEnabled,
        })
        .eq("user_id", user.id);

      if (error) throw error;

      setMessage("Profile updated successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
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
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Profile Settings</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 space-y-4">
            <h2 className="text-xl font-semibold mb-4">Shop Information</h2>

            <Input
              label="Shop Name"
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              required
              disabled={saving}
            />

            <div>
              <label className="block text-sm font-medium mb-2">
                URL Slug{" "}
                <span className="text-gray-500">
                  (lubooking.com/barbers/...)
                </span>
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => {
                  const value = e.target.value
                    .toLowerCase()
                    .replace(/[^a-z0-9-]/g, "");
                  setSlug(value);
                }}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 dark:bg-gray-700 dark:border-gray-600"
                required
                disabled={saving}
                pattern="[a-z0-9-]+"
              />
            </div>

            <Input
              label="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              disabled={saving}
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Postal Code"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                required
                disabled={saving}
              />
              <Input
                label="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
                disabled={saving}
              />
            </div>

            <Input
              label="Phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              disabled={saving}
            />

            <Input
              label="Contact Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={saving}
            />

            <div>
              <label className="block text-sm font-medium mb-2">
                Description
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 dark:bg-gray-700 dark:border-gray-600"
                rows={4}
                required
                disabled={saving}
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="travel"
                checked={travelEnabled}
                onChange={(e) => setTravelEnabled(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-600"
                disabled={saving}
              />
              <label htmlFor="travel" className="text-sm">
                Offer mobile services (at-home visits)
              </label>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm">
              {error}
            </div>
          )}

          {message && (
            <div className="p-3 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg text-sm">
              {message}
            </div>
          )}

          <Button type="submit" disabled={saving} className="w-full">
            {saving ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
