import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Analytics() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/analytics', { withCredentials: true })
      .then(res => {
        setMetrics(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching analytics:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Loading analytics...</p>;
  }

  if (!metrics) {
    return <p>Error loading analytics.</p>;
  }

  return (
    <div>
      <h2>Analytics Dashboard</h2>
      <div>
        <strong>Total Revenue:</strong> ${metrics.totalRevenue}
      </div>
      <div>
        <strong>Active Subscriptions:</strong> {metrics.activeSubscriptions}
      </div>
      <div>
        <strong>Transactions This Month:</strong> {metrics.transactionsThisMonth}
      </div>
      <div>
        <strong>New Users This Week:</strong> {metrics.newUsersThisWeek}
      </div>
      {/* TODO: Add charts or graphical widgets later */}
    </div>
  );
}