import React from 'react';
import { Box, Text } from '@chakra-ui/react';

export const TestModeIndicator = ({ isTestMode }) => {
  if (!isTestMode) return null;
  
  return (
    <Box
      position="fixed"
      bottom={4}
      right={4}
      bg="yellow.500"
      color="black"
      px={3}
      py={1}
      borderRadius="md"
      opacity={0.8}
    >
      <Text fontWeight="bold">Test Mode</Text>
    </Box>
  );
}; 