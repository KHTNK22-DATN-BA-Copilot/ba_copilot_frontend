export default function OverviewSection() {
  return (
    <div className="col-span-12">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Overview</h1>

      {/* Overview Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-8">
        {[1, 2, 3, 4, 5].map((item) => (
          <div key={item} className="bg-gray-200 dark:bg-gray-700 rounded-lg aspect-square flex items-center justify-center transition-colors duration-300">
            <div className="w-16 h-16 bg-gray-300 dark:bg-gray-600 rounded-lg transition-colors duration-300"></div>
          </div>
        ))}
      </div>
    </div>
  );
}