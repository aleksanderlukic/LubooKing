export default function DashboardAvailabilityPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Set Availability</h1>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <h3 className="font-bold mb-2">🚧 Coming Soon</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Availability management interface is under construction. For now,
            manage availability directly in Supabase.
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Go to your Supabase dashboard → Table Editor → availability
          </p>
          <div className="mt-4 p-4 bg-white dark:bg-gray-900 rounded border">
            <p className="text-sm font-medium mb-2">
              Example availability entry:
            </p>
            <code className="text-xs">
              barber_id: your-barber-id
              <br />
              date: 2026-01-20
              <br />
              start_time: 09:00
              <br />
              end_time: 17:00
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}
