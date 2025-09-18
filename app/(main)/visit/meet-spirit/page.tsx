export default function MeetSpiritPage() {
  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Meet Spirit</h1>
        
        <div className="mb-12">
          <p className="text-lg text-gray-600 mb-8">
            Meet the real Spirit, the wild horse who inspired the DreamWorks animated movie &quot;Spirit: Stallion of the Cimarron.&quot; Spirit&apos;s story represents the spirit of freedom and the importance of protecting wild horses for future generations.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          <div>
            <div className="bg-gray-200 h-96 rounded-lg mb-6 flex items-center justify-center">
              <p className="text-gray-500 text-lg">Spirit Photo Gallery</p>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-200 h-24 rounded-lg flex items-center justify-center">
                <p className="text-gray-500 text-sm">Photo 1</p>
              </div>
              <div className="bg-gray-200 h-24 rounded-lg flex items-center justify-center">
                <p className="text-gray-500 text-sm">Photo 2</p>
              </div>
              <div className="bg-gray-200 h-24 rounded-lg flex items-center justify-center">
                <p className="text-gray-500 text-sm">Photo 3</p>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Spirit&apos;s Story</h2>
            
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-bold text-gray-900 mb-3">The Movie Connection</h3>
                <p className="text-gray-600">
                  Spirit arrived at Return to Freedom in 2002 following the filming of the DreamWorks animated movie &quot;Spirit: Stallion of the Cimarron.&quot; He served as the inspiration and model for the beloved animated character.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-bold text-gray-900 mb-3">His Heritage</h3>
                <p className="text-gray-600">
                  Spirit is a Kiger Mustang, a rare and genetically pure strain of wild horse from Oregon. Kiger Mustangs are known for their distinctive dun coloring and primitive markings.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Life at the Sanctuary</h3>
                <p className="text-gray-600">
                  At Return to Freedom, Spirit lives in a natural herd environment where he can express his wild nature while being protected and cared for. He has become an ambassador for wild horse conservation.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 p-8 rounded-lg mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Visit Spirit</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Tour Options</h3>
              <p className="text-gray-600 mb-4">
                You can see Spirit during our regular sanctuary tours, or book a special &quot;Meet Spirit&quot; experience for a more intimate encounter with this legendary horse.
              </p>
              <ul className="text-gray-600 space-y-2 mb-6">
                <li>• General Sanctuary Tour - includes Spirit viewing</li>
                <li>• Special &quot;Meet Spirit&quot; Experience</li>
                <li>• Photo Safari with Spirit focus</li>
                <li>• Educational programs featuring Spirit</li>
              </ul>
              <button className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors">
                Book a Tour
              </button>
            </div>
            
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Spirit&apos;s Impact</h3>
              <p className="text-gray-600 mb-4">
                Spirit has helped educate thousands of visitors about wild horse conservation and the importance of protecting these magnificent animals. His story continues to inspire people of all ages.
              </p>
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-bold text-gray-900 mb-2">Fun Facts About Spirit</h4>
                <ul className="text-gray-600 space-y-1 text-sm">
                  <li>• Born in the wild in Oregon</li>
                  <li>• Approximately 25 years old</li>
                  <li>• Weighs about 1,000 pounds</li>
                  <li>• Known for his gentle nature</li>
                  <li>• Loves attention from visitors</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Support Spirit</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Sponsor Spirit</h3>
              <p className="text-gray-600 mb-4">
                Help provide ongoing care for Spirit through our sponsorship program.
              </p>
              <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
                Sponsor Spirit
              </button>
            </div>
            
            <div className="text-center">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Visit Spirit</h3>
              <p className="text-gray-600 mb-4">
                Book a tour to meet Spirit in person and learn his story.
              </p>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                Book Visit
              </button>
            </div>
            
            <div className="text-center">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Share His Story</h3>
              <p className="text-gray-600 mb-4">
                Help spread awareness about wild horse conservation.
              </p>
              <button className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors">
                Share Story
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
