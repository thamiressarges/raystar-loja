import { redirect } from "next/navigation";
import AccountView from "@/components/account/AccountView";
import { getUserDetails, getUserOrders } from "@/services/user";
import { createSupabaseServerClient } from "@/lib/server";
import { updateUserDetails, updateUserPassword, deleteAccountAction } from './actions';

interface AccountPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function AccountPage({ searchParams }: AccountPageProps) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/?login=true");
  }

  
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const limit = 10;

  
  const [ordersResult, userDetails] = await Promise.all([
    getUserOrders(page, limit),
    getUserDetails()
  ]);

  return (
    <div className="min-h-screen py-10 bg-gray-50">
       <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8 text-gray-800">Minha Conta</h1>
          
          <AccountView 
            initialOrders={ordersResult.data}
            totalPages={ordersResult.totalPages}
            currentPage={page}
            initialDetails={userDetails}
            updateUserDetailsAction={updateUserDetails}
            updatePasswordAction={updateUserPassword}
            deleteAccountAction={deleteAccountAction}
          />
       </div>
    </div>
  );
}