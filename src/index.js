import React from 'react';
import ReactDOM from 'react-dom/client';
import '../src/styles/globals.css';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';
import { ChakraProvider } from '@chakra-ui/react'; 
import { Provider } from 'react-redux'; 
import store from './redux/store';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <Provider store={store}>
          <ChakraProvider>
            <App />
          </ChakraProvider>
        </Provider>
      </ErrorBoundary>
    </React.StrictMode>
);
