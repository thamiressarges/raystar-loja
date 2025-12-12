'use client';

import { useState, useEffect } from 'react';
import { X, MapPin, Clock, ShoppingCart, CreditCard, Check, Truck, Store, XCircle, QrCode, Barcode, Copy, FileText, RefreshCw, AlertTriangle } from 'lucide-react';
import Image from 'next/image';
import { Order } from '@/types'; 
import { createSupabaseBrowserClient } from '@/lib/client';
import { formatPrice, formatDate } from '@/lib/utils';
import { useCart } from '@/lib/contexts/CartContext'; 
import { toast } from 'react-toastify';

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
}

const translateStatus = (status: string) => {
  const safeStatus = status?.toLowerCase() || '';
  const map: Record<string, string> = {
    pending: 'Pendente',
    aguardando_pagamento: 'Aguardando Pagamento',
    aguardando_confirmacao: 'Aguardando Confirmação',
    paid: 'Pago', 
    pago: 'Pago', 
    succeeded: 'Pago',
    pagamento_confirmado: 'Pagamento Aprovado',
    preparing: 'Em Separação',
    preparando_pedido: 'Em Separação',
    shipped: 'Enviado', 
    enviado: 'Enviado',
    out_for_delivery: 'Saiu para Entrega',
    saiu_para_entrega: 'Saiu para Entrega',
    delivered: 'Entregue', 
    entregue: 'Entregue',
    canceled: 'Cancelado', 
    cancelado: 'Cancelado',
    falhou: 'Falhou', 
    failed: 'Falhou',
    pagamento_recusado: 'Recusado',
    devolvido: 'Devolvido'
  };
  return map[safeStatus] || status;
};

const getPaymentStyles = (status: string) => {
    const safeStatus = status?.toLowerCase() || '';
    if (['paid', 'pago', 'succeeded', 'pagamento_confirmado'].includes(safeStatus)) return { bg: 'bg-green-100 text-green-700', icon: <Check size={14} /> };
    if (['failed', 'falhou', 'canceled', 'cancelado', 'recusado'].includes(safeStatus)) return { bg: 'bg-red-100 text-red-700', icon: <XCircle size={14} /> };
    return { bg: 'bg-yellow-100 text-yellow-700', icon: <Clock size={14} /> };
};

const TimelineStep = ({ icon, title, time, isLast = false, isActive = false }: any) => (
  <div className="flex gap-4">
    <div className="flex flex-col items-center">
      <div className={`flex h-8 w-8 items-center justify-center rounded-full ${isActive ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>{icon}</div>
      {!isLast && <div className={`w-px flex-1 ${isActive ? 'bg-green-200' : 'bg-gray-200'}`}></div>}
    </div>
    <div>
      <h4 className={`font-medium ${isActive ? 'text-gray-900' : 'text-gray-500'}`}>{title}</h4>
      <p className="text-xs text-gray-400">{time}</p>
    </div>
  </div>
);

export default function OrderDetailsModal({ isOpen, onClose, order }: OrderDetailsModalProps) {
  const [storeAddress, setStoreAddress] = useState<string>("Carregando...");
  const supabase = createSupabaseBrowserClient();
  const { addItem, openCheckoutModal } = useCart(); 

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copiado para a área de transferência!");
  };

  useEffect(() => {
    if (isOpen) {
        const fetchStore = async () => {
            try {
                const { data } = await supabase.from('stores').select('address').limit(1).single();
                
                if (data?.address) {
                    const dbAddr = data.address as any;
                    const cleanCep = (dbAddr.zip || dbAddr.cep || "").replace(/\D/g, "");
                    const parts = [];
                    if (dbAddr.street) parts.push(dbAddr.street);
                    if (dbAddr.number) parts.push(dbAddr.number);
                    if (dbAddr.neighborhood) parts.push(dbAddr.neighborhood);
                    
                    const finalAddr = parts.length > 0 ? parts.join(", ") : `CEP: ${cleanCep}`;
                    setStoreAddress(finalAddr);
                } else { 
                    setStoreAddress("Endereço não disponível"); 
                }
            } catch (err) { 
                setStoreAddress("Loja Raystar"); 
            }
        };
        fetchStore();
    }
  }, [isOpen, supabase]);

  const handleReorder = () => {
    if (!order?.items) return;
    order.items.forEach(item => {
        addItem({
            id: item.variation_id || item.product_id || '',
            product_id: item.product_id || '',
            name: item.name,
            price: item.unit_price,
            quantity: item.quantity,
            image: item.image,
            variation_id: item.variation_id || undefined,
        });
    });
    toast.success("Itens adicionados ao carrinho!");
    onClose();
    setTimeout(() => { openCheckoutModal(); }, 300);
  };

  if (!isOpen || !order) return null;

  const deliveryInfo = order.delivery;
  const paymentInfo = order.payment;
  const items = order.items || [];
  const isPickup = deliveryInfo?.type === 'pickup';
  
  const calculatedTotal = items.reduce((acc: number, i: any) => acc + (Number(i.unit_price) * Number(i.quantity)), 0);
  const displayTotal = order.total_amount || calculatedTotal;
  const paymentStyle = paymentInfo ? getPaymentStyles(paymentInfo.status) : { bg: '', icon: null };

  const isPending = ['aguardando_pagamento', 'pending'].includes(paymentInfo?.status || '');
  const payload = paymentInfo?.payload || {};
  
  const PIX_EXPIRATION_MS = 24 * 60 * 60 * 1000; 
  const createdAtTime = new Date(order.created_at).getTime();
  const nowTime = new Date().getTime();
  const isPixExpired = (nowTime - createdAtTime) > PIX_EXPIRATION_MS;

  const pixCode = payload.pix_qr_code;
  const pixUrl = payload.pix_qr_code_url; 
  const qrImageSrc = pixUrl || (pixCode ? `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(pixCode)}` : null);
  const boletoUrl = payload.boleto_url;
  const boletoBar = payload.boleto_barcode;

  const isPixMethod = paymentInfo?.method === 'pix';
  const isBoletoMethod = paymentInfo?.method === 'boleto';

  return (
    <div onClick={onClose} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div onClick={(e) => e.stopPropagation()} className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-xl bg-white shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        <div className="flex items-center justify-between bg-black p-5 text-white shrink-0">
          <div><h2 className="text-lg font-bold">Detalhes do Pedido</h2><p className="text-xs text-gray-400 font-mono mt-1">ID: {order.id.split('-')[0].toUpperCase()}</p></div>
          <button onClick={onClose} className="rounded-full p-2 hover:bg-white/20 transition-colors"><X size={20} /></button>
        </div>

        <div className="overflow-y-auto p-6 space-y-6 bg-gray-50 flex-1">
          
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h3 className="flex items-center gap-2 text-lg font-bold text-gray-800 mb-5"><Clock size={20} /> Status do Pedido</h3>
            <div className="space-y-0">
              <TimelineStep icon={<Check size={14} />} title="Pedido Realizado" time={formatDate(order.created_at)} isActive={true} />
              <TimelineStep icon={<Truck size={14} />} title={`Status Atual: ${translateStatus(order.status)}`} time="Atualização mais recente" isActive={true} isLast={true} />
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h3 className="flex items-center gap-2 text-lg font-bold text-gray-800 mb-4"><ShoppingCart size={20} /> Itens</h3>
            {items.length > 0 ? (
                <div className="divide-y divide-gray-100">
                {items.map((item: any) => {
                    const productImage = item.image; 
                    return (
                        <div key={item.id} className="flex justify-between items-center py-3 text-sm">
                        <div className="flex items-center gap-3">
                            <div className="relative h-10 w-10 bg-gray-100 rounded-md overflow-hidden shrink-0">
                                {productImage ? <Image src={productImage} alt="" fill className="object-cover"/> : <div className="flex items-center justify-center h-full w-full text-gray-400"><ShoppingCart size={16}/></div>}
                            </div>
                            <div><p className="font-bold text-gray-900">{item.name}</p><p className="text-gray-500 text-xs">Qtd: {item.quantity}</p></div>
                        </div>
                        <p className="font-medium text-gray-900">{formatPrice(item.unit_price)}</p>
                        </div>
                    );
                })}
                </div>
            ) : <p className="text-gray-400 text-sm py-2 italic">Nenhum item encontrado.</p>}
            <div className="mt-4 pt-4 border-t border-gray-100 space-y-1">
               <div className="flex justify-between text-sm text-gray-600"><span>Subtotal</span><span>{formatPrice(calculatedTotal)}</span></div>
               <div className="flex justify-between text-sm text-gray-600">
                  <span>Frete</span>
                  <span className="text-green-600 font-medium">{deliveryInfo?.cost === 0 ? 'Grátis' : formatPrice(deliveryInfo?.cost || 0)}</span>
               </div>
               <div className="flex justify-between items-center text-lg font-bold text-black pt-2"><span>Total</span><span>{formatPrice(displayTotal)}</span></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <h3 className="flex items-center gap-2 text-lg font-bold text-gray-800 mb-4">
                {isPickup ? <Store size={20} /> : <MapPin size={20} />} 
                {isPickup ? 'Retirada' : 'Entrega'}
              </h3>
              
              {isPickup ? (
                <div className="text-sm bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <p className="font-bold text-gray-900">Loja Raystar</p>
                    <p className="text-gray-600">{storeAddress}</p>
                </div>
              ) : (
                 deliveryInfo ? (
                    <div className="flex flex-col gap-3 text-sm text-gray-600">
                        {deliveryInfo.address && (
                            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                <p className="font-bold text-gray-900 mb-1">Endereço de envio:</p>
                                <p>{deliveryInfo.address.street}, {deliveryInfo.address.number}</p>
                                <p>{deliveryInfo.address.neighborhood} - {deliveryInfo.address.city}/{deliveryInfo.address.state}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                    CEP: {(deliveryInfo.address as any).zipCode || deliveryInfo.address.zip}
                                </p>
                            </div>
                        )}
                        <div>
                            {deliveryInfo.tracking_code && (
                                <p className="font-bold text-gray-900 text-base">
                                    Rastreio: {deliveryInfo.tracking_code}
                                </p>
                            )}
                            {deliveryInfo.deadline_days && (
                                <p>Prazo: {deliveryInfo.deadline_days} dias úteis</p>
                            )}
                        </div>
                    </div>
                 ) : (
                    <p className="text-sm text-red-500 bg-red-50 p-2 rounded">Informações não encontradas.</p>
                 )
              )}
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <h3 className="flex items-center gap-2 text-lg font-bold text-gray-800 mb-4"><CreditCard size={20} /> Pagamento</h3>
              {paymentInfo ? (
                  <div className="space-y-4">
                    <div>
                        <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Status</p>
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-bold mt-1 ${paymentStyle.bg}`}>{paymentStyle.icon}{translateStatus(paymentInfo.status)}</span>
                    </div>

                    {isPending && isPixMethod && pixCode && (
                        <div className="pt-3 border-t border-gray-100">
                            {!isPixExpired ? (
                                <>
                                    <p className="text-xs font-bold text-blue-700 mb-2 flex items-center gap-1"><QrCode size={14}/> PIX Pendente</p>
                                    {qrImageSrc && (
                                        <div className="mb-3 flex justify-center bg-gray-50 p-2 rounded border border-gray-100 relative w-24 h-24 mx-auto">
                                            <Image src={qrImageSrc} alt="QR Code" fill className="object-contain" unoptimized />
                                        </div>
                                    )}
                                    <button onClick={() => copyToClipboard(pixCode)} className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white text-xs font-bold py-2 rounded hover:bg-blue-700 transition">
                                        <Copy size={12} /> Copiar Código PIX
                                    </button>
                                </>
                            ) : (
                                <div className="bg-red-50 border border-red-100 rounded-lg p-3 text-center">
                                    <AlertTriangle className="mx-auto text-red-500 mb-2" size={24} />
                                    <p className="text-xs font-bold text-red-700 mb-1">O código PIX expirou</p>
                                    <p className="text-xs text-gray-500 mb-3">Não é possível mais pagar este pedido.</p>
                                    <button 
                                        onClick={handleReorder}
                                        className="w-full flex items-center justify-center gap-2 bg-black text-white text-xs font-bold py-2 rounded hover:bg-gray-800 transition"
                                    >
                                        <RefreshCw size={12} /> Refazer Pedido
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {isPending && isBoletoMethod && boletoUrl && (
                        <div className="pt-3 border-t border-gray-100">
                            <p className="text-xs font-bold text-orange-700 mb-2 flex items-center gap-1"><Barcode size={14}/> Boleto Pendente</p>
                            <div className="flex flex-col gap-2">
                                <a href={boletoUrl} target="_blank" rel="noreferrer" className="w-full flex items-center justify-center gap-2 bg-orange-500 text-white text-xs font-bold py-2 rounded hover:bg-orange-600 transition">
                                    <FileText size={12} /> Baixar Boleto
                                </a>
                                {boletoBar && (
                                    <button onClick={() => copyToClipboard(boletoBar)} className="w-full flex items-center justify-center gap-2 bg-white border border-orange-200 text-orange-700 text-xs font-bold py-2 rounded hover:bg-orange-50 transition">
                                        <Copy size={12} /> Copiar Código de Barras
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                  </div>
              ) : <p className="text-sm text-gray-500 italic">Informações indisponíveis</p>}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}