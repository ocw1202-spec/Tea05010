import React, { useState, useEffect } from 'react';
import { Order, OrderStatus } from '../types';
import { orderService } from '../services/orderService';
import { CheckCircle2, Clock, Package, ChevronRight, Check, X, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function AdminSection() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<OrderStatus | 'all'>('all');

  useEffect(() => {
    const unsubscribe = orderService.subscribeToAllOrders((newOrders) => {
      setOrders(newOrders);
    });
    return () => unsubscribe();
  }, []);

  const filteredOrders = orders.filter(o => filter === 'all' || o.status === filter);

  const stats = {
    pending: orders.filter(o => o.status === 'pending').length,
    preparing: orders.filter(o => o.status === 'preparing').length,
    ready: orders.filter(o => o.status === 'ready').length,
  };

  const handleStatusUpdate = async (id: string, status: OrderStatus) => {
    try {
      await orderService.updateStatus(id, status);
    } catch (e) {
      console.error(e);
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'preparing': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'ready': return 'bg-green-100 text-green-700 border-green-200';
      case 'completed': return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
    }
  };

  const getStatusText = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return '待處理';
      case 'preparing': return '製作中';
      case 'ready': return '待領取';
      case 'completed': return '已完成';
      case 'cancelled': return '已取消';
    }
  };

  return (
    <div className="space-y-8 pb-32">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-black text-gray-900">訂單管理</h2>
          <p className="text-gray-500">實時監控與狀態更新</p>
        </div>
        
        {/* Quick Stats */}
        <div className="flex gap-4 overflow-x-auto pb-2 md:pb-0">
          <StatCard icon={<Clock className="h-5 w-5" />} label="新訂單" count={stats.pending} color="text-yellow-600" bgColor="bg-yellow-50" />
          <StatCard icon={<Package className="h-5 w-5" />} label="製作中" count={stats.preparing} color="text-blue-600" bgColor="bg-blue-50" />
          <StatCard icon={<CheckCircle2 className="h-5 w-5" />} label="待領取" count={stats.ready} color="text-green-600" bgColor="bg-green-50" />
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {['all', 'pending', 'preparing', 'ready', 'completed', 'cancelled'].map(s => (
          <button
            key={s}
            onClick={() => setFilter(s as any)}
            className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-bold transition-all ${
              filter === s 
              ? 'bg-gray-900 text-white' 
              : 'bg-white text-gray-500 border border-gray-200 hover:border-gray-400'
            }`}
          >
            {s === 'all' ? '全部訂單' : getStatusText(s as any)}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filteredOrders.length === 0 ? (
            <div className="col-span-full flex min-h-[300px] flex-col items-center justify-center rounded-3xl border-2 border-dashed bg-white text-gray-400">
               <AlertCircle className="mb-4 h-12 w-12 opacity-20" />
               <p className="font-bold">目前沒有對應狀態的訂單</p>
            </div>
          ) : (
            filteredOrders.map(order => (
              <motion.div
                key={order.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm border border-gray-100"
              >
                <div className="flex items-center justify-between border-b bg-gray-50/50 p-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">#{order.id.slice(-4)}</span>
                    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">
                    {order.createdAt?.toDate ? new Date(order.createdAt.toDate()).toLocaleTimeString() : '...'}
                  </span>
                </div>

                <div className="flex-1 p-4">
                  <div className="mb-4">
                    <h4 className="font-bold text-gray-900">{order.customerName}</h4>
                    <p className="text-xs text-gray-500 underline decoration-orange-200">內用/外帶自取</p>
                  </div>

                  <div className="space-y-3">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="flex h-5 w-5 items-center justify-center rounded bg-gray-100 text-[10px] font-bold text-gray-600">
                              {item.quantity}
                            </span>
                            <span className="text-sm font-bold text-gray-800">{item.name}</span>
                          </div>
                          <div className="ml-7 text-[10px] text-gray-500">
                            {item.size} / {item.sugar} / {item.ice}
                            {item.toppings.length > 0 && (
                              <span className="block text-orange-600 mt-0.5">+ {item.toppings.join(', ')}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-400">總金額</span>
                    <span className="text-lg font-black text-gray-900">${order.totalPrice}</span>
                  </div>

                  <div className="flex gap-2">
                    {order.status === 'pending' && (
                      <button 
                        onClick={() => handleStatusUpdate(order.id, 'preparing')}
                        className="flex-1 rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white transition-all hover:bg-blue-700 shadow-sm"
                      >
                        開始製作
                      </button>
                    )}
                    {order.status === 'preparing' && (
                      <button 
                        onClick={() => handleStatusUpdate(order.id, 'ready')}
                        className="flex-1 rounded-xl bg-green-600 py-2.5 text-xs font-bold text-white transition-all hover:bg-green-700 shadow-sm"
                      >
                        設為待領取
                      </button>
                    )}
                    {order.status === 'ready' && (
                      <button 
                        onClick={() => handleStatusUpdate(order.id, 'completed')}
                        className="flex-1 rounded-xl bg-gray-900 py-2.5 text-xs font-bold text-white transition-all hover:bg-gray-800 shadow-sm"
                      >
                        完成訂單
                      </button>
                    )}
                    {(order.status === 'pending' || order.status === 'preparing') && (
                      <button 
                        onClick={() => handleStatusUpdate(order.id, 'cancelled')}
                        className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-xs font-bold text-red-500 hover:bg-red-50"
                      >
                        取消
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function StatCard({ icon, label, count, color, bgColor }: { icon: React.ReactNode, label: string, count: number, color: string, bgColor: string }) {
  return (
    <div className={`flex min-w-[120px] flex-1 items-center gap-3 rounded-2xl ${bgColor} border-2 border-white p-3 shadow-sm`}>
      <div className={`${color}`}>{icon}</div>
      <div>
        <div className={`text-xl font-black ${color}`}>{count}</div>
        <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500 opacity-60">{label}</div>
      </div>
    </div>
  );
}
