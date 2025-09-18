import Link from "next/link"
import { FaFacebook, FaInstagram, FaYoutube, FaVimeo } from "react-icons/fa"
import { FaXTwitter } from "react-icons/fa6"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* About Us Section */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-gray-200">About Us</h3>
            <div className="mb-4">
              <h4 className="text-lg font-medium mb-2 text-white">RTF</h4>
              <p className="text-gray-300 text-sm leading-relaxed mb-4">
                Return to Freedom is a national nonprofit organization dedicated to wild horse preservation through sanctuary, education, conservation, and advocacy since 1998. It also operates the American Wild Horse Sanctuary at three California locations, caring for more than 450 wild horses and burros.
              </p>
            </div>
            <div className="space-y-1 text-sm">
              <p className="text-gray-300">PO Box 926, Lompoc, CA 93438 USA</p>
              <p className="text-gray-300">(805) 737-9246</p>
              <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">
                Email Us
              </Link>
            </div>
          </div>

          {/* Follow Us on Instagram */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-gray-200">Follow Us on Instagram</h3>
            <a 
              href="https://instagram.com/returntofreedom" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
            >
              <FaInstagram className="text-2xl" />
              <span>@returntofreedom</span>
            </a>
          </div>

          {/* Join Our Mailing List */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-gray-200">Join Our Mailing List</h3>
            <p className="text-gray-300 text-sm mb-4">
              Stay informed about events, volunteer opportunities, and the latest news.
            </p>
            <Link 
              href="/subscribe" 
              className="inline-block bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition-colors font-medium"
            >
              Sign Up
            </Link>
          </div>
        </div>

        {/* Bottom Copyright Section */}
        <div className="border-t border-gray-700 pt-8 pb-4">
          <div className="text-center">
            <p className="text-sm text-gray-400">
              ©2025 Return To Freedom. All Rights Reserved.{" "}
              <Link href="/privacy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>

        {/* Social Media Links Row */}
        <div className="border-t border-gray-700 pt-4">
          <div className="flex justify-center items-center space-x-6">
            <a 
              href="https://facebook.com/returntofreedom" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Facebook"
            >
              <FaFacebook className="text-lg" />
            </a>
            <a 
              href="https://youtube.com/returntofreedom" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="YouTube"
            >
              <FaYoutube className="text-lg" />
            </a>
            <a 
              href="https://twitter.com/returntofreedom" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="X (Twitter)"
            >
              <FaXTwitter className="text-lg" />
            </a>
            <a 
              href="https://vimeo.com/returntofreedom" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Vimeo"
            >
              <FaVimeo className="text-lg" />
            </a>
            <a 
              href="https://instagram.com/returntofreedom" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Instagram"
            >
              <FaInstagram className="text-lg" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
