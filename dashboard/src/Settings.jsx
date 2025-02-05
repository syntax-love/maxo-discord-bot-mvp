import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Settings() {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/config', { withCredentials: true })
      .then(res => {
        setConfig(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching config:', err);
        setLoading(false);
      });
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    // For now, simply log config. Later, hook this up to a POST endpoint.
    console.log('New settings:', config);
    alert('Settings saved (dummy action)');
  };

  if (loading) {
    return <p>Loading settings...</p>;
  }

  return (
    <div>
      <h2>Bot Settings & Configuration</h2>
      {config ? (
        <form onSubmit={handleSave}>
          <div>
            <label>Command Prefix: </label>
            <input 
              type="text" 
              value={config.commandPrefix} 
              onChange={e => setConfig({ ...config, commandPrefix: e.target.value })}
            />
          </div>
          <div>
            <label>Auto Role Assign: </label>
            <input 
              type="checkbox" 
              checked={config.autoRoleAssign} 
              onChange={e => setConfig({ ...config, autoRoleAssign: e.target.checked })}
            />
          </div>
          <div>
            <label>Notification Channel ID: </label>
            <input 
              type="text" 
              value={config.notificationChannelID} 
              onChange={e => setConfig({ ...config, notificationChannelID: e.target.value })}
            />
          </div>
          <button type="submit">Save Settings</button>
        </form>
      ) : (
        <p>Error loading settings.</p>
      )}
    </div>
  );
}