export type Size = 'M' | 'L' | 'Bottle';
export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';
export type UserRole = 'admin' | 'customer';

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  prices: {
    M?: number;
    L?: number;
    Bottle?: number;
  };
  description?: string;
  tags?: string[];
  available: boolean;
  image?: string;
}

export interface OrderItem {
  menuItemId: string;
  name: string;
  size: Size;
  sugar: string;
  ice: string;
  toppings: string[];
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  items: OrderItem[];
  totalPrice: number;
  status: OrderStatus;
  createdAt: any; // Firestore Timestamp
  updatedAt: any;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  createdAt: any;
}

export const CATEGORIES = [
  '找好茶',
  '無咖啡因',
  '芝士奶蓋',
  '找鮮奶',
  '找特調',
  '找果茶',
  '找奶茶'
];

export const SUGAR_LEVELS = [
  '120% (多糖)',
  '100% (正常)',
  '80% (少糖)',
  '50% (半糖)',
  '30% (微糖)',
  '10% (一分糖)',
  '0% (無糖)'
];

export const ICE_LEVELS = [
  '多冰',
  '正常',
  '少冰',
  '微冰',
  '去冰',
  '完全去冰(小碎冰)',
  '溫/熱'
];

export const TOPPINGS = [
  { name: '桂花檸凍', price: 15 },
  { name: '珍珠', price: 5 },
  { name: '仙草凍', price: 5 },
  { name: '西米露', price: 5 },
  { name: '焙香粉角', price: 10 },
  { name: '茶凍', price: 10 },
  { name: '芋圓', price: 10 },
  { name: '紅豆', price: 10 },
  { name: '粉粿', price: 10 },
  { name: '寒天', price: 10 },
  { name: '椰果', price: 10 }
];
