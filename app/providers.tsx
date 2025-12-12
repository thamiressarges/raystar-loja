"use client";

import { useState } from "react";
import { UIContext } from "@/lib/contexts/UiContext";
import { CartProvider, useCart } from "@/lib/contexts/CartContext";
import LoginSideMenu from "@/components/auth/LoginSideMenu";
import CartSideMenu from "@/components/cart/CartSideMenu";
import CheckoutModal from "@/components/checkout/CheckoutModal";
import { AuthProvider } from "@/lib/contexts/AuthContext";
import { ToastContainer } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css";

interface ProvidersProps {
  children: React.ReactNode;
  isLoggedIn: boolean;
}

export default function Providers({ children, isLoggedIn }: ProvidersProps) {
  const [isAuthMenuOpen, setIsAuthMenuOpen] = useState(false);

  const openAuthMenu = () => {
    setIsAuthMenuOpen(true);
  };

  return (
    <CartProvider>
      <AuthProvider value={{ isLoggedIn }}>
        <UIContext.Provider
          value={{
            isAuthMenuOpen,
            setIsAuthMenuOpen,
            openAuthMenu, 
          }}
        >
          {/* Container Global no Topo Direito */}
          <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
          
          {children}

          {isAuthMenuOpen && <LoginSideMenu />}

          <CartSideMenuWrapper />

          <CheckoutModalWrapper />
        </UIContext.Provider>
      </AuthProvider>
    </CartProvider>
  );
}

function CartSideMenuWrapper() {
  const { isOpen } = useCart();
  return isOpen ? <CartSideMenu /> : null;
}

function CheckoutModalWrapper() {
  const { isCheckoutOpen } = useCart();
  return isCheckoutOpen ? <CheckoutModal /> : null;
}