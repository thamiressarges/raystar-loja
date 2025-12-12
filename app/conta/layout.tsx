import React from 'react';

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full py-12">
      <div className="container mx-auto max-w-7xl px-4">
        {children}
      </div>
    </div>
  );
}