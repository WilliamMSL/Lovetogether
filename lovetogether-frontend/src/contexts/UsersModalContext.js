import React, { createContext, useContext, useState } from 'react';

const UsersModalContext = createContext();

export const UsersModalProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openUsersModal = () => setIsOpen(true);
  const closeUsersModal = () => setIsOpen(false);

  return (
    <UsersModalContext.Provider value={{ isOpen, openUsersModal, closeUsersModal }}>
      {children}
    </UsersModalContext.Provider>
  );
};

export const useUsersModal = () => {
  const context = useContext(UsersModalContext);
  if (!context) {
    throw new Error('useUsersModal must be used within a UsersModalProvider');
  }
  return context;
};

