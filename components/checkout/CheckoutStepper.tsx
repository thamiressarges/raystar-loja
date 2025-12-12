'use client';

import { ShoppingCart, Truck, CreditCard, CheckCircle2, Check } from 'lucide-react';

interface CheckoutStepperProps { currentStep: number; }

const steps = [
  { id: 1, name: 'Carrinho', icon: ShoppingCart },
  { id: 2, name: 'Entrega', icon: Truck }, 
  { id: 3, name: 'Pagamento', icon: CreditCard },
  { id: 4, name: 'Fim', icon: CheckCircle2 },
];

export default function CheckoutStepper({ currentStep }: CheckoutStepperProps) {
  return (
    <nav aria-label="Progress" className="w-full">
      <ol role="list" className="flex items-center justify-between w-full">
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.id;
          const isActive = currentStep === step.id;

          return (
            <li key={step.name} className="relative flex flex-col items-center flex-1">
              {index < steps.length - 1 && (
                <div className={`absolute left-1/2 top-3 h-[2px] w-full -translate-x-1/2 z-0 ${isCompleted ? 'bg-green-400' : 'bg-gray-200'}`} />
              )}

              <div className="relative z-10 flex flex-col items-center gap-1">
                <div className={`
                    flex h-7 w-7 items-center justify-center rounded-full transition-all
                    ${isCompleted ? 'bg-green-400 text-white' : ''}
                    ${isActive ? 'bg-gray-800 text-white border-2 border-white scale-110 shadow-lg' : ''}
                    ${!isCompleted && !isActive ? 'bg-gray-200 text-gray-500' : ''}
                  `}>
                  {isCompleted ? <Check size={14} /> : <step.icon size={14} />}
                </div>
                
                <span className={`text-[10px] font-bold uppercase mt-1 ${isActive ? 'text-white' : 'text-gray-400'}`}>
                  {step.name}
                </span>
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}