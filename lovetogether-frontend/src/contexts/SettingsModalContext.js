import React, { createContext, useState, useContext } from 'react';
import logger from '../utils/logger';

const SettingsModalContext = createContext();

export const SettingsModalProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    logger.log('SettingsModal: Opening modal');
    setIsOpen(true);
  };

  const closeModal = () => {
    logger.log('SettingsModal: Closing modal');
    setIsOpen(false);
  };

  const toggleModal = () => {
    setIsOpen(prev => {
      const newState = !prev;
      logger.log(`SettingsModal: Toggling modal to ${newState}`);
      return newState;
    });
  };

  return (
    <SettingsModalContext.Provider
      value={{
        isOpen,
        openModal,
        closeModal,
        toggleModal,
      }}
    >
      {children}
    </SettingsModalContext.Provider>
  );
};

export const useSettingsModal = () => {
  const context = useContext(SettingsModalContext);
  if (!context) {
    throw new Error('useSettingsModal must be used within a SettingsModalProvider');
  }
  return context;
};

export default SettingsModalContext;

