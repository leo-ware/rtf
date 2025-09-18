export default function AboutPage() {
  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">About Us</h1>
        <p className="text-lg text-gray-600 mb-8">
          Return to Freedom is a national nonprofit wild horse conservation organization dedicated to preserving the freedom, diversity, and habitat of America&apos;s wild horses and burros.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-600">
              We are dedicated to preserving the freedom, diversity, and habitat of America&apos;s wild horses and burros through sanctuary, education, advocacy, and conservation, while enriching the human spirit through direct experience with the natural world.
            </p>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Story</h2>
            <p className="text-gray-600">
              Founded in 1998, Return to Freedom has been at the forefront of wild horse conservation, providing sanctuary to hundreds of wild horses and burros while advocating for their protection on public lands.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
