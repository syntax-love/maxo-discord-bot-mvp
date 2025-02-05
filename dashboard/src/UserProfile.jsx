import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function UserProfile() {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/user/details', { withCredentials: true })
      .then(res => {
        setUserDetails(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching user details:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Loading profile...</p>;
  }

  if (!userDetails) {
    return <p>Error loading profile. Please try again.</p>;
  }

  return (
    <div>
      <h2>{userDetails.username}'s Profile</h2>
      {/* Display user avatar if available */}
      {userDetails.avatar && (
        <img 
          src={userDetails.avatar} 
          alt={`${userDetails.username}'s avatar`} 
          style={{ width: '100px', borderRadius: '50%' }} 
        />
      )}
      <h3>Subscription: {userDetails.subscription.tier}</h3>
      <p>Next Billing Date: {new Date(userDetails.subscription.nextBillingDate).toLocaleDateString()}</p>
      <ul>
        {userDetails.subscription.features.map((feature, index) => (
          <li key={index}>{feature}</li>
        ))}
      </ul>
    </div>
  );
}