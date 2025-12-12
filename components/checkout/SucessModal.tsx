'use client';

import { PartyPopper, QrCode, Copy, FileText, Barcode } from 'lucide-react';

interface SuccessModalProps { 
    isOpen: boolean; 
    onClose: () => void; 
    orderId: string | null;
    pixData: { qr_code?: string; qr_code_url?: string } | null;
    boletoData: { url?: string; barcode?: string } | null;
}

export default function SuccessModal({ isOpen, onClose, orderId, pixData, boletoData }: SuccessModalProps) {
    if (!isOpen) return null;

    const copyToClipboard = (text: string, msg: string) => {
        navigator.clipboard.writeText(text);
        alert(msg);
    };

    const qrImageSrc = pixData?.qr_code_url || (pixData?.qr_code ? `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(pixData.qr_code)}` : null);

    return (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[60] p-4">
            <div className="bg-white p-5 rounded-xl shadow-2xl w-full max-w-[340px] text-center animate-in fade-in zoom-in-95 duration-300 relative">
                
                <PartyPopper size={36} className="text-green-500 mx-auto mb-2" />
                <h3 className="text-lg font-bold text-gray-900 leading-tight">Pedido Recebido!</h3>
                {orderId && <div className="text-xs text-gray-500 mb-4 mt-1">Pedido #<span className="font-bold text-gray-800 select-all">{orderId.split('-')[0].toUpperCase()}</span></div>}

                {pixData && (
                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 mb-4">
                        <div className="flex items-center justify-center gap-1 text-blue-800 font-bold mb-2 text-xs"><QrCode size={14} /> <span>Pagamento PIX</span></div>
                        {qrImageSrc ? <img src={qrImageSrc} alt="QR Code PIX" className="w-32 h-32 mx-auto mb-3 border-4 border-white rounded shadow-sm object-contain bg-white" /> : <div className="w-32 h-32 bg-gray-200 mx-auto mb-3 flex items-center justify-center text-[10px] text-gray-500 p-2 text-center rounded">Carregando...</div>}
                        <button onClick={() => copyToClipboard(pixData.qr_code || "", "Copiado!")} className="w-full bg-white border border-blue-300 text-blue-700 py-2 rounded text-xs font-bold hover:bg-blue-50 transition flex items-center justify-center gap-1"><Copy size={12} /> Copiar Código</button>
                    </div>
                )}

                {boletoData && (
                    <div className="bg-orange-50 border border-orange-100 rounded-lg p-3 mb-4 text-left">
                        <div className="flex items-center justify-center gap-1 text-orange-800 font-bold mb-3 text-xs"><Barcode size={14} /> <span>Boleto Bancário</span></div>
                        <div className="flex gap-2 flex-col">
                            <a href={boletoData.url} target="_blank" rel="noopener noreferrer" className="w-full bg-orange-500 text-white py-2 rounded text-xs font-bold hover:bg-orange-600 transition flex items-center justify-center gap-1 shadow-sm"><FileText size={14} /> Baixar Boleto</a>
                            <button onClick={() => copyToClipboard(boletoData.barcode || "", "Copiado!")} className="w-full bg-white border border-orange-200 text-orange-700 py-2 rounded text-xs font-bold hover:bg-orange-50 transition flex items-center justify-center gap-1"><Copy size={12} /> Copiar Barras</button>
                        </div>
                    </div>
                )}

                {!pixData && !boletoData && <p className="text-xs text-gray-600 mb-6 px-2">Pagamento aprovado!<br/> Enviamos a confirmação para seu e-mail.</p>}
                
                <button onClick={onClose} className="w-full bg-black text-white px-3 py-2.5 rounded-lg text-sm font-bold hover:bg-gray-800 transition">Voltar para Loja</button>
            </div>
        </div>
    );
}