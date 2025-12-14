'use client';

import { useState, useEffect, useTransition } from 'react';
import { User, MapPin, Lock, Save, Edit, X, KeyRound, Trash2, Loader2 } from 'lucide-react';
import { UserDetails } from '@/types'; 
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import 'react-toastify/dist/ReactToastify.css';

interface MyDetailsProps {
  userDetails: UserDetails;
  onDetailsSaved: (newDetails: UserDetails) => void;
  updateUserDetailsAction: (formData: any) => Promise<any>;
  updatePasswordAction: (formData: FormData) => Promise<any>;
  deleteAccountAction: (formData: FormData) => Promise<any>; 
}

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSavePassword: (formData: FormData) => void;
  isPending: boolean;
}

interface DeleteAccountModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirmDelete: (formData: FormData) => void; 
    isPending: boolean;
}

function safeStr(value: any): string {
  if (value === null || value === undefined) return '';
  return String(value);
}

const ChangePasswordModal = ({ isOpen, onClose, onSavePassword, isPending }: ChangePasswordModalProps) => {
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    onSavePassword(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md animate-in zoom-in-95 duration-200">
        <div className="p-5 border-b flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Lock size={20} /> Alterar Senha
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer"><X size={24} /></button>
        </div>

        <form className="p-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="text-sm font-medium text-gray-700">Nova Senha</label>
            <input type="password" name="newPassword" placeholder="••••••••" required className="mt-1 w-full rounded-lg border border-gray-300 bg-white p-3 text-sm shadow-sm focus:border-black focus:ring-1 focus:ring-black outline-none transition" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Confirmar Nova Senha</label>
            <input type="password" name="confirmPassword" placeholder="••••••••" required className="mt-1 w-full rounded-lg border border-gray-300 bg-white p-3 text-sm shadow-sm focus:border-black focus:ring-1 focus:ring-black outline-none transition" />
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} disabled={isPending} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 cursor-pointer">Cancelar</button>
            <button type="submit" disabled={isPending} className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-50 cursor-pointer"><Save size={16} />{isPending ? "Salvando..." : "Salvar Senha"}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const DeleteAccountModal = ({ isOpen, onClose, onConfirmDelete, isPending }: DeleteAccountModalProps) => {
    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        onConfirmDelete(formData);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-sm animate-in zoom-in-95 duration-200">
                <div className="p-5 border-b flex justify-between items-center bg-red-600 rounded-t-lg">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2"><Trash2 size={20} /> Confirmação de Exclusão</h3>
                    <button onClick={onClose} className="text-white hover:text-red-100 cursor-pointer"><X size={24} /></button>
                </div>

                <form className="p-6 space-y-4" onSubmit={handleSubmit}>
                    <p className="text-gray-700">Você tem certeza que deseja <strong>deletar permanentemente sua conta</strong>? Todos os seus dados serão removidos.</p>
                    <p className="text-sm font-semibold text-red-600">Para confirmar, <strong>digite sua senha</strong> no campo abaixo.</p>
                    <div>
                        <label className="text-sm font-medium text-gray-700">Digite sua Senha</label>
                        <input type="password" name="passwordConfirm" placeholder="••••••••" required className="mt-1 w-full rounded-lg border border-gray-300 bg-white p-3 text-sm shadow-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition" />
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                        <button type="button" onClick={onClose} disabled={isPending} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 cursor-pointer">Cancelar</button>
                        <button type="submit" disabled={isPending} className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50 cursor-pointer"><Trash2 size={16} />{isPending ? "Excluindo..." : "Confirmar Exclusão"}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default function MyDetails({ userDetails, onDetailsSaved, updateUserDetailsAction, updatePasswordAction, deleteAccountAction }: MyDetailsProps) {
  
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, startTransition] = useTransition(); 
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false); 
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); 
  const [loadingCep, setLoadingCep] = useState(false);
  
  const getInitialFormData = (details: UserDetails) => {
    const addr = details.address || {} as any;
    return {
      name: safeStr(details.name),
      email: safeStr(details.email), 
      cpf: safeStr(details.cpf),
      phone: safeStr(details.phone),
      birth_date: safeStr(details.birth_date),
      address: {
        street: safeStr(addr.street),
        number: safeStr(addr.number),
        neighborhood: safeStr(addr.neighborhood),
        complement: safeStr(addr.complement),
        city: safeStr(addr.city),
        state: safeStr(addr.state),
        zip: safeStr(addr.zip),
      }
    };
  };

  const [formData, setFormData] = useState(getInitialFormData(userDetails));

  useEffect(() => {
    setFormData(getInitialFormData(userDetails));
  }, [userDetails]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({ 
      ...prev, 
      address: { 
        ...prev.address, 
        [name]: value 
      } 
    }));

    if (name === 'zip') {
        const cleanCep = value.replace(/\D/g, '');
        if (cleanCep.length === 8) {
            setLoadingCep(true);
            try {
                const response = await fetch(`https://brasilapi.com.br/api/cep/v2/${cleanCep}`);
                if (response.ok) {
                    const data = await response.json();
                    setFormData(prev => ({
                        ...prev,
                        address: {
                            ...prev.address,
                            street: data.street || prev.address.street,
                            neighborhood: data.neighborhood || prev.address.neighborhood,
                            city: data.city || prev.address.city,
                            state: data.state || prev.address.state,
                            zip: value
                        }
                    }));
                }
            } catch (error) {
                console.error("Erro ao buscar CEP", error);
            } finally {
                setLoadingCep(false);
            }
        }
    }
  };
  
  const handleSaveDetails = () => {
    const { address } = formData;
    
    const hasAnyAddressField = 
        address.street.trim() || 
        address.number.trim() || 
        address.neighborhood.trim() || 
        address.city.trim() || 
        address.state.trim() || 
        address.zip.trim();

    if (hasAnyAddressField) {
        const missingFields = [];
        if (!address.street.trim()) missingFields.push("Rua");
        if (!address.number.trim()) missingFields.push("Número");
        if (!address.neighborhood.trim()) missingFields.push("Bairro");
        if (!address.city.trim()) missingFields.push("Cidade");
        if (!address.state.trim()) missingFields.push("Estado");
        if (!address.zip.trim()) missingFields.push("CEP");

        if (missingFields.length > 0) {
            if (missingFields.length === 1 && missingFields[0] === "Número") {
                toast.warn("Preencha o campo número");
            } else {
                toast.warn(`Por favor, preencha: ${missingFields.join(", ")}`);
            }
            return; 
        }
    }

    startTransition(async () => {
      const payload = {
        name: safeStr(formData.name),
        cpf: safeStr(formData.cpf),
        phone: safeStr(formData.phone),
        birth_date: safeStr(formData.birth_date),
        address: hasAnyAddressField ? {
            street: safeStr(formData.address.street),
            number: safeStr(formData.address.number),
            neighborhood: safeStr(formData.address.neighborhood),
            complement: safeStr(formData.address.complement),
            city: safeStr(formData.address.city),
            state: safeStr(formData.address.state),
            zip: safeStr(formData.address.zip),
        } : undefined 
      };

      const result = await updateUserDetailsAction(payload);
      
      if (result.success) {
        toast.success(result.message);
        setIsEditing(false);
        onDetailsSaved({ ...userDetails, ...payload, address: payload.address || null }); 
      } else {
        toast.error(result.error);
      }
    });
  };

  const handleSavePassword = (formData: FormData) => {
    startTransition(async () => {
      const result = await updatePasswordAction(formData);
      if (result.success) {
        toast.success(result.message);
        setIsPasswordModalOpen(false); 
      } else {
        toast.error(result.error);
      }
    });
  };

  const handleDeleteAccount = (formData: FormData) => {
    startTransition(async () => {
      const result = await deleteAccountAction(formData);
      
      if (result.success) {
        toast.success(result.message);
        setIsDeleteModalOpen(false);
        router.push('/');
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  };

  return (
    <div className="w-full space-y-8">
      <ChangePasswordModal isOpen={isPasswordModalOpen} onClose={() => setIsPasswordModalOpen(false)} onSavePassword={handleSavePassword} isPending={isPending} />
      <DeleteAccountModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirmDelete={handleDeleteAccount} isPending={isPending} />
      
      <div className="w-full rounded-lg bg-white shadow-lg">
        <div className="rounded-t-lg bg-black p-5 text-white flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Meus Dados</h2>
            <p className="text-sm text-white">Mantenha suas informações atualizadas</p>
          </div>
          {!isEditing ? (
            <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/20 cursor-pointer"><Edit size={16} />Editar</button>
          ) : (
            <div className="flex gap-2">
              <button onClick={() => { setIsEditing(false); setFormData(getInitialFormData(userDetails)); }} className="flex items-center gap-2 rounded-lg bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 cursor-pointer"><X size={16} />Cancelar</button>
              <button onClick={handleSaveDetails} disabled={isPending} className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-black hover:bg-gray-200 disabled:opacity-50 cursor-pointer"><Save size={16} />{isPending ? "Salvando..." : "Salvar"}</button>
            </div>
          )}
        </div>

        <fieldset disabled={!isEditing || isPending} className="p-6 space-y-6">
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-800"><User size={20} />Informações Pessoais</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="text-sm font-medium text-gray-700">Nome Completo</label><input type="text" name="name" value={formData.name} onChange={handleChange} className="mt-1 w-full rounded-lg border border-gray-300 bg-white p-3 text-sm shadow-sm disabled:opacity-70 disabled:bg-gray-50" /></div>
              <div><label className="text-sm font-medium text-gray-700">Email</label><input type="email" name="email" value={formData.email} disabled className="mt-1 w-full rounded-lg border border-gray-300 bg-gray-200 p-3 text-sm shadow-sm opacity-70" /></div>
              <div><label className="text-sm font-medium text-gray-700">CPF</label><input type="text" name="cpf" value={formData.cpf} onChange={handleChange} className="mt-1 w-full rounded-lg border border-gray-300 bg-white p-3 text-sm shadow-sm disabled:opacity-70 disabled:bg-gray-50" /></div>
              <div><label className="text-sm font-medium text-gray-700">Telefone</label><input type="text" name="phone" value={formData.phone} onChange={handleChange} className="mt-1 w-full rounded-lg border border-gray-300 bg-white p-3 text-sm shadow-sm disabled:opacity-70 disabled:bg-gray-50" /></div>
              <div><label className="text-sm font-medium text-gray-700">Data de Nascimento</label><input type="date" name="birth_date" value={formData.birth_date} onChange={handleChange} className="mt-1 w-full rounded-lg border border-gray-300 bg-white p-3 text-sm shadow-sm disabled:opacity-70 disabled:bg-gray-50" /></div>
            </div>
          </div>

          <hr className="border-gray-200" />

          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-800"><MapPin size={20} />Endereço</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="text-sm font-medium text-gray-700">Endereço</label><input type="text" name="street" value={formData.address.street} onChange={handleAddressChange} className="mt-1 w-full rounded-lg border border-gray-300 bg-white p-3 text-sm shadow-sm disabled:opacity-70 disabled:bg-gray-50" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-sm font-medium text-gray-700">Número</label><input type="text" name="number" value={formData.address.number} onChange={handleAddressChange} className="mt-1 w-full rounded-lg border border-gray-300 bg-white p-3 text-sm shadow-sm disabled:opacity-70 disabled:bg-gray-50" /></div>
                <div><label className="text-sm font-medium text-gray-700">Bairro</label><input type="text" name="neighborhood" value={formData.address.neighborhood} onChange={handleAddressChange} className="mt-1 w-full rounded-lg border border-gray-300 bg-white p-3 text-sm shadow-sm disabled:opacity-70 disabled:bg-gray-50" /></div>
              </div>
              <div><label className="text-sm font-medium text-gray-700">Complemento</label><input type="text" name="complement" value={formData.address.complement} onChange={handleAddressChange} className="mt-1 w-full rounded-lg border border-gray-300 bg-white p-3 text-sm shadow-sm disabled:opacity-70 disabled:bg-gray-50" /></div>
              <div><label className="text-sm font-medium text-gray-700">Cidade</label><input type="text" name="city" value={formData.address.city} onChange={handleAddressChange} className="mt-1 w-full rounded-lg border border-gray-300 bg-white p-3 text-sm shadow-sm disabled:opacity-70 disabled:bg-gray-50" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-sm font-medium text-gray-700">Estado</label><input type="text" name="state" value={formData.address.state} onChange={handleAddressChange} className="mt-1 w-full rounded-lg border border-gray-300 bg-white p-3 text-sm shadow-sm disabled:opacity-70 disabled:bg-gray-50" /></div>
                <div>
                    <label className="text-sm font-medium text-gray-700 flex items-center justify-between">
                        CEP
                        {loadingCep && <Loader2 size={14} className="animate-spin text-black" />}
                    </label>
                    <input type="text" name="zip" value={formData.address.zip} onChange={handleAddressChange} className="mt-1 w-full rounded-lg border border-gray-300 bg-white p-3 text-sm shadow-sm disabled:opacity-70 disabled:bg-gray-50" />
                </div>
              </div>
            </div>
          </div>
        </fieldset>
      </div>

      <div className="w-full rounded-lg bg-white shadow-lg p-6 space-y-6"> 
        <h3 className="flex items-center gap-2 text-xl font-bold text-gray-800 border-b pb-4"><Lock size={24} />Ações de Segurança</h3>
        <div className="space-y-6"> 
            <div className="space-y-1">
                <h4 className="font-semibold text-gray-700 flex items-center gap-2"><KeyRound size={20} /> Alterar Senha</h4>
                <p className="text-sm text-gray-500">Use letras, números e símbolos fortes para manter sua conta segura.</p>
                <button onClick={() => setIsPasswordModalOpen(true)} className="mt-2 inline-flex items-center gap-2 rounded-lg bg-black px-5 py-2 text-sm font-medium text-white hover:bg-gray-800 transition" disabled={isPending}><Lock size={16} />Alterar Senha</button>
            </div>
            <hr className="border-gray-200" /> 
            <div className="space-y-1">
                <h4 className="font-semibold text-red-600 flex items-center gap-2"><Trash2 size={20} /> Deletar Conta</h4>
                <p className="text-sm text-gray-500">Essa ação é <strong>irreversível</strong>. Todos os seus dados serão permanentemente excluídos.</p>
                <button type="button" onClick={() => setIsDeleteModalOpen(true)} className="mt-2 inline-flex items-center gap-2 rounded-lg bg-red-600 px-5 py-2 text-sm font-medium text-white hover:bg-red-700" disabled={isPending}><Trash2 size={16} />Deletar Conta</button>
            </div>
        </div>
      </div>
    </div>
  );
}