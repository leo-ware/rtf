export default function PhotoSafarisPage() {
  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Photo Safaris</h1>
        
        <div className="mb-12">
          <p className="text-lg text-gray-600 mb-8">
            Capture stunning images of wild horses and burros in their natural habitat during our guided photo safaris. Perfect for photographers of all skill levels, from beginners to professionals.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Safari Options</h2>
            
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Morning Safari</h3>
                <p className="text-gray-600 mb-4">
                  Start your day with the horses as they greet the morning sun. Perfect lighting for capturing their natural beauty.
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-blue-600">$75 per person</span>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                    Book Now
                  </button>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Sunset Safari</h3>
                <p className="text-gray-600 mb-4">
                  Capture the magic of golden hour as the horses graze and interact in the warm evening light.
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-blue-600">$85 per person</span>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                    Book Now
                  </button>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Private Safari</h3>
                <p className="text-gray-600 mb-4">
                  Enjoy a personalized experience with one-on-one guidance and exclusive access to the horses.
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-blue-600">$150 per person</span>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">What to Expect</h2>
            
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Professional Guidance</h3>
                <p className="text-gray-600">
                  Our experienced guides will help you understand horse behavior and find the best angles for your shots.
                </p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Equipment Recommendations</h3>
                <p className="text-gray-600">
                  We&apos;ll provide guidance on camera settings and equipment to help you capture the perfect shot.
                </p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Safety First</h3>
                <p className="text-gray-600">
                  All safaris include safety briefings and guidelines for interacting with wild horses respectfully.
                </p>
              </div>
            </div>
            
            <div className="mt-8 bg-blue-50 p-6 rounded-lg">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Photography Tips</h3>
              <ul className="text-gray-600 space-y-2">
                <li>• Bring a telephoto lens (200mm or longer recommended)</li>
                <li>• Use a fast shutter speed to capture movement</li>
                <li>• Be patient and observe horse behavior</li>
                <li>• Respect the animals&apos; space and natural behavior</li>
                <li>• Consider the lighting conditions and time of day</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Gallery</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-200 h-48 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Photo Gallery Placeholder</p>
            </div>
            <div className="bg-gray-200 h-48 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Photo Gallery Placeholder</p>
            </div>
            <div className="bg-gray-200 h-48 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Photo Gallery Placeholder</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
