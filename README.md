# Simsima's Kitchen - Home Katering Platform

Complete home food catering website with customer frontend, admin dashboard, and backend API.

## 🚀 Features

### Customer Frontend (Port 3000)
- Browse menu with categories
- Add items to cart
- User registration & login
- Place orders with delivery address
- Track order status
- Responsive design

### Admin Dashboard (Port 3001)
- Manage menu items (Add/Edit/Delete)
- View and process orders
- Update order status (Pending → Processing → Completed)
- Real-time order management

### Backend API (Port 5000)
- RESTful API with Express.js
- JWT authentication
- User management
- Order processing
- Menu management

## 📦 Installation

```bash
# Install all dependencies
npm run install:all
```

## 🏃 Running the Application

### Option 1: Run all services separately

```bash
# Terminal 1: Start Backend
cd backend
npm run dev

# Terminal 2: Start Frontend
cd frontend
npm run dev

# Terminal 3: Start Dashboard
cd dashboard
npm run dev
```

### Option 2: Use individual commands

```bash
npm run dev:backend    # Backend on port 5000
npm run dev:frontend   # Frontend on port 3000
npm run dev:dashboard  # Dashboard on port 3001
```

## 🌐 Access Points

- **Customer Website**: http://localhost:3000
- **Admin Dashboard**: http://localhost:3001
- **Backend API**: http://localhost:5000

## 👤 Default Admin Account

To create an admin account, you need to manually add a user with `role: 'admin'` in the backend/db.js file or use the register endpoint and change the role.

**Quick Admin Setup:**
1. Register a normal account via frontend
2. Go to `backend/db.js` and change that user's role to `'admin'`
3. Login to dashboard with admin credentials

## 📱 Customer Flow

1. Visit homepage → View menu
2. Register/Login
3. Add items to cart
4. Checkout with delivery address
5. Track orders

## 🛠️ Admin Flow

1. Login to dashboard with admin account
2. Manage menu items
3. View incoming orders
4. Update order status

## 🎨 Design System

**Colors:**
- Primary: #4a7c59 (Green)
- Secondary: #f4a261 (Orange)
- Accent: #e76f51 (Red-Orange)
- Success: #2a9d8f (Teal)

**Typography:**
- Font Family: Segoe UI, Tahoma, Geneva, Verdana, sans-serif
- Headings: Bold, varying sizes
- Body: Regular, 1rem

## 🔧 Tech Stack

**Frontend & Dashboard:**
- React 18
- React Router 6
- Axios
- Vite

**Backend:**
- Node.js
- Express.js
- JWT Authentication
- bcryptjs

## 📝 API Endpoints

### Auth
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login

### Menu
- GET `/api/menu` - Get all menu items
- POST `/api/menu` - Add item (Admin only)
- PUT `/api/menu/:id` - Update item (Admin only)
- DELETE `/api/menu/:id` - Delete item (Admin only)

### Orders
- GET `/api/orders` - Get user orders (all orders for admin)
- POST `/api/orders` - Create order
- PATCH `/api/orders/:id/status` - Update status (Admin only)

## 🔐 Environment Variables

Backend `.env`:
```
PORT=5000
JWT_SECRET=your-secret-key-change-in-production
NODE_ENV=development
```

## 📂 Project Structure

```
home-katering/
├── frontend/              # Customer-facing website
│   ├── src/
│   │   ├── components/    # Navbar, etc.
│   │   ├── context/       # Auth & Cart context
│   │   ├── pages/         # Home, Menu, Cart, Orders, Login, Register
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
├── backend/               # API Server
│   ├── routes/           # Auth, Menu, Orders routes
│   ├── middleware/       # Authentication middleware
│   ├── db.js            # In-memory database
│   ├── server.js        # Express server
│   └── package.json
├── dashboard/            # Admin Dashboard
│   ├── src/
│   │   ├── components/  # Login, Orders, Menu
│   │   └── App.jsx
│   └── package.json
└── README.md
```

## ⚠️ Important Notes

- This uses in-memory storage - data resets on server restart
- For production: Replace with real database (MongoDB, PostgreSQL)
- Update JWT_SECRET in production
- Add image upload functionality for menu items
- Implement payment gateway integration
- Add email notifications

## 🚀 Next Steps for Production

1. Set up real database
2. Add file upload for menu images
3. Implement payment gateway (Midtrans, etc.)
4. Add email notifications
5. Deploy to cloud hosting
6. Set up SSL certificates
7. Add order tracking with real-time updates
8. Implement delivery scheduling

## 📞 Support

For issues or questions, please check the code or reach out to the development team.

---

Built with ❤️ for Simsima's Kitchen - Fresh Food Quality
