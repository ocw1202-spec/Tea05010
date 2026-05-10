import React, { useState } from 'react';
import { MenuItem, Size, SUGAR_LEVELS, ICE_LEVELS, TOPPINGS, OrderItem } from '../types';
import { X, Minus, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DrinkCustomizerProps {
  item: MenuItem;
  onClose: () => void;
  onConfirm: (orderItem: OrderItem) => void;
}

export function DrinkCustomizer({ item, onClose, onConfirm }: DrinkCustomizerProps) {
  const availableSizes = Object.keys(item.prices) as Size[];
  const [size, setSize] = useState<Size>(availableSizes[0]);
  const [sugar, setSugar] = useState(SUGAR_LEVELS[1]); // Normal sugar
  const [ice, setIce] = useState(ICE_LEVELS[1]); // Normal ice
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);

  const toppingPrice = selectedToppings.reduce((total, name) => {
    const topping = TOPPINGS.find(t => t.name === name);
    return total + (topping?.price || 0);
  }, 0);

  const unitPrice = (item.prices[size] || 0) + toppingPrice;
  const totalPrice = unitPrice * quantity;

  const handleToppingToggle = (name: string) => {
    setSelectedToppings(prev => 
      prev.includes(name) ? prev.filter(t => t !== name) : [...prev, name]
    );
  };

  const handleConfirm = () => {
    onConfirm({
      menuItemId: item.id,
      name: item.name,
      size,
      sugar,
      ice,
      toppings: selectedToppings,
      quantity,
      price: unitPrice
    });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center p-0 sm:p-4">
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        className="relative flex h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:h-auto sm:rounded-3xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b p-4 lg:p-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{item.name}</h2>
            <p className="text-sm text-gray-500">{item.category}</p>
          </div>
          <button onClick={onClose} className="rounded-full bg-gray-100 p-2 text-gray-400 hover:bg-gray-200">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-8">
          {/* Size */}
          <section>
            <h3 className="mb-3 text-sm font-bold text-gray-900 uppercase tracking-wider">飲品容量</h3>
            <div className="flex flex-wrap gap-2">
              {availableSizes.map(s => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`flex-1 rounded-xl border-2 px-4 py-2 text-center transition-all ${
                    size === s ? 'border-orange-600 bg-orange-50 text-orange-600' : 'border-gray-100 bg-white text-gray-600 hover:border-orange-200'
                  }`}
                >
                  <div className="text-sm font-bold">{s}</div>
                  <div className="text-xs opacity-70">${item.prices[s]}</div>
                </button>
              ))}
            </div>
          </section>

          {/* Sugar */}
          <section>
            <h3 className="mb-3 text-sm font-bold text-gray-900 uppercase tracking-wider">甜度選擇</h3>
            <div className="grid grid-cols-4 gap-2">
              {SUGAR_LEVELS.map(level => (
                <button
                  key={level}
                  onClick={() => setSugar(level)}
                  className={`rounded-lg border px-2 py-1.5 text-center text-xs transition-all ${
                    sugar === level ? 'bg-gray-900 text-white border-gray-900' : 'bg-gray-50 text-gray-600 border-transparent hover:border-gray-300'
                  }`}
                >
                  {level.split(' ')[0]}
                </button>
              ))}
            </div>
          </section>

          {/* Ice */}
          <section>
            <h3 className="mb-3 text-sm font-bold text-gray-900 uppercase tracking-wider">冰量選擇</h3>
            <div className="grid grid-cols-4 gap-2">
              {ICE_LEVELS.map(level => (
                <button
                  key={level}
                  onClick={() => setIce(level)}
                  className={`rounded-lg border px-2 py-1.5 text-center text-xs transition-all ${
                    ice === level ? 'bg-gray-900 text-white border-gray-900' : 'bg-gray-50 text-gray-600 border-transparent hover:border-gray-300'
                  }`}
                >
                  {level.replace('(小碎冰)', '')}
                </button>
              ))}
            </div>
          </section>

          {/* Toppings */}
          <section>
            <h3 className="mb-3 text-sm font-bold text-gray-900 uppercase tracking-wider">配料加購</h3>
            <div className="grid grid-cols-3 gap-2">
              {TOPPINGS.map(topping => (
                <button
                  key={topping.name}
                  onClick={() => handleToppingToggle(topping.name)}
                  className={`rounded-xl border-2 px-3 py-2 text-center transition-all ${
                    selectedToppings.includes(topping.name) 
                    ? 'border-orange-600 bg-orange-50 text-orange-600' 
                    : 'border-gray-100 bg-white text-gray-600 hover:border-orange-200'
                  }`}
                >
                  <div className="text-xs font-bold">{topping.name}</div>
                  <div className="text-[10px] opacity-70">+${topping.price}</div>
                </button>
              ))}
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="border-t bg-gray-50 p-4 lg:p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-4 rounded-full bg-white px-4 py-1.5 shadow-sm border">
               <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="text-gray-400 hover:text-orange-600"
               >
                <Minus className="h-4 w-4" />
               </button>
               <span className="w-8 text-center font-bold">{quantity}</span>
               <button 
                onClick={() => setQuantity(quantity + 1)}
                className="text-orange-600"
               >
                <Plus className="h-4 w-4" />
               </button>
            </div>
            <div className="text-right">
              <span className="text-sm text-gray-500">總計</span>
              <div className="text-2xl font-black text-orange-600">${totalPrice}</div>
            </div>
          </div>
          <button
            onClick={handleConfirm}
            className="w-full rounded-2xl bg-orange-600 py-4 font-bold text-white shadow-lg transition-transform hover:bg-orange-700 active:scale-[0.98]"
          >
            加入購物車
          </button>
        </div>
      </motion.div>
    </div>
  );
}
