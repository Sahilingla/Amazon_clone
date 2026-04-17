# ✅ Deployment Checklist

## Before Deployment

### 1. **Local Testing Setup**
```bash
cd backend
npm install
```

### 2. **Create .env File**
Create `backend/.env` with:
```env
MONGO_URI=mongodb+srv://username:password@cluster0.mongodb.net/ecommerce?retryWrites=true&w=majority
PORT=5000
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key_here_min_32_chars
```

Replace:
- `username` → Your MongoDB Atlas user
- `password` → Your MongoDB Atlas password
- `cluster0` → Your cluster name
- `JWT_SECRET` → Any secure random string

### 3. **Test Locally**
```bash
npm run dev
```

Then test these endpoints:

**Test Database Connection:**
```bash
curl http://localhost:5000/api/test
```

**Signup:**
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Get Products:**
```bash
curl http://localhost:5000/api/products
```

---

## Deployment to Render

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Convert to MongoDB with Mongoose"
git push origin main
```

### Step 2: Create MongoDB Atlas Database
1. Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Sign up or login
3. Create a **Free Cluster**
4. Create database **user** with username and password
5. Get **Connection String** in format:
   ```
   mongodb+srv://username:password@cluster0.mongodb.net/ecommerce?retryWrites=true&w=majority
   ```

### Step 3: Set IP Whitelist in MongoDB Atlas
1. Go to **Network Access**
2. Click **Add IP Address**
3. Select **Allow Access from Anywhere** (0.0.0.0/0)
4. Click **Confirm**

### Step 4: Update Render Environment Variables
1. Go to [render.com](https://render.com) Dashboard
2. Select your Web Service
3. Go to **Environment** tab
4. Add new variable:
   - **Key:** `MONGO_URI`
   - **Value:** Your MongoDB connection string from Step 2
5. Add another variable:
   - **Key:** `JWT_SECRET`
   - **Value:** Any secure random string
6. Click **Save Changes**

### Step 5: Deploy
1. Go to **Deploys** tab
2. Click **Manual Deploy** → **Deploy latest commit**
3. Wait for build to complete
4. Check **Logs** for: `MongoDB connected successfully`

### Step 6: Test Production Deployment
```bash
curl https://your-render-url.onrender.com/api/test
```

Should return:
```json
{
  "success": true,
  "message": "Sample product created",
  "data": { ... }
}
```

---

## Deployment to Vercel

### Step 1: Install Vercel CLI
```bash
npm i -g vercel
```

### Step 2: Create vercel.json
Create `backend/vercel.json`:
```json
{
  "version": 2,
  "builds": [
    { "src": "server.js", "use": "@vercel/node" }
  ],
  "routes": [
    { "src": "/(.*)", "dest": "server.js" }
  ]
}
```

### Step 3: Deploy
```bash
cd backend
vercel --prod
```

### Step 4: Add Environment Variables in Vercel Dashboard
1. Go to Project Settings → Environment Variables
2. Add `MONGO_URI` and `JWT_SECRET`
3. Redeploy

---

## Changes Made

✅ **Models** - All converted to Mongoose  
✅ **Controllers** - All updated to use Mongoose  
✅ **Server** - Supports serverless platforms  
✅ **Middleware** - Updated for Mongoose ObjectIds  
✅ **Database** - Auto-creates on first insert  

---

## Troubleshooting

| Error | Solution |
|-------|----------|
| `MONGO_URI is not set` | Add `MONGO_URI` to environment variables |
| `MongoNetworkError: connection refused` | Check IP whitelist in MongoDB Atlas (0.0.0.0/0) |
| `Invalid credentials` | Verify username, password in connection string |
| `Port already in use` | Change PORT in .env |
| `Cannot find module 'bcryptjs'` | Run `npm install` |
| `Token is not valid` | Make sure JWT_SECRET is the same in all environments |

---

## What's Ready to Deploy

✅ Node.js Express server  
✅ MongoDB Atlas integration  
✅ User authentication (signup/login)  
✅ Product listing with search & filter  
✅ Shopping cart  
✅ Orders  
✅ Error handling  
✅ Environment variables  
✅ Serverless compatible  

---

## API Endpoints Summary

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/test` | ✗ | Test database connection |
| POST | `/api/auth/signup` | ✗ | Create new user |
| POST | `/api/auth/login` | ✗ | User login (returns token) |
| GET | `/api/products` | ✗ | Get all products |
| GET | `/api/products/:id` | ✗ | Get product details |
| GET | `/api/categories` | ✗ | Get all categories |
| GET | `/api/cart` | ✓ | Get user's cart |
| POST | `/api/cart/add` | ✓ | Add item to cart |
| PUT | `/api/cart/:id` | ✓ | Update cart item quantity |
| DELETE | `/api/cart/:id` | ✓ | Remove item from cart |
| POST | `/api/orders` | ✓ | Place new order |
| GET | `/api/orders` | ✓ | Get user's orders |
| GET | `/api/orders/:id` | ✓ | Get order details |

---

## Frontend Setup

Update `frontend/src/services/api.js` to use your deployed backend URL:

```javascript
const API_BASE_URL = 'https://your-deployed-url.onrender.com/api';
// or for Vercel
// const API_BASE_URL = 'https://your-vercel-url.vercel.app/api';

export const apiCall = (endpoint, options) => {
  return fetch(`${API_BASE_URL}${endpoint}`, options);
};
```

---

## Success Criteria

After deployment, you should be able to:
- ✅ Create new users via signup
- ✅ Login existing users
- ✅ Get product list
- ✅ Add items to cart
- ✅ Place orders
- ✅ View order history

If all these work, deployment is successful! 🎉

