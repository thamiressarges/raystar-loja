'use client';

import { MapPin, Check, CreditCard, QrCode, Ticket, Package, Store } from 'lucide-react';
import { CartItem } from '@/lib/contexts/CartContext';
import { formatPrice } from '@/lib/utils';

interface AddressData {
  street: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  isPickup?: boolean;
}

interface Step4Props {
  cartItems: CartItem[];
  subtotal: number;
  shippingCost: number;
  address: AddressData | null;
  paymentMethod: string;
}

export default function Step4Confirm({
  cartItems,
  subtotal,
  shippingCost,
  address,
  paymentMethod
}: Step4Props) {
  
  const total = subtotal + shippingCost;
  const isPickup = address?.isPickup || shippingCost === 0;

  const methodIcon = {
    card: <CreditCard size={18} />,
    pix: <QrCode size={18} />,
    boleto: <Ticket size={18} />,
  }[paymentMethod] || <CreditCard size={18} />;

  const methodName = {
    card: "Cartão de Crédito",
    pix: "PIX",
    boleto: "Boleto Bancário",
  }[paymentMethod] || "Não selecionado";

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center space-y-2">
        <div className="h-12 w-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
          <Check size={24} />
        </div>
        <h3 className="text-xl font-bold text-gray-900">Confirmar Pedido</h3>
        <p className="text-gray-500 text-sm">Revise os dados antes de finalizar.</p>
      </div>

      <div className="border rounded-lg p-4 bg-white">
        <h4 className="font-semibold mb-3 text-sm text-gray-700 flex items-center gap-2">
          <Package size={16} /> Itens do Pedido
        </h4>
        <div className="space-y-2 max-h-40 overflow-y-auto text-sm pr-2 custom-scrollbar">
          {cartItems.map((item) => (
            <div key={item.id} className="flex justify-between border-b border-gray-50 pb-2 last:border-0">
              <span className="text-gray-600 line-clamp-1 flex-1 pr-2">
                {item.quantity}x {item.name}
              </span>
              <span className="font-medium text-gray-900">
                {formatPrice(item.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border rounded-lg p-4 bg-white">
          <div className="flex items-center gap-2 text-gray-700 mb-2 font-semibold text-sm">
            {isPickup ? <Store size={16} /> : <MapPin size={16} />} 
            {isPickup ? 'Retirada na Loja' : 'Entrega no Endereço'}
          </div>
          
          {address ? (
            <div className="text-sm text-gray-600">
              <p className="font-medium text-black">{address.street}</p>
              <p>{address.neighborhood} - {address.city}/{address.state}</p>
              <p className="text-gray-400 text-xs mt-1">{address.zipCode}</p>
              {isPickup && <span className="text-green-600 text-xs font-bold mt-1 block">Frete Grátis</span>}
            </div>
          ) : (
             <p className="text-red-500 text-sm">Endereço não definido</p>
          )}
        </div>

        <div className="border rounded-lg p-4 bg-white">
          <div className="flex items-center gap-2 text-gray-700 mb-2 font-semibold text-sm">
            {methodIcon} Pagamento
          </div>
          <p className="text-sm text-gray-600">{methodName}</p>
        </div>
      </div>

      <div className="space-y-2">
         <div className="flex justify-between text-sm text-gray-500">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
         </div>
         <div className="flex justify-between text-sm text-gray-500">
            <span>Frete ({isPickup ? 'Retirada' : 'Correios/Moto'})</span>
            <span className={shippingCost === 0 ? "text-green-600 font-medium" : ""}>
               {shippingCost === 0 ? 'Grátis' : formatPrice(shippingCost)}
            </span>
         </div>
         <div className="bg-black text-white p-4 rounded-lg flex justify-between items-center text-lg font-bold shadow-lg mt-2">
            <span>Valor Total</span>
            <span>{formatPrice(total)}</span>
         </div>
      </div>
    </div>
  );
}