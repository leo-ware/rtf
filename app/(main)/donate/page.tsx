"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import DonationForm from "@/components/DonationForm";

export default function DonatePage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleDonationSuccess = (donationId: string, transactionId?: string) => {
    const params = new URLSearchParams();
    params.set("donationId", donationId);
    if (transactionId) {
      params.set("transactionId", transactionId);
    }
    router.push(`/donate/success?${params.toString()}`);
  };

  const handleDonationError = (errorMessage: string) => {
    setError(errorMessage);
    // Clear error after 5 seconds
    setTimeout(() => setError(null), 5000);
  };

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Donate</h1>
        
        <div className="mb-12">
          <p className="text-lg text-gray-600 mb-8">
            Your donation helps us provide sanctuary, advocacy, and education for America&apos;s wild horses and burros. Every contribution makes a difference in protecting these magnificent animals.
          </p>
        </div>
        
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-300 rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-red-800 font-medium">Error:</span>
              <span className="text-red-700 ml-1">{error}</span>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Make a Donation</h2>
              {!showForm && (
                <button
                  onClick={() => setShowForm(true)}
                  className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Start Donation
                </button>
              )}
            </div>
            
            {showForm ? (
              <div className="bg-white p-8 rounded-lg shadow-md">
                <DonationForm 
                  onSuccess={handleDonationSuccess}
                  onError={handleDonationError}
                />
              </div>
            ) : (
              <div className="bg-gray-50 p-8 rounded-lg text-center">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Ready to make a difference?</h3>
                <p className="text-gray-600 mb-6">Click &quot;Start Donation&quot; above to begin making your secure donation to help protect America&apos;s wild horses and burros.</p>
                <button
                  onClick={() => setShowForm(true)}
                  className="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium text-lg"
                >
                  Start Your Donation
                </button>
              </div>
            )}
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">How Your Donation Helps</h2>
            
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-bold text-gray-900 mb-2">$25 - Feed a Horse for a Week</h3>
                <p className="text-gray-600">Provides nutritious hay and feed for one horse for an entire week.</p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-bold text-gray-900 mb-2">$50 - Veterinary Care</h3>
                <p className="text-gray-600">Covers basic veterinary care and health monitoring for our horses and burros.</p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-bold text-gray-900 mb-2">$100 - Sanctuary Maintenance</h3>
                <p className="text-gray-600">Helps maintain fences, shelters, and other infrastructure at our sanctuary.</p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-bold text-gray-900 mb-2">$250 - Education Programs</h3>
                <p className="text-gray-600">Supports our educational programs for schools and community groups.</p>
              </div>
            </div>
            
            <div className="mt-8 bg-blue-50 p-6 rounded-lg">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Other Ways to Give</h3>
              <ul className="text-gray-600 space-y-2">
                <li>• Donate by check: PO Box 926, Lompoc, CA 93438</li>
                <li>• Sponsor a specific horse or burro</li>
                <li>• Include RTF in your will or estate planning</li>
                <li>• Corporate matching gifts</li>
                <li>• Donate through your workplace giving program</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
