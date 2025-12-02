import { useState } from 'react';
import { Mail, ArrowLeft, CheckCircle, Globe } from 'lucide-react';

interface ForgotPasswordProps {
  onBackToLogin?: () => void;
}

const ForgotPasswordPage = ({ onBackToLogin }: ForgotPasswordProps) => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      if (!email) {
        setError('Please enter your email address');
        setIsLoading(false);
        return;
      }

      if (!email.includes('@')) {
        setError('Please enter a valid email address');
        setIsLoading(false);
        return;
      }

      setIsLoading(false);
      setIsSubmitted(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Navigation Header */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-green-800 rounded-lg flex items-center justify-center">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="font-bold text-lg text-gray-800">Developing Africa</div>
                <div className="text-xs text-green-600 font-semibold">JAPA INITIATIVE</div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {!isSubmitted ? (
              <>
                {/* Header */}
                <div className="mb-8">
                  <button
                    onClick={onBackToLogin}
                    className="flex items-center text-green-600 font-semibold mb-6 hover:text-green-700 transition"
                  >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back to Login
                  </button>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Reset Password</h2>
                  <p className="text-gray-600">
                    Enter your email address and we'll send you a link to reset your password.
                  </p>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Email Field */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      We'll send a password reset link to this email address.
                    </p>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-lg font-bold hover:shadow-lg transition disabled:opacity-75 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Sending...' : 'Send Reset Link'}
                  </button>
                </form>

                {/* Additional Info */}
                <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Tip:</strong> Check your email (including spam folder) for the password reset link. The link will expire in 24 hours.
                  </p>
                </div>
              </>
            ) : (
              <>
                {/* Success State */}
                <div className="text-center">
                  <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-10 h-10 text-green-600" />
                    </div>
                  </div>

                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Check Your Email</h2>
                  <p className="text-gray-600 mb-6">
                    We've sent a password reset link to <strong>{email}</strong>
                  </p>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8 text-left">
                    <h3 className="font-semibold text-gray-900 mb-3">Next Steps:</h3>
                    <ol className="space-y-2 text-sm text-gray-700">
                      <li className="flex space-x-3">
                        <span className="font-bold text-green-600 flex-shrink-0">1</span>
                        <span>Open your email and look for the message from Developing Africa</span>
                      </li>
                      <li className="flex space-x-3">
                        <span className="font-bold text-green-600 flex-shrink-0">2</span>
                        <span>Click the "Reset Password" link in the email</span>
                      </li>
                      <li className="flex space-x-3">
                        <span className="font-bold text-green-600 flex-shrink-0">3</span>
                        <span>Create a new password and confirm it</span>
                      </li>
                      <li className="flex space-x-3">
                        <span className="font-bold text-green-600 flex-shrink-0">4</span>
                        <span>Return to login with your new password</span>
                      </li>
                    </ol>
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={onBackToLogin}
                      className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-lg font-bold hover:shadow-lg transition"
                    >
                      Back to Login
                    </button>
                    <button
                      onClick={() => {
                        setEmail('');
                        setIsSubmitted(false);
                      }}
                      className="w-full text-green-600 font-semibold py-2 px-4 rounded-lg border-2 border-green-600 hover:bg-green-50 transition"
                    >
                      Try Another Email
                    </button>
                  </div>

                  <p className="text-xs text-gray-500 mt-6">
                    Didn't receive the email? Check your spam folder or contact support.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
