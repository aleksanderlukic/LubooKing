import Link from "next/link";
import {
  Scissors,
  Calendar,
  Users,
  ArrowRight,
  CheckCircle,
  Clock,
  Bell,
  Shield,
  Smartphone,
  TrendingUp,
  Heart,
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              About{" "}
              <span className="bg-gradient-to-r from-yellow-600 to-yellow-500 bg-clip-text text-transparent">
                LubooKing
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8">
              The modern booking platform built specifically for barbershops and
              salons
            </p>
          </div>
        </div>
      </section>

      {/* What is LubooKing */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-8 text-center">
              What is LubooKing?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
              LubooKing is a comprehensive booking platform designed to help
              barbershops and salons create their own professional online
              presence in minutes. We understand the challenges of running a
              barbershop, which is why we've built a platform that's simple,
              powerful, and completely free.
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
              With LubooKing, you get your own custom booking website where
              customers can browse your services, view your gallery, and book
              appointments 24/7 - even when you're closed. No more missed calls,
              no more double bookings, and no more manual scheduling.
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
              Each barbershop gets their own unique URL (like
              lubooking.com/barbers/your-shop) that you can share on social
              media, business cards, or anywhere else. Your customers will love
              the convenience, and you'll love the extra time and organization.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Everything You Need to
              <span className="bg-gradient-to-r from-yellow-600 to-yellow-500 bg-clip-text text-transparent">
                {" "}
                Succeed
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Professional tools designed specifically for barbers and salons
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
            {/* Feature 1 */}
            <div className="p-8 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all">
              <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mb-6">
                <Calendar className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Online Booking</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Let customers book appointments 24/7 from any device. Automatic
                confirmations and reminders included.
              </p>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Real-time availability updates</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Prevent double bookings automatically</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Mobile-friendly booking experience</span>
                </li>
              </ul>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all">
              <div className="w-14 h-14 bg-purple-600 rounded-xl flex items-center justify-center mb-6">
                <Scissors className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Service Management</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Easily manage your services, prices, and duration. Show your
                best work with a beautiful gallery.
              </p>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Unlimited services and pricing tiers</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Photo gallery to showcase your work</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Custom service descriptions</span>
                </li>
              </ul>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all">
              <div className="w-14 h-14 bg-yellow-600 rounded-xl flex items-center justify-center mb-6">
                <Users className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Customer Management</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Track customer history, preferences, and bookings. Build lasting
                relationships with your clients.
              </p>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Customer booking history</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Automatic email notifications</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Easy booking management dashboard</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Additional Features */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <div className="flex gap-4 p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
              <Clock className="h-8 w-8 text-yellow-600 flex-shrink-0" />
              <div>
                <h4 className="font-bold mb-1">Flexible Scheduling</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Set your own working hours and availability for each day
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
              <Bell className="h-8 w-8 text-yellow-600 flex-shrink-0" />
              <div>
                <h4 className="font-bold mb-1">Smart Reminders</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Automatic email reminders reduce no-shows significantly
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
              <Shield className="h-8 w-8 text-yellow-600 flex-shrink-0" />
              <div>
                <h4 className="font-bold mb-1">Secure & Reliable</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Your data is safe with enterprise-grade security
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
              <Smartphone className="h-8 w-8 text-yellow-600 flex-shrink-0" />
              <div>
                <h4 className="font-bold mb-1">Mobile Optimized</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Perfect experience on phones, tablets, and desktops
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
              <TrendingUp className="h-8 w-8 text-yellow-600 flex-shrink-0" />
              <div>
                <h4 className="font-bold mb-1">Business Insights</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Track bookings and understand your business better
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
              <Heart className="h-8 w-8 text-yellow-600 flex-shrink-0" />
              <div>
                <h4 className="font-bold mb-1">Free Forever</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  No hidden fees, no credit card required, ever
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Get your barbershop online in{" "}
              <span className="bg-gradient-to-r from-yellow-600 to-yellow-500 bg-clip-text text-transparent font-bold">
                3 simple steps
              </span>
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-12">
            {/* Step 1 */}
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-yellow-600 to-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                1
              </div>
              <div className="flex-1">
                <h3 className="text-3xl font-bold mb-3">Create Your Account</h3>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                  Sign up in seconds with just your email address. No credit
                  card required, no commitments, completely free.
                </p>
                <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <span>Choose your unique barbershop URL</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <span>Add your shop details and location</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <span>Takes less than 2 minutes</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-yellow-600 to-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                2
              </div>
              <div className="flex-1">
                <h3 className="text-3xl font-bold mb-3">
                  Set Up Your Services
                </h3>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                  Add your services with prices, durations, and descriptions.
                  Upload photos of your best cuts to attract more customers.
                </p>
                <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <span>
                      Create unlimited services (haircuts, beard trim, etc.)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <span>Set your working hours and availability</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <span>Build a beautiful portfolio gallery</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-yellow-600 to-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                3
              </div>
              <div className="flex-1">
                <h3 className="text-3xl font-bold mb-3">
                  Start Taking Bookings
                </h3>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                  Share your unique booking link everywhere - social media,
                  business cards, shop window. Customers can book instantly!
                </p>
                <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <span>
                      Get your personal URL (lubooking.com/barbers/your-shop)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <span>Customers book 24/7, even when you're closed</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <span>Manage all bookings from your dashboard</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-yellow-600 to-yellow-500">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-yellow-50 mb-10 max-w-2xl mx-auto">
            Join hundreds of barbers who are already growing their business with
            LubooKing
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-yellow-600 px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
            >
              Create Your Free Account
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-yellow-700 hover:bg-yellow-800 text-white px-8 py-4 rounded-xl font-semibold text-lg border-2 border-yellow-800 transition-all"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
