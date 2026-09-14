import express from 'express';
import { db, saveDb } from '../db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all deals (public - only active deals for today)
router.get('/', (req, res) => {
  const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const today = daysOfWeek[new Date().getDay()];
  
  const activeDeals = db.deals.filter(deal => 
    deal.dayOfWeek === today && deal.isActive
  );
  
  const dealsWithPricing = activeDeals.map(deal => {
    // If deal has menuItemId, get menu item details
    if (deal.menuItemId) {
      const menuItem = db.menuItems.find(item => item.id === deal.menuItemId);
      if (!menuItem) return null;
      
      return {
        ...deal,
        menuItem: {
          ...menuItem,
          originalPrice: menuItem.price,
          dealPrice: Math.round(menuItem.price * (1 - deal.discountPercent / 100))
        }
      };
    } else {
      // Custom deal with its own pricing
      return {
        ...deal,
        menuItem: {
          id: deal.id,
          name: deal.name,
          nameAr: deal.nameAr,
          description: deal.description,
          descriptionAr: deal.descriptionAr,
          image: deal.image,
          price: deal.originalPrice,
          originalPrice: deal.originalPrice,
          dealPrice: deal.dealPrice || Math.round(deal.originalPrice * (1 - deal.discountPercent / 100))
        }
      };
    }
  }).filter(deal => deal !== null);
  
  res.json(dealsWithPricing);
});

// Get all deals (admin only - includes inactive and future deals)
router.get('/admin/all', authenticateToken, (req, res) => {
  const dealsWithDetails = db.deals.map(deal => {
    // If deal has menuItemId, get menu item details
    if (deal.menuItemId) {
      const menuItem = db.menuItems.find(item => item.id === deal.menuItemId);
      if (!menuItem) return null;
      
      return {
        ...deal,
        menuItem: {
          ...menuItem,
          originalPrice: menuItem.price,
          dealPrice: Math.round(menuItem.price * (1 - deal.discountPercent / 100))
        }
      };
    } else {
      // Custom deal with its own details
      return {
        ...deal,
        menuItem: {
          id: deal.id,
          name: deal.name,
          nameAr: deal.nameAr,
          description: deal.description,
          descriptionAr: deal.descriptionAr,
          image: deal.image,
          price: deal.originalPrice,
          originalPrice: deal.originalPrice,
          dealPrice: deal.dealPrice || Math.round(deal.originalPrice * (1 - deal.discountPercent / 100))
        }
      };
    }
  }).filter(deal => deal !== null);
  
  res.json(dealsWithDetails);
});

// Get deal by ID
router.get('/:id', (req, res) => {
  const deal = db.deals.find(d => d.id === parseInt(req.params.id));
  if (!deal) {
    return res.status(404).json({ error: 'Deal not found' });
  }
  
  const menuItem = db.menuItems.find(item => item.id === deal.menuItemId);
  if (!menuItem) {
    return res.status(404).json({ error: 'Menu item not found' });
  }
  
  res.json({
    ...deal,
    menuItem: {
      ...menuItem,
      originalPrice: menuItem.price,
      dealPrice: Math.round(menuItem.price * (1 - deal.discountPercent / 100))
    }
  });
});

// Create new deal (admin only)
router.post('/', authenticateToken, (req, res) => {
  const { menuItemId, discountPercent, dayOfWeek, name, nameAr, description, descriptionAr, originalPrice, dealPrice, image } = req.body;
  
  if (!dayOfWeek) {
    return res.status(400).json({ error: 'Day of week is required' });
  }
  
  // Check if a deal already exists for this day
  const existingDeal = db.deals.find(deal => deal.dayOfWeek === dayOfWeek);
  if (existingDeal) {
    return res.status(400).json({ error: 'A deal already exists for this day' });
  }
  
  let newDeal;
  
  if (menuItemId) {
    // Menu item deal
    const menuItem = db.menuItems.find(item => item.id === menuItemId);
    if (!menuItem) {
      return res.status(404).json({ error: 'Menu item not found' });
    }
    
    if (!discountPercent) {
      return res.status(400).json({ error: 'Discount percentage is required for menu item deals' });
    }
    
    newDeal = {
      id: db.deals.length + 1,
      menuItemId,
      discountPercent,
      dayOfWeek,
      isActive: true
    };
  } else {
    // Custom deal
    if (!name || !originalPrice) {
      return res.status(400).json({ error: 'Name and original price are required for custom deals' });
    }
    
    const calculatedDealPrice = dealPrice || Math.round(originalPrice * (1 - (discountPercent || 0) / 100));
    
    newDeal = {
      id: db.deals.length + 1,
      name,
      nameAr: nameAr || '',
      description: description || '',
      descriptionAr: descriptionAr || '',
      originalPrice,
      discountPercent: discountPercent || 0,
      dealPrice: calculatedDealPrice,
      image: image || '',
      dayOfWeek,
      isActive: true
    };
  }
  
  db.deals.push(newDeal);
  saveDb();
  res.status(201).json(newDeal);
});

// Update deal (admin only)
router.put('/:id', authenticateToken, (req, res) => {
  const dealIndex = db.deals.findIndex(d => d.id === parseInt(req.params.id));
  if (dealIndex === -1) {
    return res.status(404).json({ error: 'Deal not found' });
  }
  
  const { menuItemId, discountPercent, dayOfWeek, isActive, name, nameAr, description, descriptionAr, originalPrice, dealPrice, image } = req.body;
  
  if (dayOfWeek !== undefined) {
    // Check if another deal already exists for the new day
    const existingDeal = db.deals.find(deal => 
      deal.dayOfWeek === dayOfWeek && deal.id !== parseInt(req.params.id)
    );
    if (existingDeal) {
      return res.status(400).json({ error: 'A deal already exists for this day' });
    }
    db.deals[dealIndex].dayOfWeek = dayOfWeek;
  }
  
  if (menuItemId !== undefined) {
    const menuItem = db.menuItems.find(item => item.id === menuItemId);
    if (!menuItem) {
      return res.status(404).json({ error: 'Menu item not found' });
    }
    db.deals[dealIndex].menuItemId = menuItemId;
    // Remove custom deal fields when switching to menu item
    delete db.deals[dealIndex].name;
    delete db.deals[dealIndex].nameAr;
    delete db.deals[dealIndex].description;
    delete db.deals[dealIndex].descriptionAr;
    delete db.deals[dealIndex].originalPrice;
    delete db.deals[dealIndex].dealPrice;
    delete db.deals[dealIndex].image;
  } else if (name !== undefined) {
    // Custom deal update
    db.deals[dealIndex].name = name;
    db.deals[dealIndex].nameAr = nameAr || '';
    db.deals[dealIndex].description = description || '';
    db.deals[dealIndex].descriptionAr = descriptionAr || '';
    db.deals[dealIndex].originalPrice = originalPrice;
    db.deals[dealIndex].dealPrice = dealPrice || Math.round(originalPrice * (1 - (discountPercent || 0) / 100));
    db.deals[dealIndex].image = image || '';
    // Remove menuItemId when switching to custom deal
    delete db.deals[dealIndex].menuItemId;
  }
  
  if (discountPercent !== undefined) db.deals[dealIndex].discountPercent = discountPercent;
  if (isActive !== undefined) db.deals[dealIndex].isActive = isActive;
  
  saveDb();
  res.json(db.deals[dealIndex]);
});

// Delete deal (admin only)
router.delete('/:id', authenticateToken, (req, res) => {
  const dealIndex = db.deals.findIndex(d => d.id === parseInt(req.params.id));
  if (dealIndex === -1) {
    return res.status(404).json({ error: 'Deal not found' });
  }
  
  db.deals.splice(dealIndex, 1);
  saveDb();
  res.json({ message: 'Deal deleted successfully' });
});

export default router;
