# Email Setup Guide - Resend Integration

LubooKing använder [Resend](https://resend.com) för att skicka bokningsbekräftelser och avbokningslänkar via email.

## Steg 1: Skapa Resend Konto

1. Gå till [resend.com](https://resend.com)
2. Registrera dig (gratis plan inkluderar 100 emails/dag)
3. Verifiera din email

## Steg 2: Få din API-nyckel

1. Logga in på [Resend Dashboard](https://resend.com/api-keys)
2. Klicka på "Create API Key"
3. Namnge din nyckel (t.ex. "LubooKing Development")
4. Välj "Full Access" eller "Sending Access"
5. Kopiera API-nyckeln (visas bara en gång!)

## Steg 3: Lägg till i .env.local

Öppna `.env.local` och uppdatera:

```bash
# Resend (Email Service)
RESEND_API_KEY=re_123456789_dinhemliganyckel
RESEND_FROM_EMAIL=noreply@lubooking.com  # Ändra till din domän

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3002  # För development
# NEXT_PUBLIC_APP_URL=https://dindomän.se  # För production
```

## Steg 4: Konfigurera Avsändare-Email

### För Development (Gratis)

Resend låter dig skicka från `onboarding@resend.dev` utan domänverifiering:

```bash
RESEND_FROM_EMAIL=onboarding@resend.dev
```

### För Production (Rekommenderat)

Verifiera din egen domän:

1. Gå till [Domains](https://resend.com/domains) i Resend Dashboard
2. Klicka "Add Domain"
3. Ange din domän (t.ex. `lubooking.com`)
4. Lägg till DNS-posterna i din domänleverantör:
   - **SPF record** (TXT)
   - **DKIM records** (TXT)
   - **DMARC record** (optional men rekommenderat)
5. Vänta på verifiering (kan ta upp till 72h)
6. När verifierad, uppdatera `.env.local`:
   ```bash
   RESEND_FROM_EMAIL=noreply@dindomän.com
   ```

## Steg 5: Testa Email-funktionen

### Test med Pay at the Shop

1. Starta servern: `npm run dev`
2. Gå till `http://localhost:3002/barbers/luccifadez`
3. Boka en tid och välj "Pay at the shop"
4. Fyll i din riktiga email
5. Klicka "Confirm Booking"
6. Kontrollera din inkorg!

### Test med Online Payment (Stripe)

1. Följ först [STRIPE_SETUP.md](./STRIPE_SETUP.md)
2. Gör en testbokning med Stripe
3. Efter lyckad betalning ska email skickas automatiskt

## Email-innehåll

Bokningsbekräftelsen innehåller:

- ✅ Bokningsdetaljer (datum, tid, tjänst, pris)
- ✅ Betalningsmetod
- ✅ Salong-information och adress
- ✅ **Avbokningslänk** (giltig upp till 24h före bokning)

## Avbokningsfunktion

### Hur det fungerar:

1. Användaren får email med en unik avbokningslänk
2. Länken ser ut så här: `http://localhost:3002/bookings/{id}/cancel?token=abc123`
3. När användaren klickar på länken:
   - Bokningen hittas via ID och cancellation_token
   - Tiden kontrolleras (måste vara minst 24h innan)
   - Om OK: bokningen markeras som "cancelled"
   - Om för sent: felmeddelande visas

### Säkerhet:

- Varje bokning får en unik `cancellation_token` (UUID)
- Token krävs för att avboka
- Endast giltigt upp till 24h före bokningentid
- Ingen inloggning krävs

## Felsökning

### "Email send error: Missing API key"

- Kontrollera att `RESEND_API_KEY` finns i `.env.local`
- Starta om servern efter att ha lagt till nyckeln

### "Failed to send email: Domain not verified"

- Du försöker skicka från en ej verifierad domän
- Använd `onboarding@resend.dev` för development
- Eller verifiera din domän enligt Steg 4

### Email kommer inte fram

1. Kolla Spam-mappen
2. Verifiera att email-adressen är korrekt
3. Kontrollera Resend Dashboard → Logs för att se status
4. För `onboarding@resend.dev`: Emails går endast till din registrerade email

### "404" på /api/emails/booking-confirmation

- Starta om development-servern
- Kontrollera att filen finns: `app/api/emails/booking-confirmation/route.ts`

## Rate Limits

### Gratis Plan (Resend)

- 100 emails/dag
- 3,000 emails/månad
- Perfekt för development och småskalig testing

### Uppgradera (om behövs)

1. Gå till [Billing](https://resend.com/settings/billing)
2. Välj plan baserat på dina behov
3. För LubooKing marketplace: Professional ($20/månad = 50k emails)

## Production Checklist

Innan du går live:

- [ ] Verifiera din egen domän i Resend
- [ ] Uppdatera `RESEND_FROM_EMAIL` till din domän
- [ ] Uppdatera `NEXT_PUBLIC_APP_URL` till din riktiga URL
- [ ] Testa avbokningslänkar i production
- [ ] Kontrollera att emails inte hamnar i spam
- [ ] Sätt upp DMARC för bättre deliverability

## Support

- **Resend Docs**: https://resend.com/docs
- **API Reference**: https://resend.com/docs/api-reference
- **Resend Discord**: https://resend.com/discord
- **Email-mallar**: `app/api/emails/booking-confirmation/route.ts`

## Exempel: Full Bokningsbekräftelse

```
Subject: Booking Confirmation - LubooKing Salon

Hi John Doe,

Your appointment has been confirmed at LubooKing Salon.

📅 Booking Details:
- Service: Haircut
- Date: 2026-01-28
- Time: 09:30 - 10:00
- Location: Storgatan 1, Stockholm
- Price: 300 SEK
- Payment: Pay at shop

Important: You can cancel this booking up to 24 hours before your appointment.

[Cancel Booking] (Röd knapp)

Thank you for choosing LubooKing Salon!
If you have any questions, please reply to this email.
```

Lycka till med dina emailutskick! 📧
