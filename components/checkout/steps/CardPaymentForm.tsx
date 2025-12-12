'use client';

import { useState } from 'react';
import { Calendar, CreditCard, Lock, User, Layers, ChevronDown } from 'lucide-react';

export interface CardData {
  cardNumber: string;
  cardHolder: string;
  expiration: string;
  cvv: string;
  installments: number;
}

interface CardFormProps {
  onValidChange: (isValid: boolean, data?: CardData) => void;
  total: number;
}

export default function CardPaymentForm({ onValidChange, total }: CardFormProps) {
  const [card, setCard] = useState({ number: '', name: '', exp: '', cvv: '' });
  const [installments, setInstallments] = useState(1);

  const MIN_INSTALLMENT_VALUE = 5; 
  const MAX_INSTALLMENTS = 12;

  const updateAndValidate = (field: string, value: string) => {
    const updatedCard = { ...card, [field]: value };
    setCard(updatedCard);
    validate(updatedCard, installments);
  };

  const handleInstallmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = parseInt(e.target.value);
    setInstallments(val);
    validate(card, val);
  };

  const validate = (currentCard: typeof card, currentInstallments: number) => {
    const cleanNum = currentCard.number.replace(/\D/g, '');
    const expClean = currentCard.exp.replace(/\D/g, '');

    const isValid = 
      cleanNum.length >= 13 && 
      currentCard.name.trim().length >= 3 && 
      expClean.length >= 4 && 
      currentCard.cvv.length >= 3;

    onValidChange(isValid, {
      cardNumber: cleanNum,
      cardHolder: currentCard.name,
      expiration: currentCard.exp,
      cvv: currentCard.cvv,
      installments: currentInstallments
    });
  };

  const formatCardNumber = (value: string) => {
    return value.replace(/\D/g, '').replace(/(\d{4})/g, '$1 ').trim();
  };

  const installmentOptions = [];
  for (let i = 1; i <= MAX_INSTALLMENTS; i++) {
    const value = total / i;
    if (value >= MIN_INSTALLMENT_VALUE || i === 1) {
      installmentOptions.push({
        count: i,
        value: value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
      });
    }
  }

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-1 duration-300 mt-4">
      <div className="relative group">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors">
            <CreditCard size={18} />
        </div>
        <input
          type="text"
          placeholder="0000 0000 0000 0000"
          value={card.number}
          onChange={(e) => {
             const val = e.target.value.replace(/\D/g, '').slice(0, 16);
             updateAndValidate('number', formatCardNumber(val));
          }}
          maxLength={19}
          className="w-full pl-10 pr-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-black focus:ring-4 focus:ring-black/10 outline-none transition-all placeholder:text-gray-400 font-medium"
        />
      </div>

      <div className="relative group">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors">
            <User size={18} />
        </div>
        <input
          type="text"
          placeholder="Nome como no cartão"
          value={card.name}
          onChange={(e) => updateAndValidate('name', e.target.value.toUpperCase())}
          className="w-full pl-10 pr-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-black focus:ring-4 focus:ring-black/10 outline-none transition-all placeholder:text-gray-400 font-medium"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="relative group">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors">
            <Calendar size={18} />
          </div>
          <input
            type="text"
            placeholder="MM/AA"
            maxLength={5}
            value={card.exp}
            onChange={(e) => {
                let val = e.target.value.replace(/\D/g, '').slice(0, 4);
                if (val.length >= 3) val = val.replace(/^(\d{2})(\d)/, '$1/$2');
                updateAndValidate('exp', val);
            }}
            className="w-full pl-10 pr-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-black focus:ring-4 focus:ring-black/10 outline-none transition-all placeholder:text-gray-400 font-medium"
          />
        </div>

        <div className="relative group">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors">
            <Lock size={18} />
          </div>
          <input
            type="text"
            placeholder="CVV"
            maxLength={4}
            value={card.cvv}
            onChange={(e) => updateAndValidate('cvv', e.target.value.replace(/\D/g, ''))}
            className="w-full pl-10 pr-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-black focus:ring-4 focus:ring-black/10 outline-none transition-all placeholder:text-gray-400 font-medium"
          />
        </div>
      </div>

      <div className="relative group">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors pointer-events-none">
            <Layers size={18} />
        </div>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <ChevronDown size={16} />
        </div>

        <select 
            value={installments} 
            onChange={handleInstallmentChange}
            className="w-full pl-10 pr-10 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-black focus:ring-4 focus:ring-black/10 outline-none appearance-none cursor-pointer font-medium text-gray-700 transition-all"
        >
            {installmentOptions.map(opt => (
                <option key={opt.count} value={opt.count}>
                    {opt.count}x de {opt.value} {opt.count === 1 ? '(À vista)' : '(Sem Juros)'}
                </option>
            ))}
        </select>
      </div>
    </div>
  );
}