# 🚀 Snabbguide: Supabase Setup för Luccifadez

Följ dessa steg för att koppla din Luccifadez-sida till en riktig databas och aktivera bokningar.

## ⚡ Snabbstart (15 minuter)

### Steg 1: Skapa Supabase-projekt (3 min)

1. Gå till [supabase.com](https://supabase.com)
2. Klicka **"New Project"**
3. Fyll i:
   - **Name**: `luccifadez`
   - **Database Password**: Välj ett starkt lösenord (spara det!)
   - **Region**: `North Europe (Stockholm)` ⚡ Närmast Sverige
   - **Pricing Plan**: `Free` (perfekt för att starta)
4. Klicka **"Create new project"**
5. ⏰ Vänta ~2 minuter medan projektet skapas

### Steg 2: Kopiera API-nycklar (1 min)

När projektet är klart:

1. Gå till **Settings** (⚙️ längst ner i sidomenyn)
2. Klicka **API**
3. Kopiera dessa tre värden:

```
📋 Project URL:
https://abcdefghijklmnop.supabase.co

📋 anon public key:
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

📋 service_role key: (⚠️ Hemlig!)
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Steg 3: Uppdatera .env.local (1 min)

Öppna filen `.env.local` i projektroten och ersätt placeholder-värdena:

```bash
# Före:
NEXT_PUBLIC_SUPABASE_URL=https://placeholder.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Efter (med dina riktiga värden):
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**⚠️ Viktigt:** Starta om servern efter att du sparat:

```bash
Ctrl+C  # Stoppa servern
npm run dev  # Starta igen
```

### Steg 4: Installera Supabase CLI (2 min)

```bash
# Installera CLI
npm install -g supabase

# Logga in
supabase login
```

En webbläsare öppnas → Logga in med samma konto som du skapade projektet med.

### Steg 5: Länka projektet (1 min)

```bash
# Hitta din project-ref:
# Gå till Supabase → Settings → General
# Kopiera "Reference ID" (t.ex. "abcdefghijklmnop")

supabase link --project-ref abcdefghijklmnop
```

När du ombeds ange databas-lösenord, använd det du skapade i Steg 1.

### Steg 6: Kör migrations (2 min)

```bash
supabase db push
```

Detta skapar alla tabeller:

- ✅ `barbers` - Dina salonguppgifter
- ✅ `services` - Tjänster (klippning, skägg, etc.)
- ✅ `bookings` - Kundbokningar
- ✅ `availability` - Dina arbetstider
- ✅ `gallery_images` - Portfolio-bilder
- ✅ `notification_subscriptions` - Email-notiser

### Steg 7: Skapa ditt första barber-konto (5 min)

#### Option A: Via Supabase Dashboard (Enklast) ⭐

1. **Skapa användare:**
   - Gå till Supabase → **Authentication** → **Users**
   - Klicka **"Add user"** → **"Create new user"**
   - Fyll i:
     - **Email**: `din@email.com` (din riktiga email)
     - **Password**: Välj ett säkert lösenord
     - **Auto Confirm User**: ✅ Kryssa i (så slipper du bekräfta via email)
   - Klicka **"Create user"**
   - **📋 Kopiera user ID** (t.ex. `12345678-1234-1234-1234-123456789abc`)

2. **Lägg till i barbers-tabellen:**
   - Gå till **Table Editor** → **barbers**
   - Klicka **"Insert"** → **"Insert row"**
   - Fyll i:

```
user_id: [Klistra in user ID från steg 1]
slug: luccifadez
shop_name: Luccifadez
address: Storgatan 12
city: Stockholm
phone: +46 70 123 45 67
email: kontakt@luccifadez.se
bio: Välkommen till Luccifadez - Stockholms modernaste barbersalong med över 10 års erfarenhet.
travel_enabled: false (eller true om du kör hem till kunder)
```

3. Klicka **"Save"**

#### Option B: Via SQL (För avancerade)

```sql
-- 1. Skapa användare (gör detta i Authentication UI istället)

-- 2. Lägg till i barbers (ersätt user_id med din)
INSERT INTO barbers (
  user_id,
  slug,
  shop_name,
  address,
  city,
  phone,
  email,
  bio,
  travel_enabled
) VALUES (
  '12345678-1234-1234-1234-123456789abc',
  'luccifadez',
  'Luccifadez',
  'Storgatan 12',
  'Stockholm',
  '+46 70 123 45 67',
  'kontakt@luccifadez.se',
  'Välkommen till Luccifadez - Stockholms modernaste barbersalong.',
  false
);
```

### Steg 8: Testa att logga in ✅

1. Gå till http://localhost:3001/login
2. Logga in med din email och lösenord från Steg 7
3. Du borde hamna på `/dashboard` 🎉

## 🎨 Nästa steg: Anpassa din sida

Nu när du är inloggad i Dashboard kan du:

### 1. Lägg till tjänster

**Dashboard → Services → Add New Service**

Exempel:

```
Title: Herrklippning
Description: Professionell klippning med styling
Price: 400
Duration: 45 minuter
```

Upprepa för alla dina tjänster (skägg, kombo, barn, etc.)

### 2. Ladda upp bilder

**Dashboard → Gallery → Upload Images**

- Drag & drop dina bästa klippningar
- Kvadratiska bilder funkar bäst
- Max 5MB per bild
- Dra för att ändra ordning

### 3. Sätt arbetstider

**Dashboard → Availability → Set Schedule**

```
Monday: 09:00 - 18:00
Tuesday: 09:00 - 18:00
Wednesday: 09:00 - 18:00
Thursday: 09:00 - 20:00
Friday: 09:00 - 18:00
Saturday: 10:00 - 16:00
Sunday: Stängt
```

### 4. Uppdatera profil

**Dashboard → Settings**

- Ladda upp logga
- Ändra beskrivning
- Uppdatera kontaktinfo
- Välj tema (light/dark)

## 🚀 Deploy till Vercel (Bonus)

När allt fungerar lokalt:

### Option 1: Via GitHub (Enklast)

```bash
# 1. Skapa GitHub repo
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/dittanvändarnamn/luccifadez.git
git push -u origin main

# 2. Gå till vercel.com
# 3. Klicka "Import Project"
# 4. Välj ditt GitHub repo
# 5. Lägg till Environment Variables (samma som .env.local)
# 6. Deploy!
```

### Option 2: Via Vercel CLI

```bash
npm install -g vercel
vercel login
vercel
```

**Resultat:** Din sida live på `https://luccifadez.vercel.app` 🎉

## 📧 Email-notiser (Optional - Resend)

Om du vill ha automatiska email-notiser vid bokningar:

1. Gå till [resend.com](https://resend.com)
2. Skapa konto (gratis: 100 emails/dag)
3. Hämta API key
4. Lägg till i `.env.local`:

```bash
RESEND_API_KEY=re_123456789
RESEND_FROM_EMAIL=noreply@luccifadez.se
```

## 🆘 Troubleshooting

### "Error: relation 'barbers' does not exist"

→ Du glömde köra `supabase db push`

### "Invalid API key"

→ Kontrollera att du kopierat rätt nycklar från Supabase

### "User already registered"

→ Bra! Logga in istället

### Servern visar fortfarande demo mode

→ Starta om servern efter att du ändrat `.env.local`

### Kan inte logga in

→ Kontrollera att du kryssat i "Auto Confirm User" när du skapade användaren

## ✅ Checklist

- [ ] Supabase-projekt skapat
- [ ] API-nycklar kopierade till `.env.local`
- [ ] Servern omstartad
- [ ] Migrations körda (`supabase db push`)
- [ ] Användare skapad i Authentication
- [ ] Barber-rad tillagd i `barbers` tabellen
- [ ] Kan logga in på `/login`
- [ ] Dashboard fungerar
- [ ] Tjänster tillagda
- [ ] Bilder uppladdade
- [ ] Arbetstider satta
- [ ] Testat att boka (som kund)
- [ ] Deployad till Vercel

## 🎯 Support

- **Setup-wizard i appen:** http://localhost:3001/setup
- **Detaljerad guide:** [SETUP_GUIDE.md](./SETUP_GUIDE.md)
- **Supabase Docs:** https://supabase.com/docs

**Lycka till! 🚀**
