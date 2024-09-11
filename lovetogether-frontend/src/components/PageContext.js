import React, { createContext, useContext, useState, useEffect } from 'react';

const PageContext = createContext();

export const PageProvider = ({ children }) => {
  const [currentPage, setCurrentPage] = useState('home'); // Définissez l'état initial ici

  // Log lors du changement de page
  useEffect(() => {
    console.log(`Current Page set to: ${currentPage}`);
  }, [currentPage]);

  return (
    <PageContext.Provider value={{ currentPage, setCurrentPage }}>
      {children}
    </PageContext.Provider>
  );
};

export const usePage = () => {
  const context = useContext(PageContext);
  
  if (!context) {
    console.error('usePage must be used within a PageProvider');
  } else {
    console.log('usePage hook accessed');
  }

  return context;
};