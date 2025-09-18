export default function BurrosPage() {
  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Burros</h1>
        
        <div className="mb-12">
          <p className="text-lg text-gray-600 mb-8">
            Our sanctuary is home to 29 wild burros, each with their own unique personality and story. These intelligent and gentle animals are an important part of America&apos;s wild heritage and deserve the same protection and respect as wild horses.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="bg-gray-200 h-48 rounded-lg mb-4 flex items-center justify-center">
              <p className="text-gray-500">Burro Image Placeholder</p>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Freya</h3>
            <p className="text-gray-600 mb-4">
              A gentle and curious burro who loves attention from visitors and is always ready for a treat.
            </p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
              Sponsor Freya
            </button>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="bg-gray-200 h-48 rounded-lg mb-4 flex items-center justify-center">
              <p className="text-gray-500">Burro Image Placeholder</p>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Desert Rose</h3>
            <p className="text-gray-600 mb-4">
              A resilient burro who survived harsh conditions in the desert before finding sanctuary with us.
            </p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
              Learn More
            </button>
          </div>
        </div>
        
        <div className="bg-gray-50 p-8 rounded-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">About Wild Burros</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">History</h3>
              <p className="text-gray-600 mb-4">
                Wild burros are descendants of pack animals brought to North America by Spanish explorers in the 1500s. They have adapted to survive in some of the harshest environments in the American West.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Conservation Status</h3>
              <p className="text-gray-600 mb-4">
                Like wild horses, burros face threats from habitat loss, roundups, and competition for resources. They are protected under the Wild Free-Roaming Horses and Burros Act of 1971.
              </p>
            </div>
          </div>
          
          <div className="mt-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Sponsor a Burro</h3>
            <p className="text-gray-600 mb-6">
              Help us care for these amazing animals by becoming a burro sponsor. Your support helps provide food, veterinary care, and a safe home for our burros.
            </p>
            <button className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-colors">
              Sponsor a Burro
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
