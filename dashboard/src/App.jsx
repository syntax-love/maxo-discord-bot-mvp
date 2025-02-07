import { ChakraProvider, ColorModeScript, Center, Spinner, VStack, Text } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { theme } from './theme';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;