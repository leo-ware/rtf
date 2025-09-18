export default function GetInvolvedPage() {
  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Get Involved</h1>
        
        <div className="mb-12">
          <p className="text-lg text-gray-600 mb-8">
            There are many ways to help protect and preserve America&apos;s wild horses and burros. Join us in our mission to ensure these magnificent animals continue to roam free on our public lands.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="bg-red-100 p-4 rounded-lg mb-4">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Donate</h3>
              <p className="text-gray-600">
                Your financial support helps us provide sanctuary, advocacy, and education programs for wild horses and burros.
              </p>
            </div>
            <button className="w-full bg-red-600 text-white px-6 py-3 rounded-md hover:bg-red-700 transition-colors">
              Donate Now
            </button>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="bg-blue-100 p-4 rounded-lg mb-4">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Sponsor a Horse</h3>
              <p className="text-gray-600">
                Become a monthly sponsor and help provide ongoing care for a specific horse or burro in our sanctuary.
              </p>
            </div>
            <button className="w-full bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors">
              Sponsor Now
            </button>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="bg-green-100 p-4 rounded-lg mb-4">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Volunteer</h3>
              <p className="text-gray-600">
                Join our volunteer program and help with daily care, events, and administrative tasks at our sanctuary.
              </p>
            </div>
            <button className="w-full bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-colors">
              Volunteer
            </button>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="bg-yellow-100 p-4 rounded-lg mb-4">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Advocate</h3>
              <p className="text-gray-600">
                Take action by contacting your representatives and spreading awareness about wild horse conservation issues.
              </p>
            </div>
            <button className="w-full bg-yellow-600 text-white px-6 py-3 rounded-md hover:bg-yellow-700 transition-colors">
              Take Action
            </button>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="bg-purple-100 p-4 rounded-lg mb-4">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Visit</h3>
              <p className="text-gray-600">
                Come see our horses and burros in person through tours, photo safaris, and special events.
              </p>
            </div>
            <button className="w-full bg-purple-600 text-white px-6 py-3 rounded-md hover:bg-purple-700 transition-colors">
              Plan Your Visit
            </button>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="bg-indigo-100 p-4 rounded-lg mb-4">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Subscribe</h3>
              <p className="text-gray-600">
                Stay informed about our work and wild horse conservation news through our newsletter and updates.
              </p>
            </div>
            <button className="w-full bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
        
        <div className="bg-gray-50 p-8 rounded-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Current Campaigns</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Demand BLM Accountability</h3>
              <p className="text-gray-600 mb-4">
                Join us in demanding accountability for violent behavior toward wild horses during roundup operations.
              </p>
              <button className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors">
                Take Action
              </button>
            </div>
            
            <div className="bg-white p-6 rounded-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Support Wyoming Horses</h3>
              <p className="text-gray-600 mb-4">
                Help us fight for the future of wild horses in Wyoming through legal advocacy and public support.
              </p>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
