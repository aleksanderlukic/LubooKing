"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function DashboardSetupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    slug: "",
    shopName: "",
    address: "",
    city: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("Not authenticated");
      }

      // Create barber profile
      const { error: insertError } = await supabase
        .from("barbers")
        // @ts-expect-error Supabase type inference issue
        .insert({
          user_id: user.id,
          slug: formData.slug.toLowerCase().replace(/\s+/g, "-"),
          shop_name: formData.shopName,
          address: formData.address,
          city: formData.city,
        });

      if (insertError) {
        throw insertError;
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create profile");
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <h1 className="text-2xl font-bold">Set Up Your Barber Profile</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Create your barber profile to start accepting bookings
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Shop Slug (URL)"
                value={formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
                placeholder="my-barber-shop"
                required
                disabled={loading}
              />
              <p className="text-sm text-gray-600 dark:text-gray-400 -mt-2">
                Your profile will be at: /barbers/{formData.slug || "your-slug"}
              </p>

              <Input
                label="Shop Name"
                value={formData.shopName}
                onChange={(e) =>
                  setFormData({ ...formData, shopName: e.target.value })
                }
                placeholder="Luccifadez"
                required
                disabled={loading}
              />

              <Input
                label="Address"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                placeholder="123 Main St"
                disabled={loading}
              />

              <Input
                label="City"
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
                placeholder="New York"
                disabled={loading}
              />

              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creating Profile..." : "Create Profile"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
