import React from 'react';
import ReactDOM from 'react-dom/client';
import '../src/styles/globals.css';
import App from './App';
// import { AuthProvider } from './context/AuthContext';  // Correct import for AuthProvider
// import { AuthProvider } from './context/AuthProvider';
import ErrorBoundary from './components/ErrorBoundary';
import { ChakraProvider } from '@chakra-ui/react';  // Make sure you're using ChakraProvider
import { Provider } from 'react-redux'; // Import Provider
import store from './redux/store';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme/theme';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ThemeProvider theme={theme}>
    <React.StrictMode>
      <ErrorBoundary>
        <Provider store={store}>
          <ChakraProvider>
            {/* <AuthProvider> */}
            <App />
            {/* </AuthProvider> */}
          </ChakraProvider>
        </Provider>
      </ErrorBoundary>
    </React.StrictMode>
  </ThemeProvider>
);
