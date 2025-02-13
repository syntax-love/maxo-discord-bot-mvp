import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { theme } from './theme';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import TransactionsSearch from './pages/TransactionsSearch';
import Layout from './components/Layout';
import AuthCallback from './pages/AuthCallback';
import { DiscordDataProvider } from './providers/DiscordDataProvider';
import { AuthProvider } from './providers/AuthProvider';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <Router>
        <AuthProvider>
          <DiscordDataProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/" element={<Layout />}>
                <Route index element={<Navigate to="/dashboard" />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="admin" element={<AdminDashboard />} />
                <Route path="transactions" element={<TransactionsSearch />} />
                <Route path="*" element={<Navigate to="/dashboard" />} />
              </Route>
            </Routes>
          </DiscordDataProvider>
        </AuthProvider>
      </Router>
    </ChakraProvider>
  );
}

export default App;
