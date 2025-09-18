export default function ProgramsPage() {
  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Programs and Events</h1>
        
        <div className="mb-12">
          <p className="text-lg text-gray-600 mb-8">
            Join us for a variety of educational programs and special events designed to connect you with wild horses and burros while learning about conservation efforts.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="bg-gray-200 h-48 rounded-lg mb-4 flex items-center justify-center">
              <p className="text-gray-500">Educational Program Image</p>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Educational Programs</h3>
            <p className="text-gray-600 mb-4">
              Learn about wild horse behavior, conservation challenges, and the importance of protecting these magnificent animals through our educational programs.
            </p>
            <ul className="text-gray-600 mb-4 space-y-2">
              <li>• School group visits</li>
              <li>• Conservation workshops</li>
              <li>• Wildlife education sessions</li>
              <li>• Interactive learning experiences</li>
            </ul>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
              Learn More
            </button>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="bg-gray-200 h-48 rounded-lg mb-4 flex items-center justify-center">
              <p className="text-gray-500">Special Event Image</p>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Special Events</h3>
            <p className="text-gray-600 mb-4">
              Join us for special events throughout the year, including fundraisers, awareness campaigns, and community celebrations.
            </p>
            <ul className="text-gray-600 mb-4 space-y-2">
              <li>• Annual fundraising galas</li>
              <li>• Wild horse awareness days</li>
              <li>• Community open houses</li>
              <li>• Holiday celebrations</li>
            </ul>
            <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
              View Events
            </button>
          </div>
        </div>
        
        <div className="bg-gray-50 p-8 rounded-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Upcoming Programs</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-4 rounded-lg">
              <h3 className="font-bold text-gray-900 mb-2">Wild Horse Behavior Workshop</h3>
              <p className="text-sm text-gray-600 mb-2">March 20, 2024</p>
              <p className="text-sm text-gray-600">Learn about natural horse behavior and herd dynamics.</p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <h3 className="font-bold text-gray-900 mb-2">Conservation Education Day</h3>
              <p className="text-sm text-gray-600 mb-2">April 15, 2024</p>
              <p className="text-sm text-gray-600">Family-friendly event with educational activities.</p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <h3 className="font-bold text-gray-900 mb-2">Youth Leadership Program</h3>
              <p className="text-sm text-gray-600 mb-2">May 10, 2024</p>
              <p className="text-sm text-gray-600">Empowering young conservation leaders.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
