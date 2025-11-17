import React from 'react';
import { useSettingsModal } from '../contexts/SettingsModalContext';
import { useCard } from './CardContext';
import { UserContext } from './UserContext';
import Modal from './Modal';

const SettingsModal = () => {
  const { isOpen, closeModal } = useSettingsModal();
  const { selectCard } = useCard();
  const { updateUserPreferences } = React.useContext(UserContext);

  const handleSave = (data) => {
    updateUserPreferences(data);
    closeModal();
    // Optionnel : rediriger vers ActionVerite après sauvegarde
    // selectCard('ActionVerite');
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={closeModal} 
      onSave={handleSave} 
    />
  );
};

export default SettingsModal;

