'use client';

import { ReactNode } from "react";

export default function ProductGrid({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 place-items-stretch">
      {children}
    </div>
  );
}