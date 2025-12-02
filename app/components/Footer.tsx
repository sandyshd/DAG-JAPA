'use client';

import { Mail, Phone, MapPin } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface FooterProps {
  onModuleSelect?: (moduleId: number) => void;
}

export default function Footer({ onModuleSelect }: FooterProps) {
  const router = useRouter();

  const handleModuleClick = (moduleId: number) => {
    onModuleSelect?.(moduleId);
    router.push('/');
  };

  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Company Info */}
          <div>
            <Link href="/" className="flex items-center space-x-3 mb-6 cursor-pointer">
              <div className="w-12 h-12 relative flex-shrink-0">
                <Image
                  src="/dag_logo.JPG"
                  alt="Developing Africa JAPA Initiative"
                  width={48}
                  height={48}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <div className="font-bold text-xl">Developing Africa</div>
                <div className="text-xs text-green-400 font-semibold">JAPA INITIATIVE</div>
              </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Building Africa's future through strategic global partnerships and youth empowerment.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-gray-400 hover:text-green-400 transition text-sm"
                >
                  Home
                </Link>
              </li>
              <li>
                <button
                  onClick={() => handleModuleClick(1)}
                  className="text-gray-400 hover:text-green-400 transition text-sm cursor-pointer font-medium"
                >
                  Modules
                </button>
              </li>
              <li>
                <a
                  href="/#resources"
                  className="text-gray-400 hover:text-green-400 transition text-sm"
                >
                  Resources
                </a>
              </li>
              <li>
                <a
                  href="/auth/login"
                  className="text-gray-400 hover:text-green-400 transition text-sm"
                >
                  Login
                </a>
              </li>
            </ul>
          </div>

          {/* Modules */}
          <div>
            <h4 className="font-bold text-lg mb-4">Modules</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => handleModuleClick(1)}
                  className="text-gray-400 hover:text-green-400 transition text-sm font-medium cursor-pointer"
                >
                  Business & Investment
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleModuleClick(5)}
                  className="text-gray-400 hover:text-green-400 transition text-sm font-medium cursor-pointer"
                >
                  Healthcare
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleModuleClick(2)}
                  className="text-gray-400 hover:text-green-400 transition text-sm font-medium cursor-pointer"
                >
                  Technology
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleModuleClick(7)}
                  className="text-gray-400 hover:text-green-400 transition text-sm font-medium cursor-pointer"
                >
                  Sports
                </button>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-lg mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3 text-gray-400">
                <Mail className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span className="text-sm">info@developing.africa</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-400">
                <Phone className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span className="text-sm">+234 XXX XXX XXXX</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-400">
                <MapPin className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span className="text-sm">Lagos, Nigeria</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4">
            <p className="text-gray-400 text-sm">
              © 2024 Developing Africa Group. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <button className="text-gray-400 hover:text-green-400 transition text-sm font-medium cursor-pointer">
                Privacy Policy
              </button>
              <button className="text-gray-400 hover:text-green-400 transition text-sm font-medium cursor-pointer">
                Terms of Service
              </button>
              <button className="text-gray-400 hover:text-green-400 transition text-sm font-medium cursor-pointer">
                Cookie Policy
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
