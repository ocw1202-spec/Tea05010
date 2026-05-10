import React from 'react';
import { MenuItem } from '../types';
import { Plus, Flame } from 'lucide-react';
import { motion } from 'motion/react';

interface MenuCardProps {
  item: MenuItem;
  onSelect: (item: MenuItem) => void;
}

export function MenuCard({ item, onSelect }: MenuCardProps) {
  const minPrice = Math.min(...Object.values(item.prices).filter((p): p is number => p !== undefined));

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="group relative overflow-hidden rounded-2xl bg-white p-4 shadow-sm transition-all hover:shadow-md"
    >
      <div className="flex justify-between">
        <div>
          <div className="flex items-center gap-1.5">
            <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
            {item.tags?.includes('推薦') && (
              <span className="flex items-center gap-0.5 rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-bold text-orange-600">
                <Flame className="h-3 w-3" />
                HOT
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-gray-500 line-clamp-2">{item.description || '精選優質茶葉，每日現場沖泡。'}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400">起</p>
          <p className="text-xl font-bold text-orange-600">${minPrice}</p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex gap-2">
          {item.prices.M && <span className="text-[10px] font-medium text-gray-400">M</span>}
          {item.prices.L && <span className="text-[10px] font-medium text-gray-400">L</span>}
          {item.prices.Bottle && <span className="text-[10px] font-medium text-gray-400">瓶</span>}
        </div>
        <button
          onClick={() => onSelect(item)}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-600 text-white shadow-sm transition-transform group-hover:scale-110 active:scale-95"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>
    </motion.div>
  );
}
