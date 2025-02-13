import React, { createContext, useContext, useState, useEffect } from 'react';

const DiscordDataContext = createContext();

export const DiscordDataProvider = ({ children }) => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLive, setIsLive] = useState(false); // Toggle between mock and live data

  // Mock data
  const mockRoles = [
    { tier: 'pearl', roleId: '1335686254993477663', memberCount: 50 },
    { tier: 'sapphire', roleId: '1335835802999197716', memberCount: 30 },
    { tier: 'diamond', roleId: '1335835830836789341', memberCount: 20 }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (isLive) {
          // In live mode, return empty data for now
          setRoles([]);
          setLoading(false);
          return;
        }
        // Use mock data
        setRoles(mockRoles);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchData();
  }, [isLive]);

  return (
    <DiscordDataContext.Provider value={{ 
      roles: roles || [], // Ensure we always return an array
      loading, 
      error,
      isLive,
      setIsLive // Allow toggling between mock/live data
    }}>
      {children}
    </DiscordDataContext.Provider>
  );
};

export const useDiscordData = () => useContext(DiscordDataContext); 