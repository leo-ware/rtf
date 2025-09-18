export default function SubscribePage() {
  return (
    <div className="py-16">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Subscribe</h1>
        
        <div className="mb-12">
          <p className="text-lg text-gray-600 mb-8">
            Stay informed about wild horse conservation news, sanctuary updates, and ways you can help protect America&apos;s wild horses and burros.
          </p>
        </div>
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Subscribe to Our Newsletter</h2>
          
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input 
                type="email" 
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your email address"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
              <input 
                type="text" 
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your first name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
              <input 
                type="text" 
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your last name"
              />
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Newsletter Preferences</h3>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" defaultChecked />
                  <span className="text-sm text-gray-700">General newsletter and updates</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" defaultChecked />
                  <span className="text-sm text-gray-700">Action alerts and advocacy opportunities</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-sm text-gray-700">Event invitations and special programs</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-sm text-gray-700">Volunteer opportunities</span>
                </label>
              </div>
            </div>
            
            <div>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" required />
                <span className="text-sm text-gray-700">I agree to receive emails from Return to Freedom and understand I can unsubscribe at any time.</span>
              </label>
            </div>
            
            <button 
              type="submit"
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors text-lg font-medium"
            >
              Subscribe
            </button>
          </form>
        </div>
        
        <div className="mt-12 bg-gray-50 p-8 rounded-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">What You&apos;ll Receive</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Monthly Newsletter</h3>
              <p className="text-gray-600">Updates on our sanctuary, conservation efforts, and wild horse news.</p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Action Alerts</h3>
              <p className="text-gray-600">Important opportunities to take action for wild horse protection.</p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Event Invitations</h3>
              <p className="text-gray-600">Invitations to tours, photo safaris, and special events at our sanctuary.</p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Success Stories</h3>
              <p className="text-gray-600">Heartwarming stories about the horses and burros in our care.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
