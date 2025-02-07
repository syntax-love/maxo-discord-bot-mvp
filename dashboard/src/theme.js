import { extendTheme } from '@chakra-ui/react';

const config = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

const colors = {
  brand: {
    50: '#f0e4ff',
    100: '#cbb2ff',
    200: '#a480ff',
    300: '#7c4dff',
    400: '#541aff',
    500: '#3b00e6',
    600: '#2d00b4',
    700: '#1f0082',
    800: '#110050',
    900: '#06001f',
  },
};

const theme = extendTheme({ 
  config,
  colors,
  styles: {
    global: (props) => ({
      body: {
        bg: props.colorMode === 'dark' ? 'gray.800' : 'white',
      },
    }),
  },
  components: {
    Card: {
      baseStyle: (props) => ({
        container: {
          bg: props.colorMode === 'dark' ? 'gray.700' : 'white',
        },
      }),
    },
  },
});

export { theme };