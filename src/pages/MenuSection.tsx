import React, { useState, useEffect } from 'react';
import { MenuItem, CATEGORIES } from '../types';
import { menuService } from '../services/menuService';
import { MenuCard } from '../components/MenuCard';
import { DrinkCustomizer } from '../components/DrinkCustomizer';
import { CartDrawer } from '../components/CartDrawer';
import { useCart } from '../contexts/CartContext';
import { Search, Loader2, ShoppingBasket } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function MenuSection() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
  const [activeItem, setActiveItem] = useState<MenuItem | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { addItem, items: cartItems } = useCart();

  useEffect(() => {
    const unsubscribe = menuService.subscribeToItems((data) => {
      setItems(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const filteredItems = items.filter(item => item.category === selectedCategory);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Category Tabs */}
      <div className="sticky top-16 z-40 -mx-4 bg-gray-50/80 px-4 py-4 backdrop-blur-md lg:top-20">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`whitespace-nowrap rounded-full px-6 py-2 text-sm font-bold transition-all ${
                selectedCategory === category 
                ? 'bg-orange-600 text-white shadow-md' 
                : 'bg-white text-gray-500 hover:bg-gray-100 hover:text-gray-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Hero Banner (optional but adds vibe) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-600 to-orange-400 p-8 text-white">
        <div className="relative z-10 max-w-lg">
          <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
            限時優惠
          </span>
          <h2 className="mt-4 text-4xl font-black">店長推薦：焙粉角金萱</h2>
          <p className="mt-2 text-orange-50 opacity-90">獨家烘焙香氣，搭配Ｑ彈手作粉角，口感豐富層次分明。</p>
          <button className="mt-6 rounded-xl bg-white px-6 py-3 font-bold text-orange-600 transition-transform active:scale-95">
            立即點餐
          </button>
        </div>
        <div className="absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-orange-300 opacity-20 blur-3xl" />
      </div>

      {/* Menu Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {filteredItems.map(item => (
              <MenuCard 
                key={item.id} 
                item={item} 
                onSelect={setActiveItem} 
              />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100">
          <Search className="h-12 w-12 text-gray-200 mb-4" />
          <p className="text-gray-400 font-medium">此分類目前沒有飲品</p>
          {items.length === 0 && (
            <p className="text-sm text-gray-400 mt-1">
              若您是管理員，系統正在為您初始化選單，請稍候...
            </p>
          )}
        </div>
      )}

      {/* Floating Cart Button */}
      <button
        onClick={() => setIsCartOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-full bg-gray-900 px-6 py-4 text-white shadow-2xl transition-transform hover:scale-105 active:scale-95"
      >
        <div className="relative">
          <ShoppingBasket className="h-6 w-6" />
          {cartItems.length > 0 && (
            <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-orange-600 text-[10px] font-bold">
              {cartItems.length}
            </span>
          )}
        </div>
        <span className="font-bold">點單車</span>
      </button>

      {/* Modals */}
      {activeItem && (
        <DrinkCustomizer
          item={activeItem}
          onClose={() => setActiveItem(null)}
          onConfirm={(orderItem) => {
            addItem(orderItem);
            setActiveItem(null);
          }}
        />
      )}

      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
      />
    </div>
  );
}
