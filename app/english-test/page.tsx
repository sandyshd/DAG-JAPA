'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Logo from '@/app/components/Logo';
import { Send, AlertCircle, ArrowLeft, CheckCircle } from 'lucide-react';

export default function EnglishTestPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [testResponse, setTestResponse] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const newsImage = 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=600&fit=crop';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    // Validation
    const wordCount = testResponse.trim().split(/\s+/).filter(w => w.length > 0).length;
    if (wordCount < 50) {
      setError('Please write at least 50 words to demonstrate your English proficiency.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/english-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: session.user?.id,
          testData: testResponse,
          wordCount,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit test');
      }

      await response.json();
      setIsLoading(false);
      setSubmitted(true);
      setSuccessMessage('Test submitted successfully!');

      // Redirect to dashboard after 4 seconds
      setTimeout(() => {
        router.push('/dashboard');
      }, 4000);
    } catch (err) {
      setIsLoading(false);
      setError(err instanceof Error ? err.message : 'Failed to submit test. Please try again.');
    }
  };

  const handleBackToDashboard = () => {
    router.push('/dashboard');
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center animate-pulse">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
            </div>
            <h2 className="text-4xl font-bold text-green-600 mb-2">✓ Test Submitted!</h2>
            <p className="text-2xl font-semibold text-gray-900 mb-4">Your English Test has been successfully submitted</p>
            <p className="text-gray-600 mb-8">
              Thank you for completing the English Proficiency Test. Your response has been recorded and will be reviewed as part of your application evaluation.
            </p>

            <div className="bg-green-50 border-2 border-green-300 rounded-lg p-6 mb-8 text-left">
              <h3 className="font-semibold text-gray-900 mb-3 text-lg">What Happens Next:</h3>
              <ol className="space-y-3 text-sm text-gray-700">
                <li className="flex space-x-3">
                  <span className="font-bold text-green-600 flex-shrink-0 text-lg">1</span>
                  <span>Your English Test response will be evaluated by our assessment team</span>
                </li>
                <li className="flex space-x-3">
                  <span className="font-bold text-green-600 flex-shrink-0 text-lg">2</span>
                  <span>Combined with your application, we'll determine your eligibility</span>
                </li>
                <li className="flex space-x-3">
                  <span className="font-bold text-green-600 flex-shrink-0 text-lg">3</span>
                  <span>You'll receive results via email within 4-5 working days</span>
                </li>
                <li className="flex space-x-3">
                  <span className="font-bold text-green-600 flex-shrink-0 text-lg">4</span>
                  <span>Check your dashboard for updates and next steps</span>
                </li>
              </ol>
            </div>

            <button
              onClick={handleBackToDashboard}
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-bold text-lg"
            >
              Return to Dashboard
            </button>

            <p className="text-sm text-gray-500 mt-6">
              You will be redirected automatically in a few seconds...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-12 px-4">
      {/* Navigation Header */}
      <nav className="bg-white shadow-sm sticky top-0 z-50 mb-8 rounded-xl max-w-4xl mx-auto">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <Logo variant="full" href="/" clickable={true} />
            <button
              onClick={handleBackToDashboard}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Dashboard</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Instructions */}
          <div className="mb-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">English Proficiency Test</h1>
            <p className="text-lg text-gray-600 mb-6">
              Please read the scenario below and write a story or description based on the news image presented. This helps us assess your English language proficiency.
            </p>

            {/* Requirements */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
              <h3 className="font-bold text-gray-900 mb-3">Requirements:</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start space-x-2">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span>Minimum 50 words</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span>Clear and coherent writing</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span>Proper grammar and spelling</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span>Relevant to the image scenario</span>
                </li>
              </ul>
            </div>
          </div>

          {/* News Image */}
          <div className="mb-12">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Scenario Image:</h3>
            <div className="rounded-lg overflow-hidden border-2 border-gray-200 mb-6">
              <img
                src={newsImage}
                alt="News scenario for English test"
                className="w-full h-64 object-cover"
              />
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-gray-700">
                <strong>Scenario:</strong> Imagine you are a journalist covering this scene. Write a story describing what is happening, what led to this moment, and what should happen next. Be creative but realistic in your response.
              </p>
            </div>
          </div>

          {/* Test Response Form */}
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Your Response *
              </label>
              <textarea
                value={testResponse}
                onChange={(e) => setTestResponse(e.target.value)}
                placeholder="Write your story or description here. Tell us what you see, what's happening, and what should happen next..."
                rows={10}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  error ? 'border-red-500' : 'border-gray-200'
                }`}
              />
              <div className="flex items-center justify-between mt-3">
                <p className="text-sm text-gray-600">
                  Word count: <span className="font-bold">{testResponse.trim().split(/\s+/).filter(w => w.length > 0).length}</span> / minimum 50
                </p>
                {testResponse.trim().split(/\s+/).filter(w => w.length > 0).length >= 50 && (
                  <span className="text-green-600 text-sm font-semibold">✓ Requirements met</span>
                )}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm flex items-start space-x-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Success Message */}
            {successMessage && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 text-sm flex items-start space-x-2">
                <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-bold flex items-center justify-center space-x-2 disabled:opacity-75 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
              <span>{isLoading ? 'Submitting...' : 'Submit English Test'}</span>
            </button>
          </form>

          {/* Info Box */}
          <div className="mt-8 bg-gray-50 rounded-lg p-6">
            <p className="text-sm text-gray-600">
              Your response will be evaluated for English proficiency, creativity, and coherence. Take your time and write naturally. This is not a timed test.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
