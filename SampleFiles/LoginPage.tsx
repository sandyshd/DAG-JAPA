import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Globe } from 'lucide-react';

interface LoginPageProps {
  onSwitchToForgotPassword?: () => void;
  onLoginSuccess?: () => void;
  onCreateAccount?: () => void;
}

const LoginPage = ({ onSwitchToForgotPassword, onLoginSuccess, onCreateAccount }: LoginPageProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      if (!email || !password) {
        setError('Please fill in all fields');
        setIsLoading(false);
        return;
      }

      if (!email.includes('@')) {
        setError('Please enter a valid email address');
        setIsLoading(false);
        return;
      }

      // Simulate successful login
      setIsLoading(false);
      if (onLoginSuccess) {
        onLoginSuccess();
      }
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
          {/* Left side - Welcome section (visible on larger screens) */}
          <div className="hidden lg:block mr-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">Welcome Back</h1>
            <p className="text-xl text-gray-600 mb-8">
              Sign in to access your Japa Initiative account and continue your journey to financial freedom.
            </p>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-bold flex-shrink-0 mt-1">
                  ✓
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Track Your Progress</p>
                  <p className="text-sm text-gray-600">Monitor applications and earnings</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-bold flex-shrink-0 mt-1">
                  ✓
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Secure Dashboard</p>
                  <p className="text-sm text-gray-600">Access your personal information safely</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-bold flex-shrink-0 mt-1">
                  ✓
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Real-time Updates</p>
                  <p className="text-sm text-gray-600">Get instant notifications on your status</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Login form */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Login</h2>
            <p className="text-gray-600 mb-8">Enter your credentials to access your account</p>

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
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-12 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 border-2 border-gray-300 rounded cursor-pointer accent-green-600"
                  />
                  <span className="text-sm text-gray-600">Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={onSwitchToForgotPassword}
                  className="text-sm text-green-600 font-semibold hover:text-green-700 transition"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-lg font-bold hover:shadow-lg transition disabled:opacity-75 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or</span>
              </div>
            </div>

            {/* Sign Up Link */}
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <p className="text-gray-600 mb-3">Don't have an account?</p>
              <button
                type="button"
                onClick={onCreateAccount}
                className="w-full text-green-600 font-bold py-2 px-4 rounded-lg border-2 border-green-600 hover:bg-green-50 transition"
              >
                Create Account
              </button>
            </div>

            {/* Trust Badges */}
            <div className="mt-8 space-y-2 text-center text-xs text-gray-500">
              <p>🔒 Your information is secure and encrypted</p>
              <p>✓ Industry-standard security protocols</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
