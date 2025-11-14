import { EnvelopeIcon, MapPinIcon } from '@heroicons/react/24/outline'
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '../ui/button';
import { Send } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-gray-800 mt-auto transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="col-span-12 text-left">
          <h3 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4">BA Copilot</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">About Us</h4>
              <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <li><Link href="#">BA Copilot Team</Link></li>
                <li className="flex items-center space-x-2">
                  <MapPinIcon className="w-6 h-6 text-gray-500" />
                  <span>University of Science, VNU-HCM Linh Trung Campus, Dong Hoa Ward, Ho Chi Minh City, Vietnam</span>
                </li>
                <li className="flex items-center space-x-2">
                  <EnvelopeIcon className="w-4 h-4 text-gray-500" />
                  <a href="mailto:bacopilot@gmail.com">bacopilotteam@gmail.com</a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Stay Updated
              </h4>

              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Subscribe to our newsletter
              </p>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  // TODO: handle subscribe logic
                }}
                className="flex items-center space-x-2"
              >
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  className="
                              w-full px-3 py-2 text-sm rounded-md
                              bg-gray-200/60 dark:bg-gray-800/60
                              text-gray-700 dark:text-gray-300
                              placeholder-gray-500 dark:placeholder-gray-500
                              border border-gray-300 dark:border-gray-700
                              focus:ring-2 focus:ring-blue-500 focus:outline-none
                            "
                />

                <Button
                  type="submit"
                  className=" px-4 py-2 text-sm font-medium rounded-md  "
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>

            <div className="flex flex-col items-end text-right space-y-3">
              {/* Main Logo */}
              <Image
                src="/ic_ba_copilot.svg"
                alt="BA Copilot Logo"
                width={64}
                height={64}
                className="w-14 h-14"
              />

              {/* Social Icons */}
              <div className="flex items-center space-x-4">

                {/* Facebook */}
                <Link href="#" aria-label="Facebook">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-7 h-7 text-gray-600 hover:text-blue-600 transition"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M22 12a10 10 0 1 0-11.5 9.9v-7h-2v-3h2v-2.3c0-2 1.2-3.1 3-3.1.9 0 1.8.1 1.8.1v2h-1c-1 0-1.3.6-1.3 1.2V12h2.3l-.4 3h-1.9v7A10 10 0 0 0 22 12" />
                  </svg>
                </Link>

                {/* LinkedIn */}
                <Link href="#" aria-label="LinkedIn">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6 text-gray-600 hover:text-blue-700 transition"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M4.98 3.5C4.98 4.6 4.1 5.5 3 5.5s-2-.9-2-2 1-2 2-2 2 .9 2 2zM.5 8h5V24h-5V8zm7.5 0h4.8v2.2h.1c.7-1.3 2.3-2.7 4.8-2.7 5.1 0 6.1 3.3 6.1 7.6V24h-5v-7.7c0-1.8 0-4.1-2.5-4.1s-2.9 2-2.9 4V24h-5V8z" />
                  </svg>
                </Link>

                {/* Instagram */}
                <Link href="#" aria-label="Instagram">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-7 h-7 text-gray-600 hover:text-pink-500 transition"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M7 2C4.2 2 2 4.2 2 7v10c0 2.8 2.2 5 5 5h10c2.8 0 5-2.2 5-5V7c0-2.8-2.2-5-5-5H7zm10 2c1.7 0 3 1.3 3 3v10c0 1.7-1.3 3-3 3H7c-1.7 0-3-1.3-3-3V7c0-1.7 1.3-3 3-3h10zm-5 3a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm6.5-.7a1.3 1.3 0 1 0-2.6 0 1.3 1.3 0 0 0 2.6 0z" />
                  </svg>
                </Link>

              </div>
            </div>


          </div>
          <div className="mt-8 pt-8 border-t border-gray-200 text-center dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400">
            <p>&copy; 2025 BA Copilot. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
