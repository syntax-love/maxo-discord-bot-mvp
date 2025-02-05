import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';
import DashboardHome from './DashboardHome';
import Transactions from './Transactions';
import UserProfile from './UserProfile';
import Settings from './Settings';
import Analytics from './Analytics';
import Support from './Support';

function App() {
  const [user, setUser] = useState(null);

  // Fetch user data when the component mounts
  useEffect(() => {
    axios.get('/api/user', { 
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .then(res => setUser(res.data))
      .catch(err => {
        console.error('Error fetching user:', err);
        setUser(null);
      });
  }, []);

  
  if (!user) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>You are not logged in</h2>
        <a href="/auth/discord" style={{ padding: '1rem', background: '#7289DA', color: 'white', borderRadius: '5px', textDecoration: 'none' }}>
          Login with Discord
        </a>
      </div>
    );
  }

  return (
    <Router>
      <header style={{ padding: '1rem', borderBottom: '1px solid #ccc' }}>
        <h1>Admin Dashboard</h1>
        <nav>
          <Link to="/">Home</Link> |{' '}
          <Link to="/profile">Profile</Link>
          | <Link to="/transactions">Transactions</Link> |{' '}
          <Link to="/settings">Bot Settings</Link> |{' '}
          <Link to="/analytics">Analytics</Link>
          | <Link to="/support">Support</Link>
          | <a href="/auth/logout">Logout</a>
        </nav>
      </header>
      <main style={{ padding: '1rem' }}>
        <Routes>
          <Route path="/" element={<DashboardHome user={user} />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/support" element={<Support />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;