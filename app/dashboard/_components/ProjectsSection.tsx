type ProjectsSectionProps = {
  isOpenFilter: boolean;
  setIsOpenFilter: (value: boolean) => void;
  selectedFilter: string;
  setSelectedFilter: (value: string) => void;
};

export default function ProjectsSection({ isOpenFilter, setIsOpenFilter, selectedFilter, setSelectedFilter }: ProjectsSectionProps) {

  const handleFilterSelect = (filterName: string) => {
    setSelectedFilter(filterName);
    setIsOpenFilter(false);
    console.log(`${filterName} selected`);
  };

  return (
    <div className="col-span-12">
      {/* Filter */}
      <div className="flex justify-between items-center mb-6 relative">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
        Recent projects:
      </h2>

      <div className="relative">
        <button
          onClick={() => setIsOpenFilter(!isOpenFilter)}
          className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md flex items-center gap-2"
        >
          {selectedFilter}
          <svg
            className={`w-4 h-4 transition-transform duration-200 ${isOpenFilter ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpenFilter && (
          <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-10">
            <ul className="py-1 text-sm text-gray-700 dark:text-gray-200">
              <li>
                <button
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => handleFilterSelect("Most Recent")}
                >
                  Most Recent
                </button>
              </li>
              <li>
                <button
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => handleFilterSelect("Title")}
                >
                  Title
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>

      {/* Row 1 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6">
        {[1, 2, 3, 4, 5].map((item) => (
          <div key={item} className="bg-gray-200 dark:bg-gray-700 rounded-lg aspect-square flex items-center justify-center">
            <div className="w-16 h-16 bg-gray-300 dark:bg-gray-600 rounded-lg"></div>
          </div>
        ))}
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
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
