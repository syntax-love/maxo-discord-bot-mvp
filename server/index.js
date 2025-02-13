const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load env variables first
dotenv.config({ path: path.resolve(__dirname, '.env') });

// Debug log the credentials (but not the secret)
console.log('Discord Client Config:', {
  clientId: process.env.DISCORD_CLIENT_ID,
  hasSecret: !!process.env.DISCORD_CLIENT_SECRET,
  redirectUri: `${process.env.FRONTEND_URL}/auth/callback`
});

const authRoutes = require('./routes/auth');

const app = express();
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

app.use('/api/auth', authRoutes);

// Serve static files from the React/Vite build directory
app.use(express.static(path.join(__dirname, '../dashboard/dist')));

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dashboard/dist', 'index.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));