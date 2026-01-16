"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Loader2 } from "lucide-react";

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState("");

  // Step 1: Auth
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Step 2: Barber info
  const [shopName, setShopName] = useState("");
  const [slug, setSlug] = useState("");
  const [address, setAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [bio, setBio] = useState("");
  const [travelEnabled, setTravelEnabled] = useState(false);

  const router = useRouter();
  const supabase = createClient();

  // Auto-generate slug from shop name
  useEffect(() => {
    if (shopName && !slug) {
      const generatedSlug = shopName
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
      setSlug(generatedSlug);
    }
  }, [shopName, slug]);

  async function handleAuthSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      // Try to sign up user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (authError) {
        // If email already exists, try to sign in and check if they have a barber profile
        if (
          authError.message?.includes("already registered") ||
          authError.message?.includes("User already registered")
        ) {
          // Try to sign in with the provided credentials
          const { data: signInData, error: signInError } =
            await supabase.auth.signInWithPassword({
              email,
              password,
            });

          if (signInError) {
            setError(
              "This email is already registered. Please check your password or go to login."
            );
            setLoading(false);
            return;
          }

          if (!signInData.user) {
            setError("Failed to authenticate");
            setLoading(false);
            return;
          }

          // Check if user already has a barber profile
          // @ts-expect-error - Supabase types not fully generated yet
          const { data: existingBarber } = await supabase
            .from("barbers")
            .select("id, slug, shop_name")
            .eq("user_id", signInData.user.id)
            .single();

          if (existingBarber) {
            setError(
              `You already have a registered barbershop: ${existingBarber.shop_name} (${existingBarber.slug})`
            );
            setLoading(false);
            return;
          }

          // User exists but has no barber profile - let them continue
          setUserId(signInData.user.id);
          setContactEmail(email);
          setStep(2);
          setLoading(false);
          return;
        } else {
          throw authError;
        }
      }

      if (!authData.user) throw new Error("No user returned");

      setUserId(authData.user.id);
      setContactEmail(email);
      setStep(2);
    } catch (err: any) {
      setError(err.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  }

  async function handleBarberSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Check if a barber profile already exists for this user
      // @ts-expect-error - Supabase types not fully generated yet
      const { data: existingBarber } = await supabase
        .from("barbers")
        .select("id, slug")
        .eq("user_id", userId)
        .single();

      if (existingBarber) {
        // User already has a barber profile - update it
        // @ts-expect-error - Supabase types not fully generated yet
        const { error: updateError } = await supabase
          .from("barbers")
          .update({
            slug: slug,
            shop_name: shopName,
            address,
            postal_code: postalCode,
            city,
            phone,
            email: contactEmail,
            bio,
            travel_enabled: travelEnabled,
          })
          .eq("user_id", userId);

        if (updateError) {
          // Handle duplicate slug error (someone else has this slug)
          if (
            updateError.message?.includes("duplicate key value") &&
            updateError.message?.includes("slug")
          ) {
            setError(
              "This URL slug is already taken by another barbershop. Please choose another one."
            );
          } else {
            throw updateError;
          }
          setLoading(false);
          return;
        }
      } else {
        // No existing profile - create new one
        // @ts-expect-error - Supabase types not fully generated yet
        const { error: insertError } = await supabase.from("barbers").insert({
          user_id: userId,
          slug: slug,
          shop_name: shopName,
          address,
          postal_code: postalCode,
          city,
          phone,
          email: contactEmail,
          bio,
          travel_enabled: travelEnabled,
        });

        if (insertError) {
          // Handle duplicate slug error
          if (
            insertError.message?.includes("duplicate key value") &&
            insertError.message?.includes("slug")
          ) {
            setError(
              "This URL slug is already taken by another barbershop. Please choose another one."
            );
          } else {
            throw insertError;
          }
          setLoading(false);
          return;
        }
      }

      // Success! Redirect to dashboard
      setStep(3);
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Failed to create barber profile");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">🚀 Create Your Barbershop</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Join LubooKing and start accepting bookings today
          </p>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div
            className={`h-2 w-16 rounded-full ${
              step >= 1 ? "bg-blue-600" : "bg-gray-300"
            }`}
          />
          <div
            className={`h-2 w-16 rounded-full ${
              step >= 2 ? "bg-blue-600" : "bg-gray-300"
            }`}
          />
          <div
            className={`h-2 w-16 rounded-full ${
              step >= 3 ? "bg-green-600" : "bg-gray-300"
            }`}
          />
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
          {step === 1 && (
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              <h2 className="text-2xl font-bold mb-4">Steg 1: Skapa konto</h2>

              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 dark:bg-gray-700 dark:border-gray-600"
                  required
                  placeholder="din@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Lösenord
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 dark:bg-gray-700 dark:border-gray-600"
                  required
                  minLength={6}
                  placeholder="Minst 6 tecken"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Bekräfta lösenord
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 dark:bg-gray-700 dark:border-gray-600"
                  required
                  minLength={6}
                  placeholder="Upprepa lösenordet"
                />
              </div>

              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 text-sm text-red-800 dark:text-red-200">
                  <p>{error}</p>
                  {error.includes("already registered") && (
                    <Link
                      href="/login"
                      className="underline font-medium mt-2 inline-block"
                    >
                      Go to login →
                    </Link>
                  )}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Skapar konto...
                  </>
                ) : (
                  "Nästa →"
                )}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleBarberSubmit} className="space-y-4">
              <h2 className="text-2xl font-bold mb-4">
                Step 2: Barbershop Details
              </h2>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Shop Name
                </label>
                <input
                  type="text"
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 dark:bg-gray-700 dark:border-gray-600"
                  required
                  placeholder="e.g. The Classic Barbershop"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  URL Slug{" "}
                  <span className="text-gray-500">
                    (Your unique booking link)
                  </span>
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">
                    lubooking.com/barbers/
                  </span>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => {
                      const value = e.target.value
                        .toLowerCase()
                        .replace(/[^a-z0-9-]/g, "");
                      setSlug(value);
                    }}
                    className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 dark:bg-gray-700 dark:border-gray-600"
                    required
                    placeholder="your-shop-name"
                    pattern="[a-z0-9-]+"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Only lowercase letters, numbers, and hyphens
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 dark:bg-gray-700 dark:border-gray-600"
                  required
                  placeholder="123 Main Street"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Postal Code
                </label>
                <input
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 dark:bg-gray-700 dark:border-gray-600"
                  required
                  placeholder="12345"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 dark:bg-gray-700 dark:border-gray-600"
                  required
                  placeholder="New York"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Phone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 dark:bg-gray-700 dark:border-gray-600"
                  required
                  placeholder="+1 555 123 4567"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Contact Email
                </label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 dark:bg-gray-700 dark:border-gray-600"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Description
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 dark:bg-gray-700 dark:border-gray-600"
                  rows={3}
                  required
                  placeholder="Welcome to our barbershop - providing premium cuts and grooming services..."
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="travel"
                  checked={travelEnabled}
                  onChange={(e) => setTravelEnabled(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-600"
                />
                <label htmlFor="travel" className="text-sm">
                  Offer mobile services (at-home visits)
                </label>
              </div>

              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 text-sm text-red-800 dark:text-red-200">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Creating profile...
                  </>
                ) : (
                  "Complete Registration"
                )}
              </button>
            </form>
          )}

          {step === 3 && (
            <div className="text-center py-8">
              <CheckCircle className="h-20 w-20 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">🎉 Success!</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Your barbershop is now registered. Redirecting to your
                dashboard...
              </p>
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                <span className="text-sm text-gray-500">
                  Loading dashboard...
                </span>
              </div>
            </div>
          )}
        </div>

        {step === 1 && (
          <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
            Har du redan ett konto?{" "}
            <a href="/login" className="text-blue-600 hover:underline">
              Logga in här
            </a>
          </p>
        )}
      </div>
    </div>
  );
}
