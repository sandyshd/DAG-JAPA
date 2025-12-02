'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error || 'Failed to sign in');
        setIsLoading(false);
        return;
      }

      if (result?.ok) {
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during login');
      setIsLoading(false);
    }
  };

  const [rememberMe, setRememberMe] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 relative flex-shrink-0">
              <Image
                src="/dag_logo.JPG"
                alt="Developing Africa JAPA Initiative"
                width={40}
                height={40}
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="font-bold text-lg text-gray-800">Developing Africa</div>
              <div className="text-xs text-green-600 font-semibold">JAPA INITIATIVE</div>
            </div>
          </div>
        </div>
      </nav>

      {/* Login Form */}
      <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="w-full max-w-4xl flex items-stretch shadow-xl rounded-2xl overflow-hidden">
          {/* Welcome / features (left column for larger screens) */}
          <div className="hidden lg:flex flex-col w-1/2 bg-gradient-to-br from-green-600 to-green-800 text-white p-12">
            <h1 className="text-4xl font-bold mb-4">Welcome Back</h1>
            <p className="text-lg text-white/90 mb-8">Sign in to access your Japa Initiative account and continue your journey to financial freedom.</p>

            <div className="space-y-4 mt-auto text-white/90">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center font-bold flex-shrink-0 mt-1">✓</div>
                <div>
                  <p className="font-semibold">Track Your Progress</p>
                  <p className="text-sm">Monitor applications and earnings</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center font-bold flex-shrink-0 mt-1">✓</div>
                <div>
                  <p className="font-semibold">Secure Dashboard</p>
                  <p className="text-sm">Access your personal information safely</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center font-bold flex-shrink-0 mt-1">✓</div>
                <div>
                  <p className="font-semibold">Real-time Updates</p>
                  <p className="text-sm">Get instant notifications on your status</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form (right column) */}
          <div className="w-full lg:w-1/2 bg-white p-8 lg:p-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Login</h2>
            <p className="text-gray-600 mb-6">Enter your credentials to access your account</p>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

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
                <Link href="/auth/forgot-password" className="text-sm text-green-600 font-semibold hover:text-green-700">
                  Forgot Password?
                </Link>
              </div>

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

            {/* Sign Up */}
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <p className="text-gray-600 mb-3">Don't have an account?</p>
              <Link href="/auth/register" className="w-full text-green-600 font-bold py-2 px-4 rounded-lg border-2 border-green-600 hover:bg-green-50 transition inline-block">
                Create Account
              </Link>
            </div>

            {/* Trust badges */}
            <div className="mt-8 space-y-2 text-center text-xs text-gray-500">
              <p>🔒 Your information is secure and encrypted</p>
              <p>✓ Industry-standard security protocols</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
