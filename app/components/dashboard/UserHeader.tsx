'use client';

import React from 'react';
import Image from 'next/image';
import { LogOut } from 'lucide-react';

interface UserHeaderProps {
  userName: string;
  userEmail: string;
  onLogout: () => void;
  onProfileClick: () => void;
  subtitle?: string;
}

export default function UserHeader({
  userName,
  userEmail,
  onLogout,
  onProfileClick,
  subtitle = 'Manage your account and view your application status',
}: UserHeaderProps) {
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <header className="bg-white border-b sticky top-0 z-40 shadow-sm">
      <div className="px-6 py-4 flex items-center justify-between">
        {/* Left: Logo and Branding */}
        <div className="flex items-center space-x-3 min-w-max">
          <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
            <Image
              src="/dag_logo.JPG"
              alt="Developing Africa"
              width={40}
              height={40}
              className="w-full h-full object-contain rounded-full"
            />
          </div>
          <div className="hidden sm:block">
            <div className="font-bold text-sm text-gray-900">Developing Africa</div>
            <div className="text-xs text-green-600 font-medium">User Portal</div>
          </div>
        </div>

        {/* Center: Title and Subtitle */}
        <div className="flex-1 text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {userName.split(' ')[0]}
          </h1>
          <p className="text-sm text-gray-500">{subtitle}</p>
        </div>

        {/* Right: User Profile and Logout */}
        <div className="flex items-center space-x-4 min-w-max">
          {/* User Profile Button */}
          <button
            onClick={onProfileClick}
            className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center text-white font-bold text-sm">
              {userInitial}
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-sm font-semibold text-gray-900">
                {userName.split(' ')[0]}
              </p>
              <p className="text-xs text-gray-600">{userEmail}</p>
            </div>
          </button>

          {/* Logout Button */}
          <button
            onClick={onLogout}
            className="flex items-center space-x-1 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition font-semibold text-sm whitespace-nowrap"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
