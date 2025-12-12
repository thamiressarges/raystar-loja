"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export default function Pagination({ currentPage, totalPages }: PaginationProps) {
  const router = useRouter();
  const params = useSearchParams();

  const goToPage = (page: number) => {
    const query = new URLSearchParams(params.toString());
    query.set("page", String(page));
    router.push("?" + query.toString());
  };

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex justify-center items-center gap-2 mt-10">

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => goToPage(page)}
          className={`
            w-8 h-8 flex items-center justify-center rounded-lg border text-sm transition
            ${
              page === currentPage
                ? "bg-black text-white border-black" 
                : "border-gray-300 hover:bg-black hover:text-white hover:border-black" 
            }
          `}
        >
          {page}
        </button>
      ))}

    </div>
  );
}