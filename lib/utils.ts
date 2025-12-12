import { UserDetails } from "@/types";

export function checkProfilePending(user: UserDetails | null) {
  if (!user) return false;

  const isBasicInfoMissing = !user.cpf || !user.phone || !user.birth_date;
  const addr = (user.address || {}) as any;

  const isAddressMissing = 
    !addr.street || 
    !addr.number || 
    !addr.neighborhood || 
    !addr.city || 
    !addr.state || 
    !addr.zip;

  return isBasicInfoMissing || isAddressMissing;
}

export const formatPrice = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export const formatDate = (dateString: string) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};