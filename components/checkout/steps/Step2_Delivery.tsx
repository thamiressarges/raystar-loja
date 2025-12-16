'use client';

import { useState, useEffect } from 'react';
import { MapPin, Loader2, AlertTriangle, Store, Truck, CheckCircle2 } from 'lucide-react';
import { createSupabaseBrowserClient } from '@/lib/client';
import { calculateShipping } from '@/app/actions/shipping'; 

export interface AddressData {
  street: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  isPickup?: boolean;
  number?: string;
}

interface Step2Props {
  onAddressSelect: (address: AddressData, cost: number) => void;
  currentAddress: AddressData | null;
  shippingCost: number;
}

export default function Step2Delivery({ onAddressSelect, currentAddress, shippingCost }: Step2Props) {
  const [method, setMethod] = useState<'delivery' | 'pickup'>('delivery');
  const [cep, setCep] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [storeAddress, setStoreAddress] = useState<AddressData | null>(null);
  const [loadingStore, setLoadingStore] = useState(true);

  const supabase = createSupabaseBrowserClient();

  useEffect(() => {
    async function fetchStoreAddress() {
      try {
        const { data, error } = await supabase
          .from('stores')
          .select('address')
          .limit(1)
          .single();

        if (error) throw error;

        if (data?.address) {
          const dbAddr = data.address as any;
          const rawCep = dbAddr.zip || dbAddr.cep || dbAddr.zipCode || "";
          const cleanCep = rawCep.replace(/\D/g, "");

          
          let street = dbAddr.street || dbAddr.rua || "";
          let neighborhood = dbAddr.neighborhood || dbAddr.bairro || "";
          let city = dbAddr.city || dbAddr.cidade || "";
          let state = dbAddr.state || dbAddr.uf || dbAddr.estado || "";
          const number = dbAddr.number || dbAddr.numero || "S/N";

          
          if (cleanCep && cleanCep.length === 8 && (!street || !city || !state || !neighborhood)) {
             try {
                 const res = await fetch(`https://brasilapi.com.br/api/cep/v2/${cleanCep}`);
                 if (res.ok) {
                     const apiData = await res.json();
                     
                     if (!street) street = apiData.street;
                     if (!neighborhood) neighborhood = apiData.neighborhood;
                     if (!city) city = apiData.city;
                     if (!state) state = apiData.state;
                 }
             } catch(e) { 
                 console.error("Erro ao buscar endereço da loja na API:", e); 
             }
          }

          let finalAddress: AddressData = {
             street,
             neighborhood,
             city,
             state,
             zipCode: cleanCep,
             number,
             isPickup: true
          };
          
          setStoreAddress(finalAddress);
        }
      } catch (err) {
        console.error('Erro ao buscar loja:', err);
      } finally {
        setLoadingStore(false);
      }
    }

    fetchStoreAddress();
  }, [supabase]);

  useEffect(() => {
  if (!method) { 
    if (currentAddress?.isPickup) {
      setMethod('pickup');
    } else if (currentAddress?.zipCode) {
      setMethod('delivery');
      setCep(currentAddress.zipCode.replace(/(\d{5})(\d{3})/, "$1-$2"));
    }
  }
}, [currentAddress, method]);

  const handleCepFormat = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '').slice(0, 8);
    if (val.length > 5) val = val.replace(/^(\d{5})(\d)/, '$1-$2');
    setCep(val);
  };

  const selectPickup = () => {
    setMethod('pickup');
    if (storeAddress) {
      onAddressSelect(storeAddress, 0);
    }
  };

  const selectDelivery = () => {
    setMethod('delivery');
    if (cep.length >= 8) {
        handleCalculate();
    } else {
        onAddressSelect(null as any, 0);
    }
  };

  const handleCalculate = async () => {
    const cleanCep = cep.replace(/\D/g, '');
    if (cleanCep.length !== 8) {
      setError("CEP inválido.");
      return;
    }

    setLoading(true);
    setError('');

    const result = await calculateShipping(cleanCep);

    if (!result.success || !result.data) {
        setError(result.error || "Erro ao calcular.");
        onAddressSelect(null as any, 0);
        setLoading(false);
        return;
    }

    onAddressSelect(result.data.address, result.data.price);
    setLoading(false);
  };

  const format = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const displayCep = (c: string) => c.replace(/(\d{5})(\d{3})/, "$1-$2");

  return (
    <div className="flex flex-col gap-6">
      <h3 className="text-xl font-semibold text-gray-800">Método de Entrega</h3>
      <div className="grid grid-cols-2 gap-3">
        <button 
            onClick={selectDelivery} 
            className={`flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all cursor-pointer ${method === 'delivery' ? 'border-black bg-gray-50 text-black' : 'border-gray-100 text-gray-400 hover:border-gray-200'}`}
        >
          <Truck size={20} />
          <div className="text-left"><span className="block font-bold text-sm">Entrega</span><span className="text-xs">Delivery</span></div>
        </button>
        
        <button 
            onClick={selectPickup} 
            disabled={loadingStore || !storeAddress}
            className={`flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all cursor-pointer
              ${method === 'pickup' ? 'border-black bg-gray-50 text-black' : 'border-gray-100 text-gray-400 hover:border-gray-200'}
              ${loadingStore ? 'opacity-50 cursor-wait' : ''}
            `}
        >
          {loadingStore ? <Loader2 className="animate-spin" size={20}/> : <Store size={20} />}
          <div className="text-left"><span className="block font-bold text-sm">Retirada</span><span className="text-xs">Grátis</span></div>
        </button>
      </div>

      {method === 'delivery' && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-300 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Informe seu CEP</label>
            <div className="flex gap-2">
              <input value={cep} onChange={handleCepFormat} placeholder="00000-000" className="flex-1 rounded-lg border border-gray-300 p-3 outline-none focus:border-black" />
              <button onClick={handleCalculate} disabled={loading} className="rounded-lg bg-black px-6 text-white hover:bg-gray-800 disabled:opacity-50 cursor-pointer">
                {loading ? <Loader2 className="animate-spin" /> : 'Calcular'}
              </button>
            </div>
            {error && <p className="text-sm text-red-500 flex items-center gap-1"><AlertTriangle size={14} /> {error}</p>}
          </div>

          {currentAddress && !currentAddress.isPickup && !error && (
            <div className="space-y-3">
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 flex gap-3 items-center">
                    <div className="h-10 w-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 shrink-0">
                        <MapPin size={20} />
                    </div>
                    <div>
                        <p className="font-bold text-gray-900 text-sm">{currentAddress.street}</p>
                        <p className="text-xs text-gray-500">{currentAddress.neighborhood} - {currentAddress.city}</p>
                    </div>
                </div>
                <div className="rounded-lg bg-green-50 border border-green-200 p-4 flex justify-between items-center">
                    <div className="flex items-center gap-2 text-green-800">
                        <CheckCircle2 size={20} />
                        <span className="font-semibold text-sm">Frete Calculado</span>
                    </div>
                    <span className="text-xl font-bold text-green-700">
                        {shippingCost === 0 ? 'Grátis' : format(shippingCost)}
                    </span>
                </div>
            </div>
          )}
        </div>
      )}

      {method === 'pickup' && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-300">
           <div className="rounded-lg border border-gray-200 bg-gray-50 p-5 text-center">
              <Store size={32} className="mx-auto text-black mb-2"/>
              
              {loadingStore ? (
                 <div className="flex justify-center items-center gap-2 text-sm text-gray-500 py-2">
                    <Loader2 className="animate-spin" size={16} /> Buscando endereço...
                 </div>
              ) : storeAddress ? (
                 <>
                    <h4 className="font-bold text-gray-900 text-lg">Loja Raystar</h4>
                    <p className="text-sm text-gray-800 font-medium mb-1">
                       {storeAddress.street}, {storeAddress.number}
                    </p>
                    <p className="text-sm text-gray-600 mb-2">
                       {storeAddress.neighborhood} - {storeAddress.city}/{storeAddress.state}
                    </p>
                    <p className="text-xs text-gray-400 font-mono mb-3 bg-gray-100 inline-block px-2 py-1 rounded">
                        CEP: {displayCep(storeAddress.zipCode)}
                    </p>
                 </>
              ) : (
                 <p className="text-sm text-red-500">Endereço da loja não configurado.</p>
              )}

              <div className="block mt-2">
                  <div className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold border border-green-200">
                     Frete Grátis
                  </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}