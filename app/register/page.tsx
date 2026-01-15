"use client";

import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { CheckCircle, Loader2 } from "lucide-react";

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState("");

  // Step 1: Auth
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Step 2: Barber info
  const [shopName, setShopName] = useState("Luccifadez");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [bio, setBio] = useState("");
  const [travelEnabled, setTravelEnabled] = useState(false);

  const router = useRouter();
  const supabase = createClientComponentClient();

  async function handleAuthSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Sign up user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (authError) throw authError;
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
      // Insert barber profile
      const { error: barberError } = await supabase.from("barbers").insert({
        user_id: userId,
        slug: "luccifadez",
        shop_name: shopName,
        address,
        city,
        phone,
        email: contactEmail,
        bio,
        travel_enabled: travelEnabled,
      });

      if (barberError) throw barberError;

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
          <h1 className="text-4xl font-bold mb-2">🚀 Registrera Luccifadez</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Skapa ditt konto och sätt upp din salong
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
                Steg 2: Salonguppgifter
              </h2>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Salongnamn
                </label>
                <input
                  type="text"
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 dark:bg-gray-700 dark:border-gray-600"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Adress</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 dark:bg-gray-700 dark:border-gray-600"
                  required
                  placeholder="Storgatan 12"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Stad</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 dark:bg-gray-700 dark:border-gray-600"
                  required
                  placeholder="Stockholm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Telefon
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 dark:bg-gray-700 dark:border-gray-600"
                  required
                  placeholder="+46 70 123 45 67"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Kontakt-email
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
                  Beskrivning
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 dark:bg-gray-700 dark:border-gray-600"
                  rows={3}
                  required
                  placeholder="Välkommen till Luccifadez - Stockholms modernaste barbersalong..."
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
                  Erbjuder hembesök
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
                    Skapar profil...
                  </>
                ) : (
                  "Slutför registrering"
                )}
              </button>
            </form>
          )}

          {step === 3 && (
            <div className="text-center py-8">
              <CheckCircle className="h-20 w-20 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">🎉 Klart!</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Din salong är nu registrerad. Du omdirigeras till dashboard...
              </p>
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                <span className="text-sm text-gray-500">
                  Laddar dashboard...
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
