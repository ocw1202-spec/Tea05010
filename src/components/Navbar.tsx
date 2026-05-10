import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { Coffee, Settings, LogOut, ShoppingCart, User as UserIcon } from 'lucide-react';

interface NavbarProps {
  currentView: 'customer' | 'admin';
  onViewChange: (view: 'customer' | 'admin') => void;
}

export function Navbar({ currentView, onViewChange }: NavbarProps) {
  const { profile, logout } = useAuth();
  const { items } = useCart();

  return (
    <nav className="sticky top-0 z-50 border-b bg-white text-gray-800 shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-8">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-600 text-white">
            <Coffee className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900">TeaTime</h1>
            <p className="text-[10px] font-medium uppercase tracking-widest text-orange-600">Fresh Brewed</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-2 rounded-full bg-gray-100 p-1 md:flex">
            <button
              onClick={() => onViewChange('customer')}
              className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                currentView === 'customer' 
                ? 'bg-white text-orange-600 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <ShoppingCart className="h-4 w-4" />
              點餐
            </button>
            {profile?.role === 'admin' && (
              <button
                onClick={() => onViewChange('admin')}
                className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                  currentView === 'admin' 
                  ? 'bg-white text-orange-600 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Settings className="h-4 w-4" />
                管理
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 text-orange-600">
              <UserIcon className="h-4 w-4" />
            </div>
            <div className="hidden flex-col md:flex">
              <span className="text-xs font-semibold leading-none">{profile?.displayName}</span>
              <button onClick={logout} className="mt-1 text-[10px] text-gray-500 hover:text-red-500">登出</button>
            </div>
            <button onClick={logout} className="p-2 text-gray-400 hover:text-red-500 md:hidden">
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile view switcher */}
      <div className="flex border-t p-1 md:hidden">
         <button
          onClick={() => onViewChange('customer')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium ${
            currentView === 'customer' ? 'text-orange-600 border-b-2 border-orange-600' : 'text-gray-500'
          }`}
        >
          <ShoppingCart className="h-4 w-4" />
          點餐
        </button>
        {profile?.role === 'admin' && (
          <button
            onClick={() => onViewChange('admin')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium ${
              currentView === 'admin' ? 'text-orange-600 border-b-2 border-orange-600' : 'text-gray-500'
            }`}
          >
            <Settings className="h-4 w-4" />
            後台
          </button>
        )}
      </div>
    </nav>
  );
}
