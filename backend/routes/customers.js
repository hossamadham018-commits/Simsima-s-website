import express from 'express';
import { db } from '../db.js';
import { authenticateToken, isAdmin } from '../middleware/auth.js';
import { buildCustomerDetails, buildCustomerSummary } from '../utils/customerAnalytics.js';

const router = express.Router();

router.get('/analytics', authenticateToken, isAdmin, (req, res) => {
  const customers = buildCustomerDetails(db);

  res.json({
    summary: buildCustomerSummary(customers),
    customers
  });
});

router.get('/:id', authenticateToken, isAdmin, (req, res) => {
  const customers = buildCustomerDetails(db);
  const customer = customers.find(item => item.customerId === parseInt(req.params.id));

  if (!customer) {
    return res.status(404).json({ error: 'Customer not found' });
  }

  res.json(customer);
});

export default router;
