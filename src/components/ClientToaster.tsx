'use client';

import { Toaster } from 'react-hot-toast';
import React from 'react';

const ClientToaster = () => {
  return (
    <Toaster
      position="top-center"
      reverseOrder={false}
      gutter={8}
      containerClassName=""
      toastOptions={{
        className: '',
        duration: 3000,
        style: {
          background: '#363636',
          color: '#fff',
        },
        success: {
          duration: 3000,
          style: {
            background: 'black',   // previously 'theme.primary'
            color: 'white',        // previously 'theme.secondary'
          },
        },
        error: {
          duration: 4000,
          style: {
            background: '#ff4d4d',
            color: 'white',
          },
        },
        loading: {
          duration: 2000,
        },
      }}
    />
  );
};

export default ClientToaster;
