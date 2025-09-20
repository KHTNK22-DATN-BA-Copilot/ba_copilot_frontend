export default function ProjectsSection() {
  return (
    <div className="col-span-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Recent projects:</h2>
        <button className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md">
          Filter
        </button>
      </div>

      {/* Row 1 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-6">
        {[1, 2, 3, 4, 5].map((item) => (
          <div key={item} className="bg-gray-200 dark:bg-gray-700 rounded-lg aspect-square flex items-center justify-center">
            <div className="w-16 h-16 bg-gray-300 dark:bg-gray-600 rounded-lg"></div>
          </div>
        ))}
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-8">
        {[6, 7, 8, 9, 10].map((item) => (
          <div key={item} className="bg-gray-200 dark:bg-gray-700 rounded-lg aspect-square flex items-center justify-center">
            <div className="w-16 h-16 bg-gray-300 dark:bg-gray-600 rounded-lg"></div>
          </div>
        ))}
      </div>

      <div className="text-center">
        <button className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md">
          Show more
        </button>
      </div>
    </div>
  );
}
