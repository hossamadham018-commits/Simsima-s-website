import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, 'data');
const databasePath = path.join(dataDir, 'database.json');
const customerDetailsPath = path.join(dataDir, 'customer-details.json');

// Default admin account:
// Email: admin@simsima.com
// Password: admin123

const defaultDb = {
  users: [
    {
      id: 1,
      email: 'admin@simsima.com',
      password: '$2a$10$bekA0uIJ74Wxx7FsgYWKZ.GIhjGWhKxAFjoDHBLJ0aR0jjCSTaWvi', // admin123
      name: 'Admin Simsima',
      phone: '08123456789',
      role: 'admin'
    }
  ],
  menuItems: [
    { 
      id: 1, 
      name: 'Nasi Goreng Special', 
      nameAr: 'أرز مقلي خاص',
      price: 25000, 
      category: 'main', 
      image: '/images/nasi-goreng.jpg', 
      description: 'Fried rice with chicken and vegetables',
      descriptionAr: 'أرز مقلي مع الدجاج والخضروات'
    },
    { 
      id: 2, 
      name: 'Ayam Bakar', 
      nameAr: 'دجاج مشوي',
      price: 30000, 
      category: 'main', 
      image: '/images/ayam-bakar.jpg', 
      description: 'Grilled chicken with special sauce',
      descriptionAr: 'دجاج مشوي مع صلصة خاصة'
    },
    { 
      id: 3, 
      name: 'Gado-Gado', 
      nameAr: 'سلطة غادو غادو',
      price: 20000, 
      category: 'appetizer', 
      image: '/images/gado-gado.jpg', 
      description: 'Indonesian salad with peanut sauce',
      descriptionAr: 'سلطة إندونيسية مع صلصة الفول السوداني'
    },
    { 
      id: 4, 
      name: 'Es Teh Manis', 
      nameAr: 'شاي مثلج محلى',
      price: 5000, 
      category: 'beverage', 
      image: '/images/es-teh.jpg', 
      description: 'Sweet iced tea',
      descriptionAr: 'شاي بارد محلى'
    }
  ],
  deals: [
    {
      id: 1,
      name: 'Combo Special',
      nameAr: 'عرض خاص',
      description: 'Nasi Goreng + Ayam Bakar + Es Teh',
      descriptionAr: 'أرز مقلي + دجاج مشوي + شاي مثلج',
      originalPrice: 60000,
      discountPercent: 25,
      dealPrice: 45000,
      image: '',
      dayOfWeek: 'monday',
      isActive: true
    }
  ],
  orders: [],
  customerDetails: [],
  nextOrderId: 1
};

const rebuildFromCustomerDetails = () => {
  if (!fs.existsSync(customerDetailsPath)) return null;

  try {
    const savedAnalytics = JSON.parse(fs.readFileSync(customerDetailsPath, 'utf8'));
    const customers = savedAnalytics.customers || [];
    const users = [
      ...defaultDb.users,
      ...customers.map(customer => ({
        id: customer.customerId,
        email: customer.email,
        password: '',
        name: customer.name,
        phone: customer.phone,
        role: 'customer'
      }))
    ];
    const orders = customers.flatMap(customer =>
      (customer.recentOrders || []).map(order => ({
        ...order,
        userId: customer.customerId,
        customerName: customer.name,
        customerEmail: customer.email,
        customerPhone: customer.phone
      }))
    );

    return {
      ...defaultDb,
      users,
      orders,
      customerDetails: customers,
      nextOrderId: Math.max(0, ...orders.map(order => order.id || 0)) + 1
    };
  } catch (error) {
    console.error('Failed to rebuild customer data:', error);
    return null;
  }
};

const loadDb = () => {
  if (fs.existsSync(databasePath)) {
    try {
      const saved = JSON.parse(fs.readFileSync(databasePath, 'utf8'));
      return {
        ...defaultDb,
        ...saved,
        users: saved.users?.length ? saved.users : defaultDb.users,
        menuItems: saved.menuItems?.length ? saved.menuItems : defaultDb.menuItems,
        deals: saved.deals?.length ? saved.deals : defaultDb.deals,
        orders: saved.orders || [],
        customerDetails: saved.customerDetails || [],
        nextOrderId: saved.nextOrderId || Math.max(0, ...(saved.orders || []).map(order => order.id || 0)) + 1
      };
    } catch (error) {
      console.error('Failed to load database file:', error);
    }
  }

  return rebuildFromCustomerDetails() || defaultDb;
};

export const db = loadDb();

export const saveDb = () => {
  fs.mkdirSync(dataDir, { recursive: true });
  fs.writeFileSync(databasePath, JSON.stringify(db, null, 2));
};
