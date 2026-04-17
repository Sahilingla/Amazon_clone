# MongoDB Atlas + Mongoose Deployment Guide

## ✅ Changes Made
- Replaced PostgreSQL with MongoDB Atlas + Mongoose
- Updated `package.json` - removed `pg` and `sequelize`, added `mongoose`
- Rewrote `config/database.js` for MongoDB connection
- Updated `server.js` to support serverless deployment (Vercel/Render)
- Converted `models/Product.js` to Mongoose schema
- Added `/api/test` route for testing database connection
- Created `.env.example` for configuration template

---

## 📋 Setup Instructions

### 1. **Create MongoDB Atlas Account & Cluster**
   - Sign up at [mongodb.com](https://mongodb.com)
   - Create a free cluster
   - Create a database user with credentials
   - Get the connection string in format:
     ```
     mongodb+srv://username:password@cluster0.mongodb.net/ecommerce?retryWrites=true&w=majority
     ```

### 2. **Local Development Setup**
   - Create `.env` file in `/backend` folder:
     ```env
     MONGO_URI=mongodb+srv://username:password@cluster0.mongodb.net/ecommerce?retryWrites=true&w=majority
     PORT=5000
     NODE_ENV=development
     JWT_SECRET=your_jwt_secret_here
     ```
   - Replace `username`, `password`, `cluster0` with your actual values

   - Install dependencies:
     ```bash
     cd backend
     npm install
     ```

   - Run locally:
     ```bash
     npm run dev
     ```

   - Test the route:
     ```
     http://localhost:5000/api/test
     ```

---

## 🚀 Deploy to Render

### **Step 1: Create PostgreSQL Database** (Now replaced with MongoDB Atlas)
Skip this - use MongoDB Atlas instead

### **Step 2: Set Environment Variables in Render**
1. Go to your Web Service on **Render Dashboard**
2. Click **Environment** tab
3. Add:
   - **Key:** `MONGO_URI`
   - **Value:** Your MongoDB Atlas connection string
4. Add:
   - **Key:** `NODE_ENV`
   - **Value:** `production`
5. Click **Save Changes**

### **Step 3: Ensure Build Command is Correct**
1. Go to **Settings** tab
2. Build Command: `npm install`
3. Start Command: `node server.js`
4. Save and redeploy

### **Step 4: Manual Deploy**
1. Go to **Deploys** tab
2. Click **Manual Deploy** → **Deploy latest commit**
3. Check logs for: `MongoDB connected successfully`

---

## 🌐 Deploy to Vercel

### **Step 1: Add to package.json (if missing)**
```json
{
  "scripts": {
    "start": "node server.js",
    "build": "echo 'No build needed for Node.js'"
  }
}
```

### **Step 2: Create Vercel Config**
Create `/backend/vercel.json`:
```json
{
  "version": 2,
  "builds": [
    { "src": "server.js", "use": "@vercel/node" }
  ],
  "routes": [
    { "src": "/(.*)", "dest": "server.js" }
  ],
  "env": {
    "MONGO_URI": "@mongo_uri",
    "JWT_SECRET": "@jwt_secret"
  }
}
```

### **Step 3: Deploy**
```bash
npm i -g vercel
vercel --prod
```

### **Step 4: Add Environment Variables**
- Go to Vercel Dashboard → Project Settings → Environment Variables
- Add `MONGO_URI` and `JWT_SECRET`
- Redeploy

---

## ✅ Testing After Deployment

### **Test Database Connection**
```bash
curl https://your-deployed-url/api/test
```

Should return:
```json
{
  "success": true,
  "message": "Sample product created",
  "data": { ... }
}
```

### **Troubleshooting**

| Error | Solution |
|-------|----------|
| `MONGO_URI is not set` | Add `MONGO_URI` to environment variables |
| `MongoDB connection error` | Check IP whitelist in MongoDB Atlas (allow 0.0.0.0/0 for public access) |
| `Cannot connect to cluster` | Verify credentials and cluster name in connection string |
| `Port already in use` | Change `PORT` in `.env` |

---

## 📝 MongoDB Atlas IP Whitelist Setup
1. Go to MongoDB Atlas Dashboard
2. Click **Network Access** → **Add IP Address**
3. Select **Allow access from anywhere** (0.0.0.0/0) for development
4. For production, whitelist specific IPs only

---

## 🔄 Database Seeding
Use `/api/test` to seed initial data. For bulk seeding, create a `/backend/scripts/seed.js`:

```javascript
const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

const seedDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  
  const products = [
    { name: 'Laptop', price: 999, description: 'High-end laptop' },
    { name: 'Phone', price: 699, description: 'Latest smartphone' },
  ];
  
  await Product.insertMany(products);
  console.log('Database seeded!');
  process.exit();
};

seedDB();
```

Run: `node scripts/seed.js`

---

## 🎯 Key Features
✅ **Auto-create database** - MongoDB Atlas creates on first insertion
✅ **Error handling** - Connection failures exit process gracefully
✅ **Serverless ready** - Exports app for Vercel/Render Functions
✅ **Environment variables** - All config via process.env
✅ **Production SSL** - Automatically handled by MongoDB Atlas

---

## 📚 Next Steps
1. Update other models (User, Cart, Order) to use Mongoose schemas
2. Update controllers to use Mongoose query methods
3. Update middleware if using Sequelize-specific features
4. Test all CRUD operations

