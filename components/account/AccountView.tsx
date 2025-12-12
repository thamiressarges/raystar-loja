'use client';

import { useState, useEffect } from 'react';
import AccountSidebar from './AccountSideBar';
import MyOrders from './MyOrders';
import MyDetails from './MyDetails';
import OrderDetailsModal from './OrderDetailsModal';
import { Order, UserDetails } from '@/types';
import { useAuth } from '@/lib/contexts/AuthContext';
import { checkProfilePending } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface AccountViewProps {
  initialOrders: Order[];
  totalPages: number; 
  currentPage: number; 
  initialDetails: UserDetails;
  updateUserDetailsAction: (formData: UserDetails) => Promise<any>;
  updatePasswordAction: (formData: FormData) => Promise<any>;
  deleteAccountAction?: (formData: FormData) => Promise<any>;
}

export default function AccountView({
  initialOrders,
  totalPages,
  currentPage,
  initialDetails,
  updateUserDetailsAction,
  updatePasswordAction,
}: AccountViewProps) {

  const { isLoggedIn } = useAuth();
  
  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'pedidos' | 'dados'>('pedidos');
  
  const [orders, setOrders] = useState<Order[]>(initialOrders || []);
  const [details, setDetails] = useState<UserDetails>(
    (initialDetails as UserDetails) || {
      name: '', email: '', cpf: '', phone: ''
    }
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  
  useEffect(() => {
    setOrders(initialOrders || []);
  }, [initialOrders]);

  const hasPendingData = checkProfilePending(details);

  const handleShowDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  if (!isMounted) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loader2 className="animate-spin text-gray-400" size={32} />
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="mt-10 text-center">
        <h2 className="text-2xl font-bold">Acesse sua conta</h2>
        <p className="mt-2 text-gray-600">Faça login para ver seus pedidos.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-8">
        <AccountSidebar 
           activeTab={activeTab} 
           setActiveTab={setActiveTab} 
           hasPendingData={hasPendingData} 
        />

        <div>
          {activeTab === 'pedidos' && (
            <MyOrders 
                orders={orders} 
                onShowDetails={handleShowDetails} 
                currentPage={currentPage} 
                totalPages={totalPages} 
            />
          )}

          {activeTab === 'dados' && (
            <MyDetails
              userDetails={details}
              onDetailsSaved={setDetails}
              updateUserDetailsAction={updateUserDetailsAction}
              updatePasswordAction={updatePasswordAction}
              deleteAccountAction={props => Promise.resolve()}
            />
          )}
        </div>
      </div>

      <OrderDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        order={selectedOrder}
      />
    </>
  );
}