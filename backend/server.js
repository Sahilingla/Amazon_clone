// Server Entry Point
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const routes = require('./routes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', routes);

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;
const IS_SERVERLESS = process.env.VERCEL || process.env.RENDER;

const startServer = async () => {
  try {
    await connectDB();
    console.log('Database connected successfully');
    
    if (!IS_SERVERLESS) {
      app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
      });
    }
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Only start server in non-serverless environment
if (!IS_SERVERLESS) {
  startServer();
}

// Export for serverless platforms (Vercel, Render Functions)
module.exports = app;
