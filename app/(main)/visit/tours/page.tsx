export default function ToursPage() {
  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Tours</h1>
        
        <div className="mb-12">
          <p className="text-lg text-gray-600 mb-8">
            Take a guided tour of our sanctuary and learn about the individual horses and burros, their stories, and our conservation efforts. Our knowledgeable guides will share insights about wild horse behavior and the challenges they face.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Tour Options</h2>
            
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold text-gray-900 mb-3">General Sanctuary Tour</h3>
                <p className="text-gray-600 mb-4">
                  A comprehensive 90-minute tour of our sanctuary, including visits to different horse and burro herds, learning about their individual stories and conservation efforts.
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-blue-600">$25 per person</span>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                    Book Tour
                  </button>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Family Tour</h3>
                <p className="text-gray-600 mb-4">
                  A family-friendly 60-minute tour designed for children and adults, with interactive activities and age-appropriate information about wild horses.
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-blue-600">$20 per person</span>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                    Book Tour
                  </button>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Educational Group Tour</h3>
                <p className="text-gray-600 mb-4">
                  A specialized 2-hour tour for school groups, organizations, and educational institutions with curriculum-aligned content and activities.
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-blue-600">$15 per person</span>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                    Book Tour
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Tour Information</h2>
            
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-bold text-gray-900 mb-3">What You&apos;ll See</h3>
                <ul className="text-gray-600 space-y-2">
                  <li>• Multiple horse and burro herds</li>
                  <li>• Natural family band structures</li>
                  <li>• Individual horses with unique stories</li>
                  <li>• Conservation facilities and programs</li>
                  <li>• Educational displays and information</li>
                </ul>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Tour Schedule</h3>
                <div className="text-gray-600 space-y-2">
                  <p><strong>Monday - Friday:</strong> 10:00 AM, 1:00 PM, 3:00 PM</p>
                  <p><strong>Saturday:</strong> 9:00 AM, 11:00 AM, 1:00 PM, 3:00 PM</p>
                  <p><strong>Sunday:</strong> 10:00 AM, 1:00 PM, 3:00 PM</p>
                </div>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-bold text-gray-900 mb-3">What to Bring</h3>
                <ul className="text-gray-600 space-y-2">
                  <li>• Comfortable walking shoes</li>
                  <li>• Water bottle</li>
                  <li>• Sun protection (hat, sunscreen)</li>
                  <li>• Camera (optional)</li>
                  <li>• Questions about wild horses!</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Meet Our Guides</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-gray-200 h-32 w-32 rounded-full mx-auto mb-4 flex items-center justify-center">
                <p className="text-gray-500 text-sm">Guide Photo</p>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Sarah Johnson</h3>
              <p className="text-gray-600 text-sm">Lead Guide & Education Coordinator</p>
            </div>
            <div className="text-center">
              <div className="bg-gray-200 h-32 w-32 rounded-full mx-auto mb-4 flex items-center justify-center">
                <p className="text-gray-500 text-sm">Guide Photo</p>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Mike Rodriguez</h3>
              <p className="text-gray-600 text-sm">Wildlife Specialist & Tour Guide</p>
            </div>
            <div className="text-center">
              <div className="bg-gray-200 h-32 w-32 rounded-full mx-auto mb-4 flex items-center justify-center">
                <p className="text-gray-500 text-sm">Guide Photo</p>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Emily Chen</h3>
              <p className="text-gray-600 text-sm">Conservation Educator</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
