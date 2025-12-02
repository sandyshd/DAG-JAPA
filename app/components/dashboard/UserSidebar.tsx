'use client';

import React from 'react';
import Image from 'next/image';
import {
  User,
  FileText,
  Download,
  Settings,
} from 'lucide-react';

interface MenuItem {
  id: string;
  icon: React.ReactNode;
  label: string;
}

interface UserSidebarProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
  isOpen?: boolean;
}

const defaultMenuItems: MenuItem[] = [
  { id: 'overview', icon: <User />, label: 'Overview' },
  { id: 'documents', icon: <FileText />, label: 'Documents' },
  { id: 'resources', icon: <Download />, label: 'Resources' },
  { id: 'settings', icon: <Settings />, label: 'Settings' },
];

export default function UserSidebar({
  activeTab,
  onTabChange,
  isOpen = true,
}: UserSidebarProps) {
  return (
    <aside
      className={`bg-white border-r transition-all duration-300 flex flex-col ${
        isOpen ? 'w-64' : 'w-20'
      }`}
    >
      {/* Header with Logo and Branding */}
      <div className="p-6 border-b">
        {isOpen && (
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
              <Image
                src="/dag_logo.JPG"
                alt="Logo"
                width={40}
                height={40}
                className="w-full h-full object-contain rounded-full"
              />
            </div>
            <div>
              <div className="font-bold text-sm text-gray-900">Developing Africa</div>
              <div className="text-xs text-green-600 font-medium">User Portal</div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Menu */}
      <nav className="p-4 space-y-2 flex-1">
        {defaultMenuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition font-medium ${
              activeTab === item.id
                ? 'bg-green-50 text-green-600 border-l-4 border-green-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            {React.cloneElement(item.icon as React.ReactElement, {
              className: `w-5 h-5 ${
                activeTab === item.id ? 'text-green-600' : 'text-gray-400'
              }`,
            })}
            {isOpen && <span>{item.label}</span>}
          </button>
        ))}
      </nav>
    </aside>
  );
}
