'use client';

import { useState, useTransition } from 'react';
import { useCart } from '@/lib/contexts/CartContext';
import { X, Check, Loader2 } from 'lucide-react';
import { createSupabaseBrowserClient } from '@/lib/client';
import { processCheckout } from '@/app/actions/checkout';
import { toast } from 'react-toastify';

import CheckoutStepper from './CheckoutStepper';
import Step1Review from './steps/Step1_Review';
import Step2Delivery, { AddressData } from './steps/Step2_Delivery';
import Step3Payment from './steps/Step3_Payment';
import Step4Confirm from './steps/Step4_Confirm';
import SuccessModal from './SucessModal';
import { CardData } from './steps/CardPaymentForm';

export default function CheckoutModal() {
    const { isCheckoutOpen, closeCheckoutModal, items, totalPrice, clearCart } = useCart();
    const [step, setStep] = useState(1);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [lastOrderId, setLastOrderId] = useState<string | null>(null);
    const [pixData, setPixData] = useState<{ qr_code?: string; qr_code_url?: string } | null>(null);
    const [boletoData, setBoletoData] = useState<{ url?: string; barcode?: string } | null>(null);

    const [shippingCost, setShippingCost] = useState(0);
    const [address, setAddress] = useState<AddressData | null>(null);
    const [paymentMethod, setPaymentMethod] = useState('');
    const [cardValid, setCardValid] = useState(false);
    const [cardData, setCardData] = useState<CardData | null>(null);
    
    const [isPending, startTransition] = useTransition();
    const supabase = createSupabaseBrowserClient();

    const handleClose = () => {
        closeCheckoutModal();
        setTimeout(() => {
            setStep(1); setShippingCost(0); setAddress(null); setPaymentMethod('');
            setCardValid(false); setCardData(null); setLastOrderId(null); setPixData(null); setBoletoData(null);
        }, 300);
    };

    const total = totalPrice + shippingCost;

    const handleFinish = async () => {
        startTransition(async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) { 
                    toast.error("Você precisa fazer login para finalizar."); 
                    return; 
                }

                const { data: userRow } = await supabase.from("users").select("cpf").eq("uid", user.id).single();
                if (!userRow?.cpf) { 
                    toast.warn("Por favor, preencha seu CPF na conta antes de continuar."); 
                    return; 
                }

                const payload = {
                    userId: user.id,
                    items,
                    shipping: { 
                        cost: shippingCost, 
                        address, 
                        method: address?.isPickup ? "pickup" : "delivery", 
                        isPickup: address?.isPickup === true, 
                        company: { name: "Raystar" } 
                    },
                    paymentMethod, 
                    customer: { 
                        name: user.user_metadata?.name || "Cliente", 
                        email: user.email, 
                        cpf: userRow.cpf 
                    },
                    card: paymentMethod === "card" ? { 
                        cardNumber: cardData?.cardNumber, 
                        holderName: cardData?.cardHolder, 
                        expiration: cardData?.expiration, 
                        cvv: cardData?.cvv,
                        installments: cardData?.installments || 1 
                    } : null
                };

                const result = await processCheckout({ success: false }, payload);

                if (result.success) {
                    setLastOrderId(result.orderId || null);
                    if (result.pix) setPixData(result.pix as any);
                    if (result.boleto) setBoletoData(result.boleto as any);
                    clearCart();
                    setIsSuccessModalOpen(true);
                    toast.success("Pedido realizado com sucesso!");
                } else {
                    toast.error(result.message || "Erro ao processar pedido. Verifique os dados.");
                }
            } catch (error: any) {
                console.error(error);
                toast.error("Ocorreu um erro inesperado. Tente novamente.");
            }
        });
    };

    const handleNext = () => {
        if (step === 2 && !address) return toast.warn("Por favor, defina o endereço de entrega.");
        if (step === 3 && !paymentMethod) return toast.warn("Selecione uma forma de pagamento.");
        if (step === 3 && paymentMethod === "card" && !cardValid) return toast.error("Dados do cartão inválidos ou incompletos.");
        setStep(s => s + 1);
    };

    if (!isCheckoutOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />
            <div className="relative flex flex-col w-full max-w-2xl max-h-[90vh] bg-white rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="bg-black px-6 py-4 text-white shrink-0">
                    <div className="flex justify-between items-center mb-4"><h3 className="text-lg font-bold">Checkout</h3><button className='cursor-pointer' onClick={handleClose}><X size={20}/></button></div>
                    <CheckoutStepper currentStep={step} />
                </div>
                <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                    {step === 1 && <Step1Review cartItems={items} subtotal={totalPrice} shippingCost={0} />}
                    {step === 2 && <Step2Delivery currentAddress={address} shippingCost={shippingCost} onAddressSelect={(a, c) => { setAddress(a); setShippingCost(c); }} />}
                    {step === 3 && <Step3Payment selected={paymentMethod} setSelected={setPaymentMethod} onCardValidate={(v, d) => { setCardValid(v); setCardData(d); }} total={total} />}
                    {step === 4 && <Step4Confirm cartItems={items} subtotal={totalPrice} shippingCost={shippingCost} address={address} paymentMethod={paymentMethod} />}
                </div>
                <div className="px-6 py-4 border-t bg-white flex justify-between items-center shrink-0">
                    <div className="flex flex-col"><span className="text-xs text-gray-500">TOTAL</span><span className="text-xl font-bold">{(total).toLocaleString('pt-BR', {style:'currency', currency:'BRL'})}</span></div>
                    <div className="flex gap-3">
                        {step > 1 && <button onClick={() => setStep(s => s - 1)} disabled={isPending} className="px-4 py-2 text-gray-600 border rounded-lg cursor-pointer">Voltar</button>}
                        {step < 4 ? <button onClick={handleNext} className="px-6 py-2 bg-black text-white font-bold rounded-lg cursor-pointer">Continuar</button> : <button onClick={handleFinish} disabled={isPending} className="px-6 py-2 bg-green-600 text-white font-bold rounded-lg flex items-center gap-2">{isPending ? <Loader2 className="animate-spin" size={16}/> : <Check size={16}/>} Finalizar</button>}
                    </div>
                </div>
            </div>
            <SuccessModal isOpen={isSuccessModalOpen} onClose={() => { setIsSuccessModalOpen(false); handleClose(); }} orderId={lastOrderId} pixData={pixData} boletoData={boletoData} />
        </div>
    );
}