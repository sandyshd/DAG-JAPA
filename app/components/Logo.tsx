'use client';

import Link from 'next/link';
import Image from 'next/image';

interface LogoProps {
  variant?: 'full' | 'compact';
  href?: string;
  clickable?: boolean;
}

export default function Logo({ 
  variant = 'full', 
  href = '/',
  clickable = true 
}: LogoProps) {
  const content = (
    <div className="flex items-center space-x-3">
      <div className="w-12 h-12 relative flex-shrink-0 hover:opacity-90 transition">
        <Image
          src="/dag_logo.JPG"
          alt="Developing Africa JAPA Initiative"
          width={48}
          height={48}
          className="w-full h-full object-contain"
          priority
        />
      </div>
      {variant === 'full' && (
        <div>
          <div className="font-bold text-lg text-gray-800">Developing Africa</div>
          <div className="text-xs text-green-600 font-semibold">JAPA INITIATIVE</div>
        </div>
      )}
    </div>
  );

  if (clickable) {
    return (
      <Link href={href} className="flex items-center space-x-3 cursor-pointer">
        {content}
      </Link>
    );
  }

  return content;
}
