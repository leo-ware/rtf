import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-slate-100 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">
              Resources
            </h3>
            <ul className="space-y-2">
              <li>
                <a 
                  href="https://docs.convex.dev/home" 
                  className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Convex Docs
                </a>
              </li>
              <li>
                <a 
                  href="https://www.convex.dev/templates" 
                  className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Templates
                </a>
              </li>
              <li>
                <a 
                  href="https://www.convex.dev/community" 
                  className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Discord Community
                </a>
              </li>
            </ul>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">
              Navigation
            </h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/" 
                  className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  href="/server" 
                  className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Server Route
                </Link>
              </li>
              <li>
                <Link 
                  href="/signin" 
                  className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* Technology */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">
              Technology
            </h3>
            <ul className="space-y-2">
              <li>
                <a 
                  href="https://nextjs.org" 
                  className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Next.js
                </a>
              </li>
              <li>
                <a 
                  href="https://convex.dev" 
                  className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Convex
                </a>
              </li>
              <li>
                <a 
                  href="https://tailwindcss.com" 
                  className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Tailwind CSS
                </a>
              </li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">
              About
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Built with Convex, Next.js, and Convex Auth for real-time applications.
            </p>
          </div>
        </div>

        <div className="border-t border-slate-200 dark:border-slate-700 mt-8 pt-8 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-500">
            © 2024 Convex + Next.js App. Built with ❤️ using modern web technologies.
          </p>
        </div>
      </div>
    </footer>
  )
}
