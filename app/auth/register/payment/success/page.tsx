'use client';

import { useEffect, useState, Suspense, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, AlertCircle, Clock } from 'lucide-react';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const hasRun = useRef(false);
  const [stage, setStage] = useState<'loading' | 'processing' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);
  const [applicationId, setApplicationId] = useState<string | null>(null);
  const [processingSteps, setProcessingSteps] = useState<{
    verification: boolean;
    application: boolean;
    email: boolean;
  }>({
    verification: false,
    application: false,
    email: false,
  });

  useEffect(() => {
    // Prevent duplicate calls in React Strict Mode
    if (hasRun.current) {
      return;
    }
    hasRun.current = true;

    const completeRegistration = async () => {
      try {
        const sessionId = searchParams.get('session_id');

        if (!sessionId) {
          setError('Invalid session. Please try again.');
          setStage('error');
          return;
        }

        setStage('processing');

        // Step 1: Verify payment with backend
        console.log('Step 1: Verifying payment...');
        const verifyResponse = await fetch('/api/payments/verify-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ sessionId }),
        });

        if (!verifyResponse.ok) {
          throw new Error('Failed to verify payment');
        }

        const verifyData = await verifyResponse.json();

        if (!verifyData.success) {
          setError(verifyData.error || 'Payment verification failed');
          setStage('error');
          return;
        }

        setProcessingSteps((prev) => ({ ...prev, verification: true }));

        // Step 2: Get pending application data from session storage
        const pendingData = sessionStorage.getItem('pendingApplicationData');

        // Step 3: Create application after payment
        console.log('Step 2: Creating application and user account...');
        const applicationResponse = await fetch('/api/payments/complete-application', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sessionId,
            ...(pendingData ? JSON.parse(pendingData) : {}),
          }),
        });

        if (!applicationResponse.ok) {
          const appData = await applicationResponse.json();
          throw new Error(appData.error || 'Failed to create application');
        }

        const appData = await applicationResponse.json();

        if (!appData.success) {
          setError(appData.error || 'Failed to create application');
          setStage('error');
          return;
        }

        setApplicationId(appData.applicationId);
        setProcessingSteps((prev) => ({ ...prev, application: true }));

        // Step 4: Clear pending data
        console.log('Step 3: Cleaning up session data...');
        sessionStorage.removeItem('pendingApplicationData');

        // All steps complete
        setProcessingSteps((prev) => ({ ...prev, email: true }));
        
        // Transition to success page after showing processing completion
        setTimeout(() => {
          setStage('success');
        }, 1500);
      } catch (err) {
        console.error('Error completing registration:', err);
        setError(
          err instanceof Error ? err.message : 'An error occurred while processing your registration'
        );
        setStage('error');
      }
    };

    completeRegistration();
  }, [searchParams]);

  if (stage === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
          <div className="flex justify-center mb-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
            Processing Payment
          </h1>
          <p className="text-center text-gray-600">
            Please wait while we confirm your payment and finalize your registration...
          </p>
        </div>
      </div>
    );
  }

  if (stage === 'processing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Completing Your Registration
          </h1>

          <div className="space-y-4">
            {/* Payment Verification Step */}
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-1">
                {processingSteps.verification ? (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                ) : (
                  <Clock className="w-6 h-6 text-indigo-600 animate-spin" />
                )}
              </div>
              <div className="flex-grow">
                <p className={`font-medium ${processingSteps.verification ? 'text-green-700' : 'text-gray-700'}`}>
                  Verifying Payment
                </p>
                <p className="text-xs text-gray-500">Confirming your transaction with Stripe</p>
              </div>
            </div>

            {/* Application Creation Step */}
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-1">
                {processingSteps.application ? (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                ) : (
                  <div className={`w-6 h-6 rounded-full border-2 ${processingSteps.verification ? 'border-indigo-600 animate-spin' : 'border-gray-300'}`}></div>
                )}
              </div>
              <div className="flex-grow">
                <p className={`font-medium ${processingSteps.application ? 'text-green-700' : 'text-gray-700'}`}>
                  Creating Your Account
                </p>
                <p className="text-xs text-gray-500">Setting up user account and application record</p>
              </div>
            </div>

            {/* Email Notification Step */}
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-1">
                {processingSteps.email ? (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                ) : (
                  <div className={`w-6 h-6 rounded-full border-2 ${processingSteps.application ? 'border-indigo-600 animate-spin' : 'border-gray-300'}`}></div>
                )}
              </div>
              <div className="flex-grow">
                <p className={`font-medium ${processingSteps.email ? 'text-green-700' : 'text-gray-700'}`}>
                  Sending Welcome Email
                </p>
                <p className="text-xs text-gray-500">Welcome email with password setup link</p>
              </div>
            </div>
          </div>

          <p className="text-center text-gray-600 text-sm mt-8">
            This may take a few moments...
          </p>
        </div>
      </div>
    );
  }

  if (stage === 'error') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
          <div className="flex justify-center mb-4">
            <AlertCircle className="w-12 h-12 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
            Error Processing Registration
          </h1>
          <p className="text-center text-gray-600 mb-6">{error}</p>
          <Link
            href="/auth/register"
            className="w-full inline-block text-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
          >
            Back to Registration
          </Link>
        </div>
      </div>
    );
  }

  // Success stage
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
        <div className="flex justify-center mb-4">
          <div className="bg-green-100 rounded-full p-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Thank You!
        </h1>

        <p className="text-center text-gray-600 mb-6">
          Your registration and payment have been successfully completed.
        </p>

        {applicationId && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 text-center">
            <p className="text-xs text-gray-600 mb-1">Application ID</p>
            <p className="text-lg font-bold text-gray-900">{applicationId}</p>
          </div>
        )}

        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-700 font-semibold mb-3">What's Next:</p>
          <ul className="text-sm text-gray-700 space-y-2">
            <li className="flex items-start">
              <span className="text-indigo-600 mr-2 font-bold">1.</span>
              <span>Check your email for payment confirmation and welcome message</span>
            </li>
            <li className="flex items-start">
              <span className="text-indigo-600 mr-2 font-bold">2.</span>
              <span>Click the password setup link in your welcome email to secure your account</span>
            </li>
            <li className="flex items-start">
              <span className="text-indigo-600 mr-2 font-bold">3.</span>
              <span>Sign in with your email and the password you create</span>
            </li>
            <li className="flex items-start">
              <span className="text-indigo-600 mr-2 font-bold">4.</span>
              <span>Complete your profile and review your application details</span>
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

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
