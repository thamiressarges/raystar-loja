'use client';

import { CreditCard, QrCode, Ticket } from 'lucide-react';
import CardPaymentForm, { CardData } from './CardPaymentForm';

interface Step3PaymentProps {
  selected: string;
  setSelected: (id: string) => void;
  onCardValidate: (isValid: boolean, data?: CardData) => void;
  total: number;
}

const paymentOptions = [
  { id: 'card', label: 'Cartão de Crédito', icon: CreditCard },
  { id: 'pix', label: 'PIX', icon: QrCode },
  { id: 'boleto', label: 'Boleto', icon: Ticket },
];

export default function Step3Payment({ selected, setSelected, onCardValidate, total }: Step3PaymentProps) {
  
  if (!selected && typeof setSelected === 'function') {
    setTimeout(() => setSelected('card'), 0);
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-800">Pagamento</h3>
        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">Ambiente Seguro</span>
      </div>

      <div className="grid grid-cols-3 gap-2 p-1 bg-gray-100/80 rounded-lg">
        {paymentOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => setSelected(option.id)}
            className={`flex flex-col items-center justify-center gap-1 py-3 rounded-md 
              text-xs font-semibold transition-all cursor-pointer
              ${selected === option.id 
                  ? 'bg-white text-black shadow-sm ring-1 ring-black/5' 
                  : 'text-gray-500 hover:bg-gray-200/50'
              }
            `}
          >
            <option.icon size={18} />
            {option.label}
          </button>
        ))}
      </div>

      <div className="min-h-[220px]">
        {selected === 'card' && (
          <CardPaymentForm total={total} onValidChange={onCardValidate} />
        )}

        {selected === 'pix' && (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-blue-50/30 rounded-xl border border-blue-100 border-dashed">
            <QrCode size={40} className="text-black mb-3 opacity-80" />
            <p className="text-sm text-black font-medium">Pagamento via PIX</p>
            <p className="text-xs text-gray-500 mt-1">Aprovação imediata.</p>
          </div>
        )}

        {selected === 'boleto' && (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-gray-50 rounded-xl border border-gray-200 border-dashed">
            <Ticket size={40} className="text-gray-400 mb-3" />
            <p className="text-sm text-gray-700 font-medium">Boleto Bancário</p>
            <p className="text-xs text-gray-500 mt-1">Vencimento em 3 dias úteis.</p>
          </div>
        )}
      </div>
    </div>
  );
}