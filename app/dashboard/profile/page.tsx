export default function DashboardProfilePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Profile Settings</h1>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <h3 className="font-bold mb-2">🚧 Coming Soon</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Profile settings interface is under construction. For now, manage
            your profile directly in Supabase.
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Go to your Supabase dashboard → Table Editor → barbers
          </p>
        </div>
      </div>
    </div>
  );
}
