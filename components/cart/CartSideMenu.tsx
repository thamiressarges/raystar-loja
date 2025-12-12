'use client';

import { useCart } from '@/lib/contexts/CartContext';
import { X, ShoppingCart, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils';

export default function CartSideMenu() {
  const {
    isOpen,
    setIsOpen,
    items,
    removeItem,
    updateItemQuantity,
    totalItems,
    totalPrice,
    openCheckoutModal,
  } = useCart();

  const handleOpenCheckout = () => {
    setIsOpen(false);
    openCheckoutModal();
  };

  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
      <div onClick={() => setIsOpen(false)} className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}></div>

      <div className={`absolute top-0 right-0 h-full w-full max-w-md bg-white shadow-xl transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between bg-black p-5 text-white">
            <div className="flex items-center gap-3">
              <ShoppingCart size={24} />
              <div>
                <h2 className="text-xl font-bold">Meu Carrinho</h2>
                <p className="text-sm text-gray-300">{totalItems} {totalItems === 1 ? 'item' : 'itens'}</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="rounded-full p-1 hover:bg-white/20">
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <p className="text-center text-gray-500">Seu carrinho está vazio.</p>
            ) : (
              items.map((item) => (
                <div key={item.id} className="flex gap-4 rounded-lg border border-gray-200 p-4 shadow-sm">
                  <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
                    {item.image ? (
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-gray-400">
                        <ShoppingCart size={24} />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900 line-clamp-1">{item.name}</h3>
                      <p className="text-sm text-gray-500">{item.size && `Tamanho: ${item.size}`}</p>
                      <p className="text-lg font-bold text-black mt-1">{formatPrice(item.price)}</p>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex h-9 w-24 items-center justify-between rounded-lg border border-gray-300 px-2">
                        <button onClick={() => updateItemQuantity(item.id, item.quantity - 1)} className="text-gray-500 hover:text-black cursor-pointer"><Minus size={16} /></button>
                        <span className="text-base font-medium">{item.quantity}</span>
                        <button onClick={() => updateItemQuantity(item.id, item.quantity + 1)} className="text-gray-500 hover:text-black cursor-pointer"><Plus size={16} /></button>
                      </div>

                      <button onClick={() => removeItem(item.id)} className="text-red-500 hover:text-red-700 cursor-pointer"><Trash2 size={20} /></button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="border-t border-gray-200 p-6 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-900">Total do Pedido</span>
              <span className="text-3xl font-bold text-gray-900">{formatPrice(totalPrice)}</span>
            </div>
            <p className="text-xs text-gray-500 text-center">Frete calculado no checkout.</p>

            <button onClick={handleOpenCheckout} disabled={items.length === 0} className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 p-4 text-base font-bold text-white shadow-lg hover:bg-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
              Finalizar Compra
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}