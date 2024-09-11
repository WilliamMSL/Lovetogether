import React, { useState } from 'react';
import NavbarLeft from './navbarlist';
import NavbarRight from './navbarright';
import Modal from '../Modal'; // Importation de votre composant Modal

const Navbar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    console.log('openModal called');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    console.log('closeModal called');
    setIsModalOpen(false);
  };

  return (
    <div style={{ position: 'relative', zIndex: 1000000 }}>
      <NavbarLeft />
      <NavbarRight openModal={openModal} />

      {/* Votre modal est ici */}
      {isModalOpen && (
        <Modal onClose={closeModal}>
          <div>Contenu du Modal</div>
          <button onClick={closeModal}>Fermer</button>
        </Modal>
      )}
    </div>
  );
};

export default Navbar;
