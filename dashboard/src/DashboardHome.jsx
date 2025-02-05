import React from 'react';

export default function DashboardHome({ user }) {
  return (
    <div>
      <h2>Welcome, {user.username}!</h2>
      <p>This is your Dashboard home page. Use the navigation above to view transactions or manage other features as they are added.</p>
      {/* Future enhancements: Add analytics, latest updates, alerts, etc. */}
    </div>
  );
}