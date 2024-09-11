import React, { useState } from 'react';
import Modal from './Modal';

const ParentComponent = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: ''
  });

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSave = (selectedToys, selectedPlace) => {
    // Logique pour sauvegarder les jouets et le lieu sélectionnés
    handleCloseModal();
  };

  return (
    <div>
      <button onClick={handleOpenModal}>Open Modal</button>
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSave}
          formData={formData}
          setFormData={setFormData}
          // Autres props comme selectedToys, selectedPlace, etc.
        />
      )}
    </div>
  );
};

export default ParentComponent;