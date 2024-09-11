import React, { useState, useContext } from 'react';
import Modal from '../Modal';
import { useCard } from '../CardContext';
import { UserContext } from '../UserContext';
import { ReactComponent as XIcon } from '../../images/assets/icons/x-square.svg';
import { ReactComponent as SlidersIcon } from '../../images/assets/icons/sliders.svg';
import NavButton from './navbarbutton';

const NavbarRight = ({ onResetAnimation }) => {  // Ajoutez une prop pour gérer l'animation
  const [isModalOpen, setModalOpen] = useState(false);
  const { selectedCard, resetCards } = useCard();
  const { updateUserPreferences } = useContext(UserContext);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const handleSave = (data) => {
    updateUserPreferences(data);
    closeModal();
  };

  const handleReturn = () => {
    resetCards();
    if (onResetAnimation) {  // Appelle la fonction passée en prop pour relancer l'animation
      onResetAnimation();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'row', position: 'absolute', right: '48px', top: '48px', gap: '10px' }}>
      <NavButton icon={<SlidersIcon />} label="Filtres" onClick={openModal} />
      {selectedCard && (
        <NavButton icon={<XIcon />} onClick={handleReturn} />
      )}
      <Modal isOpen={isModalOpen} onClose={closeModal} onSave={handleSave} />
    </div>
  );
};

export default NavbarRight;
