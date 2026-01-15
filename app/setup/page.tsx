"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  CheckCircle,
  Circle,
  AlertCircle,
  ExternalLink,
  Copy,
  Check,
} from "lucide-react";

export default function SetupPage() {
  const [supabaseConnected, setSupabaseConnected] = useState(false);
  const [checkingConnection, setCheckingConnection] = useState(true);
  const [databaseReady, setDatabaseReady] = useState(false);
  const [barberExists, setBarberExists] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    checkSetupStatus();
  }, []);

  async function checkSetupStatus() {
    setCheckingConnection(true);

    // Check if Supabase is connected
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const isDemoMode = !supabaseUrl || supabaseUrl.includes("placeholder");

    if (isDemoMode) {
      setSupabaseConnected(false);
      setCheckingConnection(false);
      return;
    }

    setSupabaseConnected(true);

    // Check if database tables exist
    try {
      const { error } = await supabase.from("barbers").select("id").limit(1);
      if (!error) {
        setDatabaseReady(true);

        // Check if any barber exists
        const { data } = await supabase
          .from("barbers")
          .select("id")
          .eq("slug", "luccifadez")
          .single();

        if (data) {
          setBarberExists(true);
        }
      }
    } catch (err) {
      setDatabaseReady(false);
    }

    setCheckingConnection(false);
  }

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const steps = [
    {
      id: 1,
      title: "Skapa Supabase Projekt",
      completed: supabaseConnected,
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            Först behöver du skapa ett gratis Supabase-projekt.
          </p>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>
              Gå till{" "}
              <a
                href="https://supabase.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline inline-flex items-center gap-1"
              >
                supabase.com <ExternalLink className="h-3 w-3" />
              </a>
            </li>
            <li>Klicka "New Project"</li>
            <li>Välj organisation och projektnamn (t.ex. "luccifadez")</li>
            <li>
              <strong>Viktigt:</strong> Spara database password!
            </li>
            <li>
              Välj region: <strong>North Europe (Stockholm)</strong>
            </li>
            <li>Vänta ~2 minuter tills projektet är klart</li>
          </ol>
        </div>
      ),
    },
    {
      id: 2,
      title: "Kopiera API Credentials",
      completed: supabaseConnected,
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            Hämta dina API-nycklar från Supabase.
          </p>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>
              I Supabase Dashboard: <strong>Settings → API</strong>
            </li>
            <li>Kopiera dessa tre värden:</li>
          </ol>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-3 mt-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <code className="text-xs text-blue-600">
                  NEXT_PUBLIC_SUPABASE_URL
                </code>
              </div>
              <div className="text-xs text-gray-500">Project URL</div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <code className="text-xs text-blue-600">
                  NEXT_PUBLIC_SUPABASE_ANON_KEY
                </code>
              </div>
              <div className="text-xs text-gray-500">anon public key</div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <code className="text-xs text-blue-600">
                  SUPABASE_SERVICE_ROLE_KEY
                </code>
              </div>
              <div className="text-xs text-gray-500">
                service_role key (hemlig!)
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 3,
      title: "Uppdatera .env.local",
      completed: supabaseConnected,
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            Lägg in dina nycklar i environment-filen.
          </p>
          <div className="space-y-3">
            <div>
              <p className="text-sm mb-2">
                1. Öppna filen{" "}
                <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                  .env.local
                </code>{" "}
                i projektroten
              </p>
              <p className="text-sm mb-2">
                2. Ersätt placeholder-värdena med dina nycklar:
              </p>
              <div className="bg-gray-900 rounded-lg p-4 text-sm font-mono text-gray-100 relative group">
                <button
                  onClick={() =>
                    copyToClipboard(
                      `NEXT_PUBLIC_SUPABASE_URL=https://ditt-projekt.supabase.co\nNEXT_PUBLIC_SUPABASE_ANON_KEY=din-anon-key\nSUPABASE_SERVICE_ROLE_KEY=din-service-role-key`,
                      "env"
                    )
                  }
                  className="absolute top-2 right-2 p-2 bg-gray-800 rounded hover:bg-gray-700 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  {copied === "env" ? (
                    <Check className="h-4 w-4 text-green-400" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
                <pre className="whitespace-pre-wrap">
                  {`NEXT_PUBLIC_SUPABASE_URL=https://ditt-projekt.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=din-anon-key
SUPABASE_SERVICE_ROLE_KEY=din-service-role-key`}
                </pre>
              </div>
            </div>
            <div className="text-sm text-amber-600 dark:text-amber-400 flex gap-2">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <span>
                Efter att du sparat filen, starta om servern (Ctrl+C och{" "}
                <code>npm run dev</code>)
              </span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 4,
      title: "Kör Database Migrations",
      completed: databaseReady,
      disabled: !supabaseConnected,
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            Skapa tabellerna i databasen.
          </p>
          <div className="space-y-3">
            <p className="text-sm">Öppna en terminal och kör:</p>
            <div className="bg-gray-900 rounded-lg p-4 text-sm font-mono text-gray-100 relative group">
              <button
                onClick={() =>
                  copyToClipboard("npm install -g supabase", "cli")
                }
                className="absolute top-2 right-2 p-2 bg-gray-800 rounded hover:bg-gray-700 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                {copied === "cli" ? (
                  <Check className="h-4 w-4 text-green-400" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>
              <div># Installera Supabase CLI</div>
              <div className="text-blue-400">npm install -g supabase</div>
            </div>

            <div className="bg-gray-900 rounded-lg p-4 text-sm font-mono text-gray-100 relative group">
              <button
                onClick={() => copyToClipboard("supabase login", "login")}
                className="absolute top-2 right-2 p-2 bg-gray-800 rounded hover:bg-gray-700 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                {copied === "login" ? (
                  <Check className="h-4 w-4 text-green-400" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>
              <div># Logga in</div>
              <div className="text-blue-400">supabase login</div>
            </div>

            <div className="bg-gray-900 rounded-lg p-4 text-sm font-mono text-gray-100 relative group">
              <button
                onClick={() =>
                  copyToClipboard(
                    "supabase link --project-ref din-projekt-ref",
                    "link"
                  )
                }
                className="absolute top-2 right-2 p-2 bg-gray-800 rounded hover:bg-gray-700 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                {copied === "link" ? (
                  <Check className="h-4 w-4 text-green-400" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>
              <div># Länka ditt projekt (ref hittar du i Project Settings)</div>
              <div className="text-blue-400">
                supabase link --project-ref din-projekt-ref
              </div>
            </div>

            <div className="bg-gray-900 rounded-lg p-4 text-sm font-mono text-gray-100 relative group">
              <button
                onClick={() => copyToClipboard("supabase db push", "push")}
                className="absolute top-2 right-2 p-2 bg-gray-800 rounded hover:bg-gray-700 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                {copied === "push" ? (
                  <Check className="h-4 w-4 text-green-400" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>
              <div># Kör migrations</div>
              <div className="text-blue-400">supabase db push</div>
            </div>

            <div className="text-sm text-blue-600 dark:text-blue-400 flex gap-2">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <span>
                Detta skapar alla tabeller (barbers, services, bookings, etc.)
              </span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 5,
      title: "Skapa ditt Barber-konto",
      completed: barberExists,
      disabled: !databaseReady,
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            Registrera Luccifadez i systemet.
          </p>
          <div className="space-y-3">
            <p className="text-sm font-medium">
              Option A: Via Supabase Dashboard (Enklast)
            </p>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>
                Gå till Supabase → <strong>Authentication → Users</strong>
              </li>
              <li>Klicka "Add user" → "Create new user"</li>
              <li>
                Email: <strong>din@email.com</strong>
              </li>
              <li>Password: Välj ett säkert lösenord</li>
              <li>Avmarkera "Auto Confirm User" om den är ikryssad</li>
              <li>Kopiera user ID när användaren är skapad</li>
            </ol>

            <p className="text-sm font-medium mt-4">
              Lägg sedan till i barbers-tabellen:
            </p>
            <ol
              className="list-decimal list-inside space-y-2 text-sm"
              start={7}
            >
              <li>
                Gå till <strong>Table Editor → barbers</strong>
              </li>
              <li>Klicka "Insert row"</li>
              <li>
                Fyll i:
                <div className="bg-gray-50 dark:bg-gray-800 rounded p-3 mt-2 space-y-1 text-xs font-mono">
                  <div>
                    <strong>user_id:</strong> [det user_id du kopierade]
                  </div>
                  <div>
                    <strong>slug:</strong> luccifadez
                  </div>
                  <div>
                    <strong>shop_name:</strong> Luccifadez
                  </div>
                  <div>
                    <strong>address:</strong> Din adress
                  </div>
                  <div>
                    <strong>city:</strong> Din stad
                  </div>
                  <div>
                    <strong>phone:</strong> +46 XX XXX XX XX
                  </div>
                  <div>
                    <strong>email:</strong> kontakt@luccifadez.se
                  </div>
                  <div>
                    <strong>bio:</strong> Din beskrivning...
                  </div>
                </div>
              </li>
            </ol>

            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mt-4">
              <p className="text-sm text-green-800 dark:text-green-200">
                <strong>Tips:</strong> Efter detta kan du logga in på{" "}
                <code>/login</code> med din email och hantera allt via
                Dashboard!
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 6,
      title: "Klart! 🎉",
      completed: barberExists,
      disabled: !barberExists,
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            Nu fungerar allt! Du kan:
          </p>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Logga in på Dashboard:</strong>{" "}
                <a href="/login" className="text-blue-600 hover:underline">
                  /login
                </a>
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Lägg till tjänster:</strong> Dashboard → Services
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Ladda upp bilder:</strong> Dashboard → Gallery
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Sätt arbetstider:</strong> Dashboard → Availability
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Uppdatera profil:</strong> Dashboard → Settings
              </span>
            </li>
          </ul>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mt-4">
            <p className="text-sm text-blue-800 dark:text-blue-200 mb-2">
              <strong>Nästa steg: Deploy till Vercel</strong>
            </p>
            <ol className="list-decimal list-inside space-y-1 text-sm text-blue-700 dark:text-blue-300">
              <li>Pusha koden till GitHub</li>
              <li>Gå till vercel.com → Import projekt</li>
              <li>Lägg till environment variables</li>
              <li>Deploy!</li>
            </ol>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">🚀 Luccifadez Setup</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Följ dessa steg för att aktivera riktiga bokningar
          </p>
        </div>

        {/* Connection Status */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Status</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Supabase Connection</span>
              {checkingConnection ? (
                <span className="text-xs text-gray-500">Checking...</span>
              ) : supabaseConnected ? (
                <span className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  <span className="text-sm">Connected</span>
                </span>
              ) : (
                <span className="flex items-center gap-2 text-amber-600">
                  <AlertCircle className="h-5 w-5" />
                  <span className="text-sm">Demo Mode</span>
                </span>
              )}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Database Tables</span>
              {databaseReady ? (
                <span className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  <span className="text-sm">Ready</span>
                </span>
              ) : (
                <span className="flex items-center gap-2 text-gray-400">
                  <Circle className="h-5 w-5" />
                  <span className="text-sm">Pending</span>
                </span>
              )}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Barber Account</span>
              {barberExists ? (
                <span className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  <span className="text-sm">Exists</span>
                </span>
              ) : (
                <span className="flex items-center gap-2 text-gray-400">
                  <Circle className="h-5 w-5" />
                  <span className="text-sm">Not created</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Setup Steps */}
        <div className="space-y-6">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden ${
                step.disabled ? "opacity-50" : ""
              }`}
            >
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    {step.completed ? (
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    ) : step.disabled ? (
                      <Circle className="h-8 w-8 text-gray-300" />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-4">{step.title}</h3>
                    {step.content}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>
            Behöver hjälp?{" "}
            <a href="/SETUP_GUIDE.md" className="text-blue-600 hover:underline">
              Läs detaljerad guide
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
