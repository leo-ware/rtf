export default function VisitPage() {
  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Visit / Events</h1>
        
        <div className="mb-12">
          <p className="text-lg text-gray-600 mb-8">
            Experience the magic of wild horses and burros up close at our sanctuary. We offer a variety of programs and events that allow you to connect with these magnificent animals while learning about conservation efforts.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="bg-gray-200 h-48 rounded-lg mb-4 flex items-center justify-center">
              <p className="text-gray-500">Photo Safari Image</p>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Photo Safaris</h3>
            <p className="text-gray-600 mb-4">
              Join our guided photo safaris to capture stunning images of wild horses and burros in their natural habitat. Perfect for photographers of all skill levels.
            </p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
              Book Photo Safari
            </button>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="bg-gray-200 h-48 rounded-lg mb-4 flex items-center justify-center">
              <p className="text-gray-500">Tour Image</p>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Guided Tours</h3>
            <p className="text-gray-600 mb-4">
              Take a guided tour of our sanctuary and learn about the individual horses and burros, their stories, and our conservation efforts.
            </p>
            <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
              Book Tour
            </button>
          </div>
        </div>
        
        <div className="bg-gray-50 p-8 rounded-lg mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Meet Spirit</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="bg-gray-200 h-64 rounded-lg mb-4 flex items-center justify-center">
                <p className="text-gray-500">Spirit Image</p>
              </div>
            </div>
            <div>
              <p className="text-gray-600 mb-4">
                Meet the real Spirit, the wild horse who inspired the DreamWorks animated movie &quot;Spirit: Stallion of the Cimarron.&quot; 
                Spirit arrived at Return to Freedom in 2002 following the filming of the movie and has been living in our sanctuary ever since.
              </p>
              <p className="text-gray-600 mb-6">
                Visitors can see Spirit during our tours and special events. He represents the spirit of freedom and the importance of protecting wild horses for future generations.
              </p>
              <button className="bg-red-600 text-white px-6 py-3 rounded-md hover:bg-red-700 transition-colors">
                Learn More About Spirit
              </button>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-gray-900 mb-3">Volunteer Opportunities</h3>
            <p className="text-gray-600 mb-4">
              Join our volunteer program and help with daily care, feeding, maintenance, and special events. Volunteers play a crucial role in our sanctuary operations.
            </p>
            <ul className="text-gray-600 mb-4 space-y-2">
              <li>• Daily horse and burro care</li>
              <li>• Facility maintenance</li>
              <li>• Event support</li>
              <li>• Administrative tasks</li>
            </ul>
            <button className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors">
              Become a Volunteer
            </button>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-gray-900 mb-3">Your Event at the Sanctuary</h3>
            <p className="text-gray-600 mb-4">
              Host your special event at our sanctuary! We offer unique venues for weddings, corporate events, educational programs, and other special occasions.
            </p>
            <ul className="text-gray-600 mb-4 space-y-2">
              <li>• Wedding ceremonies</li>
              <li>• Corporate retreats</li>
              <li>• Educational workshops</li>
              <li>• Photography sessions</li>
            </ul>
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors">
              Plan Your Event
            </button>
          </div>
        </div>
        
        <div className="bg-blue-50 p-8 rounded-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Upcoming Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-4 rounded-lg">
              <h3 className="font-bold text-gray-900 mb-2">Wild Horse Photography Workshop</h3>
              <p className="text-sm text-gray-600 mb-2">March 15, 2024</p>
              <p className="text-sm text-gray-600">Learn wildlife photography techniques with our resident horses.</p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <h3 className="font-bold text-gray-900 mb-2">Conservation Education Day</h3>
              <p className="text-sm text-gray-600 mb-2">April 20, 2024</p>
              <p className="text-sm text-gray-600">Family-friendly event with educational activities and horse interactions.</p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <h3 className="font-bold text-gray-900 mb-2">Volunteer Appreciation Day</h3>
              <p className="text-sm text-gray-600 mb-2">May 25, 2024</p>
              <p className="text-sm text-gray-600">Celebrating our amazing volunteers with special activities and recognition.</p>
            </div>
          </div>
          <div className="text-center mt-6">
            <a 
              href="/visit/calendar"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
            >
              View Full Calendar
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
