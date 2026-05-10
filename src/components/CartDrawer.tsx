import React from 'react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { orderService } from '../services/orderService';
import { X, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, removeItem, clearCart, total } = useCart();
  const { profile } = useAuth();
  const [isOrdering, setIsOrdering] = React.useState(false);

  const handleCheckout = async () => {
    if (!profile || items.length === 0) return;
    setIsOrdering(true);
    try {
      await orderService.createOrder({
        customerId: profile.uid,
        customerName: profile.displayName,
        items,
        totalPrice: total,
        status: 'pending'
      });
      clearCart();
      onClose();
      alert('點單成功！請至櫃檯結帳。');
    } catch (error) {
      console.error('Order error:', error);
      alert('點單失敗，請稍後再試。');
    } finally {
      setIsOrdering(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[70] bg-black/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="fixed bottom-0 right-0 top-0 z-[80] flex w-full max-w-md flex-col bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b p-6">
              <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900">
                <ShoppingBag className="h-5 w-5 text-orange-600" />
                我的點單 ({items.length})
              </h2>
              <button onClick={onClose} className="rounded-full bg-gray-100 p-2 text-gray-400 hover:bg-gray-200">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-gray-400">
                  <ShoppingBag className="mb-4 h-16 w-16 opacity-20" />
                  <p className="text-lg font-medium">購物車是空的</p>
                  <p className="text-sm">快去點茶吧！</p>
                </div>
              ) : (
                items.map((item, index) => (
                  <div key={index} className="flex gap-4 border-b pb-6 last:border-0">
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h4 className="font-bold text-gray-900">{item.name}</h4>
                        <span className="font-bold text-orange-600">${item.price * item.quantity}</span>
                      </div>
                      <div className="mt-1 flex flex-wrap gap-x-3 text-xs text-gray-500">
                        <span>{item.size} / {item.sugar} / {item.ice}</span>
                        {item.toppings.length > 0 && (
                          <span className="text-orange-500">加量: {item.toppings.join(', ')}</span>
                        )}
                      </div>
                      <div className="mt-2 flex items-center justify-between text-xs">
                        <span className="text-gray-400">數量: {item.quantity}</span>
                        <button 
                          onClick={() => removeItem(index)}
                          className="flex items-center gap-1 text-red-500 hover:text-red-600 font-medium"
                        >
                          <Trash2 className="h-3 w-3" />
                          移除
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t bg-gray-50 p-6 space-y-4">
                <div className="flex items-center justify-between text-gray-900">
                  <span className="text-sm font-medium">總結計</span>
                  <span className="text-2xl font-black">${total}</span>
                </div>
                <button
                  disabled={isOrdering}
                  onClick={handleCheckout}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-600 py-4 font-bold text-white shadow-lg transition-all hover:bg-orange-700 active:scale-[0.98] disabled:opacity-50"
                >
                  {isOrdering ? '處理中...' : '送出訂單'}
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
