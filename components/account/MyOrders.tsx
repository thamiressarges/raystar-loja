'use client';

import { Eye, CheckCircle, Clock, AlertTriangle, Truck } from 'lucide-react';
import { Order } from '@/types';
import { formatPrice, formatDate } from '@/lib/utils';
import Pagination from '@/components/Pagination';

interface MyOrdersProps {
  orders: Order[];
  onShowDetails: (order: Order) => void;
  currentPage: number;
  totalPages: number;
}

const StatusBadge = ({ status }: { status: string }) => {
  let colorClasses = '';
  let Icon = Clock;
  let text = status;

  const safeStatus = status ? status.toLowerCase() : 'pending';

  switch (safeStatus) {
    case 'entregue':
    case 'delivered':
      colorClasses = 'bg-green-100 text-green-700';
      Icon = CheckCircle;
      text = 'Entregue';
      break;
      
    case 'saiu_para_entrega':
    case 'out_for_delivery':
      colorClasses = 'bg-purple-100 text-purple-700';
      Icon = Truck;
      text = 'Saiu para Entrega';
      break;

    case 'em_andamento': 
    case 'shipped':
    case 'enviado':
    case 'preparing':
    case 'preparando_pedido':
      colorClasses = 'bg-yellow-100 text-yellow-700';
      Icon = Clock;
      text = 'Em Preparação';
      break;

    case 'paid':
    case 'pago':
    case 'pagamento_confirmado':
      colorClasses = 'bg-blue-100 text-blue-700';
      Icon = CheckCircle;
      text = 'Aprovado';
      break;

    case 'pedido_criado': 
    case 'aguardando_pagamento':
    case 'pending':
    default:
      colorClasses = 'bg-gray-100 text-gray-700';
      Icon = AlertTriangle;
      text = 'Aguardando';
      break;
      
    case 'canceled':
    case 'cancelado':
    case 'falhou':
      colorClasses = 'bg-red-100 text-red-700';
      Icon = AlertTriangle;
      text = 'Cancelado';
      break;
  }

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${colorClasses}`}>
      <Icon size={14} />
      {text}
    </span>
  );
};

export default function MyOrders({ orders, onShowDetails, currentPage, totalPages }: MyOrdersProps) {
  return (
    <div className="w-full rounded-lg bg-white shadow-lg flex flex-col">
      <div className="rounded-t-lg bg-black p-5 text-white">
        <h2 className="text-xl font-bold">Meus Pedidos</h2>
        <p className="text-sm text-white">Acompanhe o histórico de todos os seus pedidos</p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y-2 divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="whitespace-nowrap px-4 py-3 text-left font-semibold text-gray-900">Pedido</th>
              <th className="whitespace-nowrap px-4 py-3 text-left font-semibold text-gray-900">Data</th>
              <th className="whitespace-nowrap px-4 py-3 text-left font-semibold text-gray-900">Valor</th>
              <th className="whitespace-nowrap px-4 py-3 text-left font-semibold text-gray-900">Status</th>
              <th className="whitespace-nowrap px-4 py-3 text-left font-semibold text-gray-900">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-500">Você ainda não fez nenhum pedido.</td>
              </tr>
            ) : (
              orders.map((order) => {
                const totalDisplay = order.total_amount || 0;
                return (
                    <tr key={order.id}>
                    <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-900">{order.id.split('-')[0].toUpperCase()}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-gray-700">{formatDate(order.created_at)}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-gray-700">{formatPrice(totalDisplay)}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-gray-700"><StatusBadge status={order.status} /></td>
                    <td className="whitespace-nowrap px-4 py-3">
                        <button onClick={() => onShowDetails(order)} className="inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-900 cursor-pointer">
                        <Eye size={16} /> Ver Detalhes
                        </button>
                    </td>
                    </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="p-6 border-t border-gray-100 flex justify-center bg-gray-50 rounded-b-lg">
            <div className="-mt-6"> 
                <Pagination currentPage={currentPage} totalPages={totalPages} />
            </div>
        </div>
      )}
    </div>
  );
}