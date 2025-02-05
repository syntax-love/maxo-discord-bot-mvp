import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function RedirectToDashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    // This gives the SPA a chance to mount, then redirect.
    navigate('/dashboard');
  }, [navigate]);

  return <p>Redirecting to dashboard...</p>;
}