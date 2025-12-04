'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function ThankYouPage() {
  useEffect(() => {
    // Clear pending application data from session storage
    sessionStorage.removeItem('pendingApplicationData');
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
        <div className="flex justify-center mb-4">
          <div className="bg-green-100 rounded-full p-4">
            <svg
              className="w-12 h-12 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Thank You!
        </h1>

        <p className="text-center text-gray-600 mb-6">
          Your application has been successfully submitted. We've sent a confirmation email to your address.
        </p>

        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-600 mb-2 text-center">Next Steps:</p>
          <ul className="text-sm text-gray-700 space-y-2">
            <li className="flex items-start">
              <span className="text-indigo-600 mr-2">✓</span>
              <span>Check your email for payment confirmation</span>
            </li>
            <li className="flex items-start">
              <span className="text-indigo-600 mr-2">✓</span>
              <span>Set your password using the link in your welcome email</span>
            </li>
            <li className="flex items-start">
              <span className="text-indigo-600 mr-2">✓</span>
              <span>Return here to complete your profile (coming soon)</span>
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <Link
            href="/auth/login"
            className="w-full inline-block text-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
          >
            Go to Login
          </Link>
          <Link
            href="/"
            className="w-full inline-block text-center bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg transition duration-200"
          >
            Back to Home
          </Link>
        </div>

        <p className="text-xs text-gray-500 text-center mt-6">
          Questions? Contact our support team at support@japa.com
        </p>
      </div>
    </div>
  );
}
