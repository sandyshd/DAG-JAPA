import type { Metadata } from 'next';
import { AuthProvider } from '@/lib/providers';
import './globals.css';

export const metadata: Metadata = {
  title: 'DAG JAPA - Developing Africa Global Opportunity Platform',
  description: 'Connect with global opportunities and build your career with DAG JAPA',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
