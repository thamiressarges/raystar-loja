'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useFormStatus } from 'react-dom';
import InteractiveRatingStars from './InteractiveRatingStars';
import { submitReview, FormState } from '@/app/actions/review'; 

interface WriteReviewFormProps {
  productId: string;
  storeId: string;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex h-12 w-full max-w-xs items-center justify-center rounded-lg bg-black px-6 py-3 text-base font-bold text-white hover:opacity-80 transition disabled:opacity-50"
    >
      {pending ? 'Enviando...' : 'Enviar Avaliação'}
    </button>
  );
}

export default function WriteReviewForm({ productId, storeId }: WriteReviewFormProps) {
  const [rating, setRating] = useState(5);
  const initialState: FormState = { status: 'idle', message: '' };
  const [state, setState] = useState<FormState>(initialState);

  async function handleSubmit(formData: FormData) {
     const result = await submitReview(state, formData);
     setState(result);
  }

  useEffect(() => {
    if (state.status === 'success') toast.success(state.message);
    if (state.status === 'error') toast.error(state.message);
  }, [state]);

  return (
    <div className="w-full rounded-lg border border-gray-200 bg-white p-6 md:p-8">
      <h2 className="text-2xl font-semibold text-black">Deixe sua avaliação</h2>
      
      <form action={handleSubmit} className="mt-6 flex flex-col gap-5">
        <input type="hidden" name="productId" value={productId} />
        <input type="hidden" name="rating" value={rating} />

        <div>
          <label className="block text-sm font-medium text-gray-700">Sua nota</label>
          <div className="mt-1">
            <InteractiveRatingStars rating={rating} setRating={setRating} />
          </div>
        </div>

        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Título (Opcional)</label>
          <input type="text" name="title" className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-black h-12 px-4 border" />
        </div>

        <div>
          <label htmlFor="text" className="block text-sm font-medium text-gray-700">Comentário</label>
          <textarea name="text" rows={4} required className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-black p-4 border" placeholder="O que achou do produto?" />
        </div>

        <SubmitButton />
      </form>
    </div>
  );
}