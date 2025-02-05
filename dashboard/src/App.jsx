import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Dashboard from './Dashboard';

function App() {
  const [user, setUser] = useState(null);

  // On mount, check if the user is authenticated via the API endpoint.
  useEffect(() => {
    axios
      .get('/api/user', { withCredentials: true })
      .then((res) => setUser(res.data))
      .catch((err) => {
        console.error(err);
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
      <div style={{ padding: '2rem' }}>
        <header>
          <h1>Admin Dashboard</h1>
          <p>Welcome, {user.username}!</p>
          <a href="/auth/logout">Logout</a>
        </header>
        <Routes>
          <Route path="/*" element={<Dashboard user={user} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;