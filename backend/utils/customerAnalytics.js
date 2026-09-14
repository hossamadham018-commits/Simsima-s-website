import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const customerDetailsPath = path.join(__dirname, '..', 'data', 'customer-details.json');

const money = (value) => Number(value || 0);

const saveCustomerDetails = (records) => {
  fs.mkdirSync(path.dirname(customerDetailsPath), { recursive: true });
  fs.writeFileSync(customerDetailsPath, JSON.stringify({
    updatedAt: new Date().toISOString(),
    customers: records
  }, null, 2));
};

const getMonthKey = (dateValue) => {
  const date = new Date(dateValue);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
};

const daysBetween = (start, end) => {
  const dayMs = 1000 * 60 * 60 * 24;
  return Math.round(Math.abs(new Date(end) - new Date(start)) / dayMs);
};

const summarizeFavoriteItems = (orders) => {
  const items = new Map();

  orders.forEach((order) => {
    order.items.forEach((item) => {
      const key = item.id || item.name;
      const current = items.get(key) || {
        id: item.id || key,
        name: item.name,
        nameAr: item.nameAr || '',
        quantity: 0,
        revenue: 0
      };

      const quantity = Number(item.quantity || 1);
      current.quantity += quantity;
      current.revenue += money(item.price) * quantity;
      items.set(key, current);
    });
  });

  return [...items.values()]
    .sort((a, b) => b.quantity - a.quantity || b.revenue - a.revenue)
    .slice(0, 5);
};

const getCustomerSegment = ({ totalOrders, totalSpent, daysSinceLastOrder }) => {
  if (totalSpent >= 150000 || totalOrders >= 6) return 'VIP';
  if (daysSinceLastOrder !== null && daysSinceLastOrder > 30 && totalOrders > 0) return 'At risk';
  if (totalOrders >= 3) return 'Loyal';
  if (totalOrders === 1) return 'New';
  return 'No orders yet';
};

export const buildCustomerDetails = (db) => {
  const customers = db.users.filter((user) => user.role === 'customer');
  const now = new Date().toISOString();

  const records = customers.map((customer) => {
    const customerOrders = db.orders
      .filter((order) => order.userId === customer.id)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const revenueOrders = customerOrders.filter((order) => order.status !== 'cancelled');
    const totalSpent = revenueOrders.reduce((sum, order) => sum + money(order.total), 0);
    const monthlySpendMap = new Map();

    revenueOrders.forEach((order) => {
      const month = getMonthKey(order.createdAt);
      monthlySpendMap.set(month, (monthlySpendMap.get(month) || 0) + money(order.total));
    });

    const monthlyBreakdown = [...monthlySpendMap.entries()]
      .map(([month, total]) => ({ month, total }))
      .sort((a, b) => a.month.localeCompare(b.month));

    const activeMonths = Math.max(monthlyBreakdown.length, 1);
    const firstOrderAt = customerOrders.at(-1)?.createdAt || null;
    const latestOrderAt = customerOrders[0]?.createdAt || null;
    const daysSinceLastOrder = latestOrderAt ? daysBetween(latestOrderAt, now) : null;

    const statusCounts = customerOrders.reduce((counts, order) => {
      counts[order.status] = (counts[order.status] || 0) + 1;
      return counts;
    }, {});

    const deliveryAddresses = [...new Set(customerOrders.map((order) => order.deliveryAddress).filter(Boolean))];
    const totalOrders = customerOrders.length;
    const averageOrderValue = revenueOrders.length ? Math.round(totalSpent / revenueOrders.length) : 0;
    const averageMonthlySpend = Math.round(totalSpent / activeMonths);
    const orderFrequencyDays = totalOrders > 1 && firstOrderAt && latestOrderAt
      ? Math.max(1, Math.round(daysBetween(firstOrderAt, latestOrderAt) / (totalOrders - 1)))
      : null;

    return {
      customerId: customer.id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      role: customer.role,
      totalOrders,
      completedOrders: statusCounts.completed || 0,
      cancelledOrders: statusCounts.cancelled || 0,
      pendingOrders: statusCounts.pending || 0,
      processingOrders: statusCounts.processing || 0,
      totalSpent,
      averageOrderValue,
      averageMonthlySpend,
      activeMonths,
      orderFrequencyDays,
      firstOrderAt,
      latestOrderAt,
      daysSinceLastOrder,
      segment: getCustomerSegment({ totalOrders, totalSpent, daysSinceLastOrder }),
      deliveryAddresses,
      favoriteItems: summarizeFavoriteItems(revenueOrders),
      monthlyBreakdown,
      recentOrders: customerOrders.slice(0, 5).map((order) => ({
        id: order.id,
        total: order.total,
        status: order.status,
        createdAt: order.createdAt,
        deliveryAddress: order.deliveryAddress,
        items: order.items
      }))
    };
  });

  db.customerDetails = records;
  saveCustomerDetails(records);
  return records;
};

export const buildCustomerSummary = (customerDetails) => {
  const totalCustomers = customerDetails.length;
  const payingCustomers = customerDetails.filter((customer) => customer.totalSpent > 0).length;
  const totalRevenue = customerDetails.reduce((sum, customer) => sum + customer.totalSpent, 0);
  const totalOrders = customerDetails.reduce((sum, customer) => sum + customer.totalOrders, 0);

  return {
    totalCustomers,
    payingCustomers,
    totalRevenue,
    totalOrders,
    averageCustomerValue: payingCustomers ? Math.round(totalRevenue / payingCustomers) : 0,
    averageOrdersPerCustomer: totalCustomers ? Number((totalOrders / totalCustomers).toFixed(1)) : 0,
    vipCustomers: customerDetails.filter((customer) => customer.segment === 'VIP').length,
    atRiskCustomers: customerDetails.filter((customer) => customer.segment === 'At risk').length
  };
};
