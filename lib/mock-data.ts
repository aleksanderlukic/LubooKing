// Mock data for demo mode (when database is not connected)

export const MOCK_BARBER = {
  id: "demo-barber-id",
  user_id: "demo-user-id",
  slug: "luccifadez",
  shop_name: "Luccifadez Barber Studio",
  address: "123 Main Street",
  city: "Stockholm",
  phone: "+46 70 123 4567",
  email: "hello@luccifadez.com",
  bio: "Premium barber services with over 10 years of experience. Specializing in modern cuts, classic styles, and beard grooming.",
  logo_url: null,
  travel_enabled: true,
  default_theme: "default",
  extra_section_enabled: false,
  extra_section_title: null,
  extra_section_text: null,
  extra_section_image_url: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const MOCK_SERVICES = [
  {
    id: "service-1",
    barber_id: "demo-barber-id",
    title: "Classic Haircut",
    description: "Professional haircut with styling. Includes wash and finish.",
    price: 350,
    duration_minutes: 45,
    active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "service-2",
    barber_id: "demo-barber-id",
    title: "Beard Trim & Shape",
    description: "Expert beard trimming and shaping with hot towel treatment.",
    price: 200,
    duration_minutes: 30,
    active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "service-3",
    barber_id: "demo-barber-id",
    title: "Hair + Beard Combo",
    description: "Complete grooming package - haircut and beard styling.",
    price: 500,
    duration_minutes: 60,
    active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "service-4",
    barber_id: "demo-barber-id",
    title: "Kids Haircut",
    description: "Gentle and fun haircut for children under 12.",
    price: 250,
    duration_minutes: 30,
    active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "service-5",
    barber_id: "demo-barber-id",
    title: "Head Shave",
    description: "Full head shave with hot towel and aftercare.",
    price: 300,
    duration_minutes: 40,
    active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const MOCK_GALLERY = [
  {
    id: "gallery-1",
    barber_id: "demo-barber-id",
    image_url:
      "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=400",
    caption: "Modern fade",
    display_order: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: "gallery-2",
    barber_id: "demo-barber-id",
    image_url:
      "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=400",
    caption: "Classic style",
    display_order: 2,
    created_at: new Date().toISOString(),
  },
  {
    id: "gallery-3",
    barber_id: "demo-barber-id",
    image_url:
      "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=400",
    caption: "Beard grooming",
    display_order: 3,
    created_at: new Date().toISOString(),
  },
  {
    id: "gallery-4",
    barber_id: "demo-barber-id",
    image_url:
      "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400",
    caption: "Shop interior",
    display_order: 4,
    created_at: new Date().toISOString(),
  },
];

export const isDemoMode = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return !supabaseUrl || supabaseUrl.includes("placeholder");
};
