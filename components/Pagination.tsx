'use client';

export default function Pagination() {
  return (
    <div className="flex justify-center items-center gap-2 mt-10">

      <button
        className="
          w-8 h-8 
          flex items-center justify-center
          rounded-lg border border-black
          bg-black text-white text-sm
        "
      >
        1
      </button>

      <button
        className="
          w-8 h-8 
          flex items-center justify-center
          rounded-lg border border-black
          hover:bg-black hover:text-white
          text-sm transition
        "
      >
        2
      </button>

      <button
        className="
          w-8 h-8 
          flex items-center justify-center
          rounded-lg border border-black
          hover:bg-black hover:text-white
          text-sm transition
        "
      >
        3
      </button>

      <button
        className="
          w-8 h-8 
          flex items-center justify-center
          rounded-lg border border-black
          hover:bg-black hover:text-white
          text-sm transition
        "
      >
        4
      </button>

    </div>
  );
}
