'use client';

import Link from "next/link";

export default function SectionHeader({
  title,
  href,
}: { title: string; href?: string }) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h2 className="text-2xl md:text-3xl font-semibold text-black">{title}</h2>
      {href && (
        <Link
          href={href}
          className="text-sm underline underline-offset-4 hover:opacity-80"
        >
          Ver todos →
        </Link>
      )}
    </div>
  );
}
