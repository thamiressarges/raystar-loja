'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { Product, Variation, Review } from '@/types';
import { useCart, CartItem } from '@/lib/contexts/CartContext'; 
import { toast } from 'react-toastify';

interface ProductDetailsContextType {
  product: Product | null;
  variations: Variation[];
  
  reviews: Review[];
  reviewCount: number;
  avgRating: number;

  selectedVariation: Variation | null;
  selectedColor: string | null;
  selectedSize: string | null;

  setSelectedColor: (color: string) => void;
  setSelectedSize: (size: string) => void;
  setSelectedVariation: (variation: Variation | null) => void;

  quantity: number;
  setQuantity: (quantity: number) => void;
  incrementQuantity: () => void;
  decrementQuantity: () => void;
  addToCart: () => void;
  hasVariations: boolean;
}

const ProductDetailsContext = createContext<ProductDetailsContextType | undefined>(undefined);

interface ProviderProps {
  children: ReactNode;
  product: Product;
  variations: Variation[];
  reviews?: Review[];
  reviewCount?: number;
  avgRating?: number;
}

export function ProductDetailsProvider({ 
  children, 
  product: initialProduct,
  variations: initialVariations,
  reviews = [],
  reviewCount = 0,
  avgRating = 0
}: ProviderProps) {

  const { addItem } = useCart();

  const [product] = useState<Product>(initialProduct);
  const [variations] = useState<Variation[]>(initialVariations);

  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedVariation, setSelectedVariation] = useState<Variation | null>(null);
  const [quantity, setQuantity] = useState(1);

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  const hasVariations = variations && variations.reduce((acc, v) => acc + (v.stock || 0), 0) > 0;

  function resolveSelectedVariation(color: string | null, size: string | null) {
    if (!color || !size) return; 

    const found = variations.find(
      v => v.color === color && v.size === size
    );

    if (found) {
      setSelectedVariation(found);
    } else {
      setSelectedVariation(null);
    }
  }

  function handleSetColor(color: string) {
    setSelectedColor(color);
    resolveSelectedVariation(color, selectedSize);
  }

  function handleSetSize(size: string) {
    setSelectedSize(size);
    resolveSelectedVariation(selectedColor, size);
  }

  const handleSetSelectedVariation = (v: Variation | null) => {
    setSelectedVariation(v);
    if (v) {
      if (v.color) setSelectedColor(v.color);
      if (v.size) setSelectedSize(v.size);
    }
  };

  const addToCart = () => {
    if (!product) return;

    if (hasVariations && !selectedVariation) {
      toast.warn("Por favor, selecione as opções (Cor/Tamanho) antes de adicionar.");
      return;
    }

    const stock = (selectedVariation as any)?.stock ?? (selectedVariation as any)?.quantity ?? 0;
    if (hasVariations && stock < quantity) {
        toast.error(`Estoque insuficiente. Apenas ${stock} unidades disponíveis.`);
        return;
    }

    const productImage = product.photos && product.photos.length > 0 ? product.photos[0] : undefined;

    const cartItem: CartItem = {
      id: selectedVariation ? selectedVariation.id : product.id,
      product_id: product.id, 
      name: product.title,
      price: selectedVariation ? selectedVariation.price : product.price, 
      quantity: quantity,
      image: productImage,
      size: selectedSize || undefined,
      store_id: undefined 
    };

    addItem(cartItem); 
    toast.success("Adicionado ao carrinho!");
  };

  return (
    <ProductDetailsContext.Provider value={{
      product,
      variations,
      reviews,
      reviewCount,
      avgRating,
      selectedVariation,
      setSelectedVariation: handleSetSelectedVariation,
      selectedColor,
      selectedSize,
      setSelectedColor: handleSetColor,
      setSelectedSize: handleSetSize,
      quantity,
      setQuantity,
      incrementQuantity,
      decrementQuantity,
      addToCart,
      hasVariations
    }}>
      {children}
    </ProductDetailsContext.Provider>
  );
}

export const useProductDetails = () => {
  const context = useContext(ProductDetailsContext);
  if (!context) {
    throw new Error("useProductDetails must be used within a ProductDetailsProvider");
  }
  return context;
};