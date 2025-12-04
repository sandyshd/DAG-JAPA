'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function PaymentCancelPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
        <div className="flex justify-center mb-4">
          <div className="bg-yellow-100 rounded-full p-4">
            <svg
              className="w-8 h-8 text-yellow-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
          Payment Canceled
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Your payment has been canceled. If you encountered any issues, please try again.
        </p>
        <div className="space-y-3">
          <button
            onClick={() => router.back()}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
          >
            Try Again
          </button>
          <Link
            href="/auth/register"
            className="w-full inline-block text-center bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg transition duration-200"
          >
            Back to Registration
          </Link>
        </div>
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-gray-600">
            <strong>Need help?</strong> If you have any questions about your payment, please contact our support team.
          </p>
        </div>
      </div>
    </div>
  );
}
