# 🚀 Quick Setup Instructions

## Prerequisites

Make sure you have installed:
- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)

## Installation Steps

### 1️⃣ Install All Dependencies

Open your terminal in the project root directory and run:

```bash
npm run install:all
```

This will install dependencies for all three projects (frontend, backend, dashboard).

### 2️⃣ Start the Backend Server

Open a new terminal window and run:

```bash
cd backend
npm run dev
```

You should see: `Server running on port 5000`

### 3️⃣ Start the Frontend (Customer Website)

Open another new terminal window and run:

```bash
cd frontend
npm run dev
```

You should see: `Local: http://localhost:3000/`

### 4️⃣ Start the Dashboard (Admin Panel)

Open another new terminal window and run:

```bash
cd dashboard
npm run dev
```

You should see: `Local: http://localhost:3001/`

## 🌐 Access the Applications

Now you can open your browser and visit:

1. **Customer Website**: http://localhost:3000
2. **Admin Dashboard**: http://localhost:3001
3. **Backend API**: http://localhost:5000

## 👤 Creating an Admin Account

Since this is in-memory storage, you'll need to create an admin manually:

### Option 1: Quick Method
1. Go to http://localhost:3000/register
2. Register a new account (use any email/password you'll remember)
3. Open `backend/db.js` in your code editor
4. Find your user in the `users` array
5. Change `role: 'customer'` to `role: 'admin'`
6. Save the file
7. Go to http://localhost:3001 and login with your credentials

### Option 2: Pre-create Admin
Open `backend/db.js` and add this to the `users` array:

```javascript
users: [
  {
    id: 1,
    email: 'admin@simsima.com',
    password: '$2a$10$YourHashedPasswordHere', // You'll need to hash this
    name: 'Admin',
    phone: '1234567890',
    role: 'admin'
  }
],
```

Then you can login with `admin@simsima.com` / your password

## 📝 Testing the System

### Customer Flow
1. Visit http://localhost:3000
2. Click "Order Now" or go to Menu
3. Register a new account
4. Add items to cart
5. Go to cart and place an order
6. View your orders in "My Orders"

### Admin Flow
1. Visit http://localhost:3001
2. Login with admin credentials
3. View incoming orders
4. Change order status (Pending → Processing → Completed)
5. Go to "Menu" tab
6. Add/Edit/Delete menu items

## ⚠️ Important Notes

- **Data is temporary**: All data resets when you restart the backend server
- **Keep all 3 terminals running**: Backend, Frontend, and Dashboard
- **Port conflicts**: Make sure ports 3000, 3001, and 5000 are not in use

## 🐛 Troubleshooting

### "Port already in use"
- Close other applications using those ports
- Or change ports in the config files

### "Cannot find module"
- Run `npm run install:all` again
- Check if Node.js is properly installed: `node --version`

### Backend not responding
- Make sure backend is running on port 5000
- Check console for error messages
- Verify `.env` file exists in backend folder

### Can't login to dashboard
- Make sure you created an admin account
- Check if the role is set to 'admin' in db.js
- Verify backend is running

## 🎉 Success!

If all three services are running and you can access the websites, you're all set! Start exploring the application.

## 📞 Need Help?

Check the main README.md for more detailed information about:
- API endpoints
- Project structure
- Features
- Tech stack

---

Enjoy using Simsima's Kitchen! 🍳
