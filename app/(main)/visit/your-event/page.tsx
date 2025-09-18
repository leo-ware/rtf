export default function YourEventPage() {
  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Your Event at the Wild Horse Sanctuary</h1>
        
        <div className="mb-12">
          <p className="text-lg text-gray-600 mb-8">
            Host your special event at our beautiful sanctuary and create unforgettable memories while supporting wild horse conservation. Our unique venue offers a magical setting for weddings, corporate events, educational programs, and other special occasions.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Event Types</h2>
            
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Weddings & Ceremonies</h3>
                <p className="text-gray-600 mb-4">
                  Exchange vows in the presence of wild horses with our stunning natural backdrop. Perfect for intimate ceremonies and unique wedding experiences.
                </p>
                <ul className="text-gray-600 space-y-1 text-sm">
                  <li>• Outdoor ceremony spaces</li>
                  <li>• Reception areas with mountain views</li>
                  <li>• Photography opportunities with horses</li>
                  <li>• Catering and vendor coordination</li>
                </ul>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Corporate Events</h3>
                <p className="text-gray-600 mb-4">
                  Host team building activities, retreats, and corporate gatherings in a unique and inspiring environment that promotes conservation awareness.
                </p>
                <ul className="text-gray-600 space-y-1 text-sm">
                  <li>• Team building with horses</li>
                  <li>• Meeting and conference spaces</li>
                  <li>• Leadership development programs</li>
                  <li>• Corporate social responsibility events</li>
                </ul>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Educational Programs</h3>
                <p className="text-gray-600 mb-4">
                  Create meaningful learning experiences for schools, organizations, and groups interested in wildlife conservation and environmental education.
                </p>
                <ul className="text-gray-600 space-y-1 text-sm">
                  <li>• School field trips and programs</li>
                  <li>• Environmental education workshops</li>
                  <li>• Conservation awareness events</li>
                  <li>• Youth leadership programs</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Venue Features</h2>
            
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Outdoor Spaces</h3>
                <ul className="text-gray-600 space-y-2">
                  <li>• Scenic ceremony areas with mountain views</li>
                  <li>• Covered pavilion for receptions</li>
                  <li>• Multiple gathering spaces for different group sizes</li>
                  <li>• Natural amphitheater for presentations</li>
                  <li>• Horse viewing areas and photo opportunities</li>
                </ul>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Amenities</h3>
                <ul className="text-gray-600 space-y-2">
                  <li>• Restroom facilities</li>
                  <li>• Parking for up to 100 vehicles</li>
                  <li>• Sound system and AV equipment</li>
                  <li>• Tables and chairs for events</li>
                  <li>• Kitchen facilities for catering</li>
                  <li>• Climate-controlled meeting rooms</li>
                </ul>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Capacity</h3>
                <div className="text-gray-600 space-y-2">
                  <p><strong>Ceremonies:</strong> Up to 150 guests</p>
                  <p><strong>Receptions:</strong> Up to 100 guests</p>
                  <p><strong>Corporate Events:</strong> Up to 75 guests</p>
                  <p><strong>Educational Programs:</strong> Up to 50 participants</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-8 rounded-lg shadow-md mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Event Packages</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Basic Package</h3>
              <div className="text-2xl font-bold text-blue-600 mb-4">$500</div>
              <ul className="text-gray-600 space-y-2 mb-6">
                <li>• 4-hour venue rental</li>
                <li>• Basic setup and cleanup</li>
                <li>• Tables and chairs</li>
                <li>• Restroom access</li>
                <li>• Parking</li>
              </ul>
              <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                Book Basic Package
              </button>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg border-2 border-blue-500">
              <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-bold mb-4 inline-block">Most Popular</div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Premium Package</h3>
              <div className="text-2xl font-bold text-blue-600 mb-4">$800</div>
              <ul className="text-gray-600 space-y-2 mb-6">
                <li>• 6-hour venue rental</li>
                <li>• Full setup and cleanup</li>
                <li>• Tables, chairs, and linens</li>
                <li>• Sound system and AV equipment</li>
                <li>• Event coordination support</li>
                <li>• Horse interaction opportunities</li>
              </ul>
              <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                Book Premium Package
              </button>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Deluxe Package</h3>
              <div className="text-2xl font-bold text-blue-600 mb-4">$1,200</div>
              <ul className="text-gray-600 space-y-2 mb-6">
                <li>• 8-hour venue rental</li>
                <li>• Full-service event management</li>
                <li>• Premium setup and decorations</li>
                <li>• Professional sound and lighting</li>
                <li>• Dedicated event coordinator</li>
                <li>• Guided horse tours for guests</li>
                <li>• Photography opportunities</li>
              </ul>
              <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                Book Deluxe Package
              </button>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 p-8 rounded-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Plan Your Event</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Contact Us</h3>
              <p className="text-gray-600 mb-4">
                Ready to plan your special event? Contact our events team to discuss your needs and availability.
              </p>
              <div className="space-y-2 text-gray-600">
                <p><strong>Phone:</strong> (805) 737-9246</p>
                <p><strong>Email:</strong> events@returntofreedom.org</p>
                <p><strong>Address:</strong> PO Box 926, Lompoc, CA 93438</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Event Planning Checklist</h3>
              <ul className="text-gray-600 space-y-2">
                <li>• Choose your event date and time</li>
                <li>• Determine guest count and event type</li>
                <li>• Select your package and add-ons</li>
                <li>• Arrange catering and vendors</li>
                <li>• Plan transportation and parking</li>
                <li>• Consider weather backup plans</li>
                <li>• Book photography and entertainment</li>
              </ul>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <button className="bg-green-600 text-white px-8 py-3 rounded-md hover:bg-green-700 transition-colors text-lg font-medium">
              Start Planning Your Event
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
