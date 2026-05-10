import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { MenuSection } from './pages/MenuSection';
import { AdminSection } from './pages/AdminSection';
import { Navbar } from './components/Navbar';
import { Loader2 } from 'lucide-react';
import { menuService } from './services/menuService';
import { CATEGORIES } from './types';

function AppContent() {
  const { profile, loading, login } = useAuth();
  const [view, setView] = useState<'customer' | 'admin'>('customer');

  // Initialize some menu items if empty (only for admin)
  useEffect(() => {
    if (profile?.role === 'admin') {
      const init = async () => {
        try {
          const items = await menuService.getAllItems();
          console.log("Current items count:", items.length);
          if (items.length === 0) {
            const initialItems = [
              { name: '招牌高山青', category: '找好茶', prices: { M: 30, L: 35, Bottle: 55 }, available: true, tags: ['推薦'] },
              { name: '茉香綠茶', category: '找好茶', prices: { M: 30, L: 35, Bottle: 55 }, available: true },
              { name: '日月潭紅茶', category: '找好茶', prices: { M: 30, L: 35, Bottle: 55 }, available: true },
              { name: '焙粉角金萱', category: '找好茶', prices: { L: 50 }, available: true, tags: ['推薦'] },
              { name: '芝士奶蓋青', category: '芝士奶蓋', prices: { L: 60 }, available: true },
              { name: '珍珠鮮奶茶', category: '找鮮奶', prices: { L: 65 }, available: true, tags: ['推薦'] },
              { name: '冬瓜檸檬', category: '無咖啡因', prices: { L: 55, Bottle: 75 }, available: true },
              { name: '翡翠檸檬', category: '找果茶', prices: { L: 45 }, available: true },
              { name: '百香QQ', category: '找果茶', prices: { L: 70 }, available: true, tags: ['推薦'] },
              { name: '葡萄柚果粒茶', category: '找果茶', prices: { L: 70 }, available: true },
              { name: '冬瓜青茶', category: '找特調', prices: { M: 50, L: 70 }, available: true },
              { name: '多多綠茶', category: '找特調', prices: { M: 55, L: 75 }, available: true },
            ];
            console.log("Initializing menu items...");
            for (const item of initialItems) {
              await menuService.addItem(item as any);
            }
            window.location.reload(); // Reload to refresh items in MenuSection if needed
          }
        } catch (error) {
          console.error("Initialization error:", error);
        }
      };
      init();
    }
  }, [profile]);

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-orange-50">
        <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-orange-50 p-4">
        <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl">
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold text-orange-600">TeaTime</h1>
            <p className="mt-2 text-gray-500">專業茶飲點單系統</p>
          </div>
          <button
            onClick={login}
            className="flex w-full items-center justify-center gap-3 rounded-xl bg-orange-600 px-6 py-3 font-medium text-white transition-all hover:bg-orange-700 active:scale-95"
          >
            使用 Google 登入
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Navbar currentView={view} onViewChange={setView} />
      <main className="mx-auto max-w-7xl p-4 lg:p-8">
        {view === 'customer' ? <MenuSection /> : <AdminSection />}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}
