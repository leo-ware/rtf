"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

interface DonationFormData {
  amount: number;
  isRecurring: boolean;
  donorName: string;
  donorEmail: string;
  donorPhone?: string;
  isAnonymous: boolean;
  dedicationType?: "honor" | "memory";
  dedicationName?: string;
  dedicationMessage?: string;
  paymentMethod: string;
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  billingZip?: string;
}

interface DonationFormProps {
  onSuccess: (donationId: string, transactionId?: string) => void;
  onError: (error: string) => void;
}

export default function DonationForm({ onSuccess, onError }: DonationFormProps) {
  const [formData, setFormData] = useState<DonationFormData>({
    amount: 0,
    isRecurring: false,
    donorName: "",
    donorEmail: "",
    donorPhone: "",
    isAnonymous: false,
    dedicationType: undefined,
    dedicationName: "",
    dedicationMessage: "",
    paymentMethod: "credit_card",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    billingZip: "",
  });

  const [customAmount, setCustomAmount] = useState("");
  const [showDedication, setShowDedication] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);

  const createDonation = useMutation(api.donations.createDonation);

  const predefinedAmounts = [25, 50, 100, 250, 500];

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setFormData(prev => ({ ...prev, amount }));
    setCustomAmount("");
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue > 0) {
      setFormData(prev => ({ ...prev, amount: numValue }));
      setSelectedAmount(null);
    }
  };

  const handleInputChange = (field: keyof DonationFormData, value: string | number | boolean | undefined) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const formatCardNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    const formatted = numbers.replace(/(\d{4})(?=\d)/g, '$1 ');
    return formatted.substring(0, 19); // Max length for formatted card number
  };

  const formatExpiryDate = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length >= 2) {
      return numbers.substring(0, 2) + '/' + numbers.substring(2, 4);
    }
    return numbers;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.amount <= 0) {
      onError("Please select or enter a donation amount");
      return;
    }

    if (!formData.donorName.trim()) {
      onError("Please enter your name");
      return;
    }

    if (!formData.donorEmail.trim()) {
      onError("Please enter your email");
      return;
    }

    if (!formData.cardNumber || formData.cardNumber.replace(/\D/g, '').length < 13) {
      onError("Please enter a valid card number");
      return;
    }

    if (!formData.expiryDate || formData.expiryDate.length < 5) {
      onError("Please enter a valid expiry date");
      return;
    }

    if (!formData.cvv || formData.cvv.length < 3) {
      onError("Please enter a valid CVV");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await createDonation({
        amount: formData.amount,
        currency: "USD",
        donorName: formData.donorName,
        donorEmail: formData.donorEmail,
        donorPhone: formData.donorPhone || undefined,
        isAnonymous: formData.isAnonymous,
        isRecurring: formData.isRecurring,
        dedicationType: formData.dedicationType,
        dedicationName: formData.dedicationName || undefined,
        dedicationMessage: formData.dedicationMessage || undefined,
        paymentMethod: formData.paymentMethod,
        cardToken: `card_${formData.cardNumber.replace(/\D/g, '').slice(-4)}`, // Mock token
      });

      if (result.success) {
        onSuccess(result.donationId, result.transactionId);
      } else {
        onError(result.error || "Payment failed");
      }
    } catch (error) {
      // @ts-ignore
      onError("An error occurred while processing your donation");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Amount Selection */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Donation Amount</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
          {predefinedAmounts.map((amount) => (
            <button
              key={amount}
              type="button"
              onClick={() => handleAmountSelect(amount)}
              className={`px-4 py-3 rounded-lg border text-center font-medium transition-colors ${
                selectedAmount === amount
                  ? "bg-red-600 text-white border-red-600"
                  : "border-gray-300 text-gray-700 hover:border-red-500 hover:text-red-600"
              }`}
            >
              ${amount}
            </button>
          ))}
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Custom Amount
          </label>
          <div className="relative">
            <span className="absolute left-3 top-3 text-gray-500">$</span>
            <input
              type="number"
              value={customAmount}
              onChange={(e) => handleCustomAmountChange(e.target.value)}
              className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="Enter amount"
              min="1"
              step="0.01"
            />
          </div>
        </div>

        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.isRecurring}
            onChange={(e) => handleInputChange("isRecurring", e.target.checked)}
            className="mr-2 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
          />
          <span className="text-sm text-gray-700">Make this a monthly donation</span>
        </label>
      </div>

      {/* Donor Information */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={formData.donorName}
              onChange={(e) => handleInputChange("donorName", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="Your full name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              required
              value={formData.donorEmail}
              onChange={(e) => handleInputChange("donorEmail", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="your.email@example.com"
            />
          </div>
        </div>
        
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number (optional)
          </label>
          <input
            type="tel"
            value={formData.donorPhone}
            onChange={(e) => handleInputChange("donorPhone", e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            placeholder="(555) 123-4567"
          />
        </div>

        <div className="mt-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.isAnonymous}
              onChange={(e) => handleInputChange("isAnonymous", e.target.checked)}
              className="mr-2 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
            />
            <span className="text-sm text-gray-700">Make this donation anonymous</span>
          </label>
        </div>
      </div>

      {/* Dedication */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Dedication (optional)</h3>
          <button
            type="button"
            onClick={() => setShowDedication(!showDedication)}
            className="text-sm text-red-600 hover:text-red-700"
          >
            {showDedication ? "Hide" : "Add dedication"}
          </button>
        </div>
        
        {showDedication && (
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dedication Type
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="dedicationType"
                    value="honor"
                    checked={formData.dedicationType === "honor"}
                    onChange={(e) => handleInputChange("dedicationType", e.target.value as "honor")}
                    className="mr-2 h-4 w-4 text-red-600 focus:ring-red-500"
                  />
                  <span className="text-sm text-gray-700">In honor of</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="dedicationType"
                    value="memory"
                    checked={formData.dedicationType === "memory"}
                    onChange={(e) => handleInputChange("dedicationType", e.target.value as "memory")}
                    className="mr-2 h-4 w-4 text-red-600 focus:ring-red-500"
                  />
                  <span className="text-sm text-gray-700">In memory of</span>
                </label>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              <input
                type="text"
                value={formData.dedicationName}
                onChange={(e) => handleInputChange("dedicationName", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="Name of person being honored/remembered"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message (optional)
              </label>
              <textarea
                value={formData.dedicationMessage}
                onChange={(e) => handleInputChange("dedicationMessage", e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="Add a personal message..."
              />
            </div>
          </div>
        )}
      </div>

      {/* Payment Information */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Information</h3>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Card Number *
          </label>
          <input
            type="text"
            required
            value={formData.cardNumber}
            onChange={(e) => handleInputChange("cardNumber", formatCardNumber(e.target.value))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            placeholder="1234 5678 9012 3456"
            maxLength={19}
          />
        </div>
        
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expiry Date *
            </label>
            <input
              type="text"
              required
              value={formData.expiryDate}
              onChange={(e) => handleInputChange("expiryDate", formatExpiryDate(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="MM/YY"
              maxLength={5}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              CVV *
            </label>
            <input
              type="text"
              required
              value={formData.cvv}
              onChange={(e) => handleInputChange("cvv", e.target.value.replace(/\D/g, ''))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="123"
              maxLength={4}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ZIP Code *
            </label>
            <input
              type="text"
              required
              value={formData.billingZip}
              onChange={(e) => handleInputChange("billingZip", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="12345"
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-6">
        <button
          type="submit"
          disabled={isSubmitting || formData.amount <= 0}
          className="w-full bg-red-600 text-white px-8 py-4 rounded-lg hover:bg-red-700 transition-colors text-lg font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            `Donate ${formData.amount > 0 ? '$' + formData.amount.toFixed(2) : ''} Now`
          )}
        </button>
        
        <p className="text-xs text-gray-500 text-center mt-2">
          This is a secure donation form. Your payment information is encrypted and protected.
        </p>
      </div>
    </form>
  );
}
