import express from 'express';
import { db, saveDb } from '../db.js';
import { authenticateToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.json(db.menuItems);
});

router.post('/', authenticateToken, isAdmin, (req, res) => {
  const item = {
    id: db.menuItems.length + 1,
    ...req.body
  };
  db.menuItems.push(item);
  saveDb();
  res.status(201).json(item);
});

router.put('/:id', authenticateToken, isAdmin, (req, res) => {
  const index = db.menuItems.findIndex(i => i.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'Item not found' });
  
  db.menuItems[index] = { ...db.menuItems[index], ...req.body };
  saveDb();
  res.json(db.menuItems[index]);
});

router.delete('/:id', authenticateToken, isAdmin, (req, res) => {
  const index = db.menuItems.findIndex(i => i.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'Item not found' });
  
  db.menuItems.splice(index, 1);
  saveDb();
  res.json({ message: 'Item deleted' });
});

export default router;
