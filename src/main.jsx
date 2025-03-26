import './shim';
import React from "react";
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@ant-design/v5-patch-for-react-19';
import './index.css';




const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter future={{ v7_startTransition: true }}>
            <QueryClientProvider client={queryClient}>
                <App />
            </QueryClientProvider>
        </BrowserRouter>
    </StrictMode>,
);
