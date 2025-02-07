import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    // Auto-redirect to dashboard
    navigate('/dashboard');
  }, [navigate]);

  return null;
}