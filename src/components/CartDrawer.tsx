import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, CheckCircle2 } from 'lucide-react';
import { ProductItem } from '../types';

interface CartItem {
  product: ProductItem;
  quantity: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}) => {
  const [isOrdered, setIsOrdered] = useState(false);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const handleSimulateCheckout = () => {
    setIsOrdered(true);
    setTimeout(() => {
      onClearCart();
      setIsOrdered(false);
      onClose();
    }, 2800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-stone-900/40 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#1f2937] border-l border-[#374151] shadow-2xl flex flex-col justify-between text-[#F9FAFB] animate-slide-left">
          {/* Header */}
          <div className="p-6 border-b border-[#374151] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#111827] border border-[#374151] flex items-center justify-center">
                <ShoppingBag className="w-4 h-4 text-cyan-400" />
              </div>
              <h2 className="text-base font-bold text-[#F9FAFB] font-serif">
                Consultation Bag ({cartItems.reduce((acc, i) => acc + i.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-[#283344] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto flex-1 space-y-3.5">
            {isOrdered ? (
              <div className="py-12 flex flex-col items-center justify-center text-center">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mb-3 animate-bounce" />
                <h3 className="text-base font-bold text-[#F9FAFB]">
                  Order #AURA-8492 Confirmed!
                </h3>
                <p className="text-xs text-slate-400 mt-1.5 max-w-xs">
                  Your matched formulations and VTO cosmetic shades are confirmed for express delivery.
                </p>
              </div>
            ) : cartItems.length === 0 ? (
              <div className="py-16 text-center">
                <ShoppingBag className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                <p className="text-sm font-semibold text-slate-300">Your bag is empty</p>
                <p className="text-xs text-slate-500 mt-1">
                  Add matched skincare serums or cosmetic shades from the right panel.
                </p>
              </div>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item.product.id}
                  className="flex items-center gap-3 p-3.5 rounded-xl border border-[#374151] bg-[#111827] shadow-sm"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-14 h-14 rounded-lg object-cover bg-[#1f2937] border border-[#374151] shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-semibold text-[#F9FAFB] truncate">
                      {item.product.name}
                    </h4>
                    <div className="text-[11px] text-cyan-300 font-mono-numbers mt-0.5 font-bold">
                      ${item.product.price.toFixed(2)}
                      {item.product.shadeName && (
                        <span className="font-normal text-slate-400"> · {item.product.shadeName}</span>
                      )}
                    </div>

                    {/* Quantity steppers */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, -1)}
                        className="w-7 h-7 bg-[#1f2937] border border-[#374151] rounded-lg flex items-center justify-center text-xs font-bold text-slate-300 hover:bg-[#283344] hover:text-white shadow-sm"
                      >
                        -
                      </button>
                      <span className="text-xs font-mono-numbers font-semibold text-[#F9FAFB] px-1">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, 1)}
                        className="w-7 h-7 bg-[#1f2937] border border-[#374151] rounded-lg flex items-center justify-center text-xs font-bold text-slate-300 hover:bg-[#283344] hover:text-white shadow-sm"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => onRemoveItem(item.product.id)}
                    className="p-2 text-slate-500 hover:text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout Summary */}
          {cartItems.length > 0 && !isOrdered && (
            <div className="p-6 border-t border-[#374151] bg-[#161f2e] space-y-3">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Subtotal</span>
                <span className="font-mono-numbers font-semibold text-[#F9FAFB]">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>Complimentary Express Courier</span>
                <span className="text-emerald-400 font-semibold">Free</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-[#F9FAFB] pt-2 border-t border-[#374151]">
                <span>Total</span>
                <span className="font-mono-numbers text-cyan-300">${subtotal.toFixed(2)}</span>
              </div>

              <button
                onClick={handleSimulateCheckout}
                className="w-full min-h-[44px] flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-white text-xs font-semibold rounded-xl shadow-md shadow-cyan-500/25 transition-all mt-2 active:scale-98"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
