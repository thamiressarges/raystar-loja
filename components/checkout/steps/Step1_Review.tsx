'use client';

import { Package } from 'lucide-react';
import { CartItem } from '@/lib/contexts/CartContext';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils';

interface Step1Props {
  cartItems: CartItem[];
  subtotal: number;
  shippingCost: number;
}

export default function Step1Review({ cartItems, subtotal }: Step1Props) {
  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
       <h3 className="text-xl font-semibold text-gray-800">Revisão do Carrinho</h3>
       
       <div className="space-y-3">
         {cartItems.map(item => (
           <div key={item.id} className="flex gap-4 border p-3 rounded-lg bg-white shadow-sm">
             <div className="relative h-16 w-16 bg-gray-100 rounded flex items-center justify-center shrink-0 overflow-hidden">
                 {item.image ? (
                    <Image 
                      src={item.image} 
                      alt={item.name} 
                      fill 
                      className="object-cover" 
                      sizes="64px"
                    />
                 ) : (
                    <Package size={24} className="text-gray-400"/>
                 )}
             </div>
             <div className="flex-1">
               <p className="font-medium text-gray-900 line-clamp-2">{item.name}</p>
               <p className="text-sm text-gray-500">
                  {item.quantity}x {formatPrice(item.price)}
                  {item.size && <span className="ml-2 text-xs bg-gray-100 px-1 rounded border">{item.size}</span>}
               </p>
             </div>
             <div className="font-bold text-black self-center">
                 {formatPrice(item.price * item.quantity)}
             </div>
           </div>
         ))}
       </div>

       <div className="bg-gray-50 p-4 rounded-lg space-y-2 border border-gray-200 mt-2">
          <div className="flex justify-between text-gray-700">
             <span>Subtotal</span>
             <span>{formatPrice(subtotal)}</span>
          </div>
          
          <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-200 text-gray-900">
             <span>Total</span>
             <span>{formatPrice(subtotal)}</span>
          </div>
       </div>
    </div>
  );
}