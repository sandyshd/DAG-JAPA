'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface HeaderProps {
  onModuleSelect?: (moduleId: number) => void;
}

export default function Header({ onModuleSelect }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLoginClick = () => {
    router.push('/auth/login');
  };

  const handleApplyClick = () => {
    router.push('/auth/register');
  };

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-lg py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 cursor-pointer">
            <div className="w-14 h-14 relative flex-shrink-0 hover:opacity-90 transition">
              <Image
                src="/dag_logo.JPG"
                alt="Developing Africa JAPA Initiative"
                width={56}
                height={56}
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="font-bold text-xl text-gray-800">Developing Africa</div>
              <div className="text-xs text-green-600 font-semibold">JAPA INITIATIVE</div>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className="text-gray-700 hover:text-green-600 font-medium transition"
            >
              Home
            </Link>
            <button
              onClick={() => {
                onModuleSelect?.(1);
                document.getElementById('modules')?.scrollIntoView({
                  behavior: 'smooth',
                });
              }}
              className="text-gray-700 hover:text-green-600 font-medium transition cursor-pointer"
            >
              Modules
            </button>
            <a
              href="/#resources"
              className="text-gray-700 hover:text-green-600 font-medium transition"
            >
              Resources
            </a>
            <button
              onClick={handleLoginClick}
              className="text-gray-700 hover:text-green-600 font-medium transition cursor-pointer"
            >
              Login
            </button>
            <button
              onClick={handleApplyClick}
              className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-2 rounded-full font-semibold hover:shadow-lg transition flex items-center gap-2"
            >
              Apply Now
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-3 border-t pt-4 bg-white rounded-lg">
            <Link
              href="/"
              className="block text-gray-700 hover:text-green-600 font-medium"
            >
              Home
            </Link>
            <button
              onClick={() => {
                onModuleSelect?.(1);
                setMobileMenuOpen(false);
                document.getElementById('modules')?.scrollIntoView({
                  behavior: 'smooth',
                });
              }}
              className="block w-full text-left text-gray-700 hover:text-green-600 font-medium cursor-pointer"
            >
              Modules
            </button>
            <a
              href="/#resources"
              className="block text-gray-700 hover:text-green-600 font-medium"
            >
              Resources
            </a>
            <button
              onClick={() => {
                handleLoginClick();
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left text-gray-700 hover:text-green-600 font-medium cursor-pointer"
            >
              Login
            </button>
            <button
              onClick={() => {
                handleApplyClick();
                setMobileMenuOpen(false);
              }}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-2 rounded-full font-semibold hover:shadow-lg transition"
            >
              Apply Now
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
