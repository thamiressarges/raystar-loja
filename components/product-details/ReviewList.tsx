'use client';

import { useState } from 'react';
import { Review } from "@/types"; 
import RatingStars from "@/components/products/RatingStars";
import { formatDate } from "@/lib/utils";
import { Pencil, Trash2, X, Check, Loader2 } from 'lucide-react';
import { deleteReview, updateReview } from '@/app/actions/review';
import { toast } from 'react-toastify'; 
import InteractiveRatingStars from './InteractiveRatingStars';

interface ReviewListProps {
  reviews: Review[];
  currentUserId?: string;
}

export default function ReviewList({ reviews, currentUserId }: ReviewListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const executeDelete = async (reviewId: string, productId: string) => {
    setIsDeleting(reviewId);
    
    const result = await deleteReview(reviewId, productId);
    
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
    setIsDeleting(null);
  };

  const confirmDelete = (reviewId: string, productId: string) => {
    toast.info(
      ({ closeToast }) => (
        <div className="flex flex-col gap-3">
            <span className="text-sm font-bold text-gray-800">Excluir avaliação?</span>
            <div className="flex gap-2 justify-end">
                <button 
                    onClick={closeToast}
                    className="px-3 py-1.5 text-xs font-medium rounded border border-gray-300 hover:bg-gray-100 transition"
                >
                    Cancelar
                </button>
                <button 
                    onClick={() => {
                        executeDelete(reviewId, productId);
                        closeToast();
                    }}
                    className="px-3 py-1.5 text-xs font-bold rounded bg-red-600 text-white hover:bg-red-700 transition"
                >
                    Sim, excluir
                </button>
            </div>
        </div>
      ),
      { 
        autoClose: false, 
        closeOnClick: false, 
        draggable: false,
        icon: false,
        className: "border-l-4 border-red-500",
        position: "top-right" 
      }
    );
  };

  return (
    <div className="w-full rounded-lg border border-gray-200 bg-white p-6 md:p-8">

      <h2 className="text-2xl font-semibold text-black pb-4 border-b border-gray-200">
        Avaliações de Clientes
      </h2>

      {reviews.length === 0 ? (
        <p className="mt-6 text-gray-600">Este produto ainda não tem avaliações.</p>
      ) : (
        <div className="mt-6 flex flex-col gap-6 divide-y divide-gray-100">
          {reviews.map((review) => {
             const isOwner = currentUserId && review.client_id === currentUserId;
             const isEditing = editingId === review.id;

             if (isEditing) {
                return (
                   <EditReviewForm 
                      key={review.id} 
                      review={review} 
                      onCancel={() => setEditingId(null)} 
                   />
                );
             }

             return (
                <div key={review.id} className="pt-6 first:pt-0 group">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-semibold text-black">
                        {review.user_name || "Cliente Anônimo"}
                        {isOwner && <span className="ml-2 text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Você</span>}
                      </h3>
                      <span className="text-sm text-gray-500">{formatDate(review.created_at)}</span>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <RatingStars rating={review.rating} />
                        {isOwner && (
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button 
                                    onClick={() => setEditingId(review.id)}
                                    className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                                    title="Editar"
                                >
                                    <Pencil size={16} />
                                </button>
                                <button 
                                    onClick={() => confirmDelete(review.id, review.product_id)}
                                    disabled={isDeleting === review.id}
                                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                                    title="Excluir"
                                >
                                    {isDeleting === review.id ? <Loader2 size={16} className="animate-spin"/> : <Trash2 size={16} />}
                                </button>
                            </div>
                        )}
                    </div>
                  </div>
                  
                  {review.title && <p className="mt-3 font-semibold text-gray-800">{review.title}</p>}
                  {review.text && <p className="mt-1 text-base text-gray-700">{review.text}</p>}
                </div>
             );
          })}
        </div>
      )}
    </div>
  );
}

function EditReviewForm({ review, onCancel }: { review: Review, onCancel: () => void }) {
    const [rating, setRating] = useState(review.rating);
    const [pending, setPending] = useState(false);

    async function handleSubmit(formData: FormData) {
        setPending(true);
        const res = await updateReview({ status: 'idle', message: ''}, formData);
        setPending(false);

        if (res.status === 'success') {
            toast.success(res.message);
            onCancel();
        } else {
            toast.error(res.message);
        }
    }

    return (
        <form action={handleSubmit} className="pt-6 first:pt-0 space-y-4 animate-in fade-in duration-300">
            <input type="hidden" name="reviewId" value={review.id} />
            <input type="hidden" name="productId" value={review.product_id} />
            <input type="hidden" name="rating" value={rating} />
            
            <div className="flex justify-between items-start">
                <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nota</label>
                   <InteractiveRatingStars rating={rating} setRating={setRating} />
                </div>
                <button type="button" onClick={onCancel} className="text-gray-400 hover:text-gray-600"><X size={20}/></button>
            </div>

            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Título</label>
                <input 
                    name="title" 
                    defaultValue={review.title || ''} 
                    className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-black focus:ring-1 focus:ring-black outline-none"
                />
            </div>

            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Comentário</label>
                <textarea 
                    name="text" 
                    defaultValue={review.text || ''} 
                    rows={3}
                    required
                    className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-black focus:ring-1 focus:ring-black outline-none"
                />
            </div>

            <div className="flex justify-end gap-2">
                <button 
                    type="button" 
                    onClick={onCancel}
                    className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded"
                    disabled={pending}
                >
                    Cancelar
                </button>
                <button 
                    type="submit"
                    className="px-4 py-2 text-sm bg-black text-white rounded hover:opacity-80 flex items-center gap-2"
                    disabled={pending}
                >
                    {pending ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                    Salvar Alterações
                </button>
            </div>
        </form>
    );
}