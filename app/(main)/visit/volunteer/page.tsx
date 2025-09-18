export default function VolunteerPage() {
  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Volunteer</h1>
        
        <div className="mb-12">
          <p className="text-lg text-gray-600 mb-8">
            Join our volunteer program and make a direct impact on the lives of wild horses and burros. Our volunteers are essential to our mission and play a crucial role in providing care, education, and advocacy for these magnificent animals.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Volunteer Opportunities</h2>
            
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Animal Care</h3>
                <p className="text-gray-600 mb-4">
                  Help with daily feeding, watering, and health monitoring of our horses and burros. Perfect for those who want hands-on experience with wild animals.
                </p>
                <ul className="text-gray-600 space-y-1 text-sm">
                  <li>• Daily feeding and watering</li>
                  <li>• Health monitoring and reporting</li>
                  <li>• Facility maintenance and cleaning</li>
                  <li>• Seasonal care activities</li>
                </ul>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Education & Tours</h3>
                <p className="text-gray-600 mb-4">
                  Lead educational tours, assist with school programs, and help visitors learn about wild horse conservation.
                </p>
                <ul className="text-gray-600 space-y-1 text-sm">
                  <li>• Guided sanctuary tours</li>
                  <li>• Educational program assistance</li>
                  <li>• Visitor information and support</li>
                  <li>• Special event coordination</li>
                </ul>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Administrative Support</h3>
                <p className="text-gray-600 mb-4">
                  Help with office tasks, fundraising events, and administrative duties that keep our organization running smoothly.
                </p>
                <ul className="text-gray-600 space-y-1 text-sm">
                  <li>• Data entry and record keeping</li>
                  <li>• Event planning and coordination</li>
                  <li>• Fundraising support</li>
                  <li>• Social media and marketing</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Volunteer Requirements</h2>
            
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Time Commitment</h3>
                <p className="text-gray-600 mb-3">
                  We ask for a minimum commitment to ensure consistency in care and training:
                </p>
                <ul className="text-gray-600 space-y-1">
                  <li>• Minimum 4 hours per week</li>
                  <li>• 3-month minimum commitment</li>
                  <li>• Flexible scheduling available</li>
                  <li>• Weekend and weekday opportunities</li>
                </ul>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Physical Requirements</h3>
                <p className="text-gray-600 mb-3">
                  Some volunteer positions require physical activity:
                </p>
                <ul className="text-gray-600 space-y-1">
                  <li>• Ability to lift 25-50 pounds</li>
                  <li>• Comfortable walking on uneven terrain</li>
                  <li>• Ability to work in various weather conditions</li>
                  <li>• Good physical stamina</li>
                </ul>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Training & Orientation</h3>
                <p className="text-gray-600 mb-3">
                  All volunteers receive comprehensive training:
                </p>
                <ul className="text-gray-600 space-y-1">
                  <li>• Orientation session (2 hours)</li>
                  <li>• Safety training and protocols</li>
                  <li>• Animal behavior education</li>
                  <li>• Ongoing support and guidance</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-8 rounded-lg shadow-md mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">How to Apply</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Complete Application</h3>
              <p className="text-gray-600 text-sm">
                Fill out our volunteer application form with your interests, availability, and relevant experience.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Attend Orientation</h3>
              <p className="text-gray-600 text-sm">
                Participate in our orientation session to learn about our mission, safety protocols, and volunteer opportunities.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Start Volunteering</h3>
              <p className="text-gray-600 text-sm">
                Begin your volunteer journey and make a difference in the lives of wild horses and burros.
              </p>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <button className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 transition-colors text-lg font-medium">
              Apply to Volunteer
            </button>
          </div>
        </div>
        
        <div className="bg-gray-50 p-8 rounded-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Volunteer Testimonials</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg">
              <p className="text-gray-600 mb-4">
                                &quot;Volunteering at Return to Freedom has been one of the most rewarding experiences of my life. Getting to know the individual horses and their stories has deepened my appreciation for wild horse conservation.&quot;
              </p>
              <p className="font-bold text-gray-900">- Sarah M., Volunteer for 2 years</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg">
              <p className="text-gray-600 mb-4">
                                                &quot;The education and training I received as a volunteer has been invaluable. I&apos;ve learned so much about wild horse behavior and conservation, and I love sharing that knowledge with visitors.&quot;
              </p>
              <p className="font-bold text-gray-900">- Mike R., Tour Guide Volunteer</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
