"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import Link from "next/link";

export default function DonationSuccessPage() {
  const searchParams = useSearchParams();
  const donationId = searchParams.get("donationId") as Id<"donations"> | null;
  const transactionId = searchParams.get("transactionId");
  
  const donation = useQuery(
    api.donations.getDonation,
    donationId ? { donationId } : "skip"
  );

  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Clear any sensitive form data from browser history
    if (typeof window !== "undefined" && window.history.replaceState) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  if (!donationId || !transactionId) {
    return (
      <div className="py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Invalid Confirmation</h1>
            <p className="text-gray-600 mb-8">
              We couldn&apos;t find your donation details. If you just completed a donation, please check your email for a confirmation receipt.
            </p>
          </div>
          <Link
            href="/donate"
            className="inline-flex items-center px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
          >
            Return to Donation Page
          </Link>
        </div>
      </div>
    );
  }

  if (donation === undefined) {
    return (
      <div className="py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="animate-spin w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading donation details...</p>
        </div>
      </div>
    );
  }

  if (!donation) {
    return (
      <div className="py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Donation Not Found</h1>
          <p className="text-gray-600 mb-8">
            We couldn&apos;t find the donation details. Please contact us if you believe this is an error.
          </p>
          <Link
            href="/donate"
            className="inline-flex items-center px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
          >
            Return to Donation Page
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <div className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Thank You for Your Generous Donation!
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Your donation of {formatCurrency(donation.amount)} has been successfully processed.
          </p>
          <p className="text-gray-500">
            A confirmation email has been sent to {donation.donorEmail}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Donation Summary */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Donation Summary</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Amount:</span>
                <span className="font-semibold text-lg text-green-600">
                  {formatCurrency(donation.amount)}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Type:</span>
                <span className="font-medium">
                  {donation.isRecurring ? "Monthly Recurring" : "One-time"}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Date:</span>
                <span className="font-medium">
                  {formatDate(donation.completedAt || donation.createdAt)}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Transaction ID:</span>
                <span className="font-mono text-sm">{transactionId}</span>
              </div>
              
              {donation.dedicationType && donation.dedicationName && (
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Dedication:</span>
                    <div className="text-right">
                      <div className="font-medium">
                        In {donation.dedicationType} of {donation.dedicationName}
                      </div>
                      {donation.dedicationMessage && (
                        <div className="text-sm text-gray-500 mt-1">
                          &quot;{donation.dedicationMessage}&quot;
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="text-red-600 hover:text-red-700 text-sm font-medium"
              >
                {showDetails ? "Hide" : "Show"} Additional Details
              </button>
            </div>

            {showDetails && (
              <div className="mt-4 space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Donor Name:</span>
                  <span>{donation.isAnonymous ? "Anonymous" : donation.donorName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Email:</span>
                  <span>{donation.donorEmail}</span>
                </div>
                {donation.donorPhone && (
                  <div className="flex justify-between">
                    <span>Phone:</span>
                    <span>{donation.donorPhone}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Payment Method:</span>
                  <span className="capitalize">{donation.paymentMethod.replace("_", " ")}</span>
                </div>
              </div>
            )}
          </div>

          {/* Impact Information */}
          <div className="bg-red-50 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Impact</h2>
            
            <div className="space-y-6">
              {donation.amount >= 25 && (
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-600 rounded-full mt-2"></div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Feed a Horse for {Math.floor(donation.amount / 25)} Week{Math.floor(donation.amount / 25) !== 1 ? "s" : ""}</h3>
                    <p className="text-gray-600 text-sm">
                      Provides nutritious hay and feed for our rescued horses and burros.
                    </p>
                  </div>
                </div>
              )}
              
              {donation.amount >= 50 && (
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-600 rounded-full mt-2"></div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Veterinary Care</h3>
                    <p className="text-gray-600 text-sm">
                      Covers basic veterinary care and health monitoring for our animals.
                    </p>
                  </div>
                </div>
              )}
              
              {donation.amount >= 100 && (
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-600 rounded-full mt-2"></div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Sanctuary Maintenance</h3>
                    <p className="text-gray-600 text-sm">
                      Helps maintain fences, shelters, and other critical infrastructure.
                    </p>
                  </div>
                </div>
              )}
              
              {donation.amount >= 250 && (
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-600 rounded-full mt-2"></div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Education Programs</h3>
                    <p className="text-gray-600 text-sm">
                      Supports educational programs for schools and community groups.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-8 p-4 bg-white rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">What&apos;s Next?</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• You&apos;ll receive a tax-deductible receipt via email</li>
                <li>• We&apos;ll send you updates on how your donation is being used</li>
                {donation.isRecurring && (
                  <li>• Your monthly donation will be processed on the same date each month</li>
                )}
                <li>• You can visit our sanctuary or follow us on social media for updates</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="text-center mt-12 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/news"
              className="inline-flex items-center px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
            >
              Read Our Latest News
            </Link>
            <Link
              href="/visit"
              className="inline-flex items-center px-6 py-3 border border-red-600 text-red-600 font-medium rounded-lg hover:bg-red-50 transition-colors"
            >
              Plan a Visit
            </Link>
            <Link
              href="/get-involved"
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Other Ways to Help
            </Link>
          </div>
          
          <p className="text-gray-500 text-sm">
            Questions about your donation? Contact us at{" "}
            <a href="mailto:info@returntofreedom.org" className="text-red-600 hover:text-red-700">
              info@returntofreedom.org
            </a>
            {" "}or call (805) 737-9246
          </p>
        </div>
      </div>
    </div>
  );
}
