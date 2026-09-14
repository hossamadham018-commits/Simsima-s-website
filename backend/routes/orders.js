import express from 'express';
import { db, saveDb } from '../db.js';
import { authenticateToken, isAdmin } from '../middleware/auth.js';
import { buildCustomerDetails } from '../utils/customerAnalytics.js';

const router = express.Router();

router.post('/', authenticateToken, (req, res) => {
  const customer = db.users.find(user => user.id === req.user.id);
  const order = {
    id: db.nextOrderId++,
    userId: req.user.id,
    customerName: customer?.name || '',
    customerEmail: customer?.email || '',
    customerPhone: customer?.phone || '',
    items: req.body.items,
    total: req.body.total,
    deliveryAddress: req.body.deliveryAddress,
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  
  db.orders.push(order);
  buildCustomerDetails(db);
  saveDb();
  res.status(201).json(order);
});

router.get('/', authenticateToken, (req, res) => {
  const orders = req.user.role === 'admin' 
    ? db.orders 
    : db.orders.filter(o => o.userId === req.user.id);
  res.json(orders);
});

router.patch('/:id/status', authenticateToken, isAdmin, (req, res) => {
  const order = db.orders.find(o => o.id === parseInt(req.params.id));
  if (!order) return res.status(404).json({ error: 'Order not found' });
  
  order.status = req.body.status;
  buildCustomerDetails(db);
  saveDb();
  res.json(order);
});

export default router;
