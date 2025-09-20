import Link from 'next/link';

export default function NavBar() {
  return (
    <nav>
      <div className="flex justify-center space-x-8">
        <Link href="/dashboard" className="text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 text-sm font-medium border-b-2 border-blue-600 dark:border-blue-400">
          All
        </Link>
        <Link href="#" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 px-3 py-2 text-sm font-medium">
          Quick Action 1
        </Link>
        <Link href="#" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 px-3 py-2 text-sm font-medium">
          Quick Action 2
        </Link>
      </div>
    </nav>
  );
}
