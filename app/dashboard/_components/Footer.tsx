import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-gray-800 mt-auto transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="col-span-12 text-center">
          <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">footer</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Product</h4>
              <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <li><Link href="#">Features</Link></li>
                <li><Link href="#">Pricing</Link></li>
                <li><Link href="#">API</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Company</h4>
              <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <li><Link href="#">About</Link></li>
                <li><Link href="#">Blog</Link></li>
                <li><Link href="#">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Support</h4>
              <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <li><Link href="#">Help Center</Link></li>
                <li><Link href="#">Contact</Link></li>
                <li><Link href="#">Status</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Legal</h4>
              <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <li><Link href="#">Privacy</Link></li>
                <li><Link href="#">Terms</Link></li>
                <li><Link href="#">Security</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400">
            <p>&copy; 2025 BA Copilot. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
