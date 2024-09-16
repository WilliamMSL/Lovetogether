import React, { useContext, useState, useEffect } from 'react';
import Button from './navitem';
import { ReactComponent as KeyIcon } from '../../images/assets/icons/key.svg';
import { ReactComponent as HomeIcon } from '../../images/assets/icons/home.svg';
import { ReactComponent as CompassIcon } from '../../images/assets/icons/compass.svg';
import { ReactComponent as AwardIcon } from '../../images/assets/icons/award.svg';
import { useCard } from '../CardContext';
import { UserContext } from '../UserContext'; // Importation du contexte utilisateur
import Modal from '../Modal'; // Importation du composant modal

const NavbarLeft = () => {
  const { selectCard, hideAllCards } = useCard(); // Utilisation du contexte des cartes et ajout de la fonction hideAllCards
  const { firstName1, firstName2, updateUserPreferences } = useContext(UserContext); // Accès aux données utilisateur
  const [isModalOpen, setModalOpen] = useState(false); // État local pour contrôler la visibilité du modal
  const [isVisible, setIsVisible] = useState(window.innerWidth > 650); // État pour contrôler la visibilité en fonction de la largeur de la fenêtre

  // Effect to handle window resize and update visibility
  useEffect(() => {
    const handleResize = () => {
      setIsVisible(window.innerWidth > 650);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup listener on component unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleActionClick = () => {
    if (!firstName1 || !firstName2) {
      setModalOpen(true); // Ouvre le modal si les noms ne sont pas définis
    } else {
      selectCard('ActionVerite'); // Sélectionne la carte 'ActionVerite' si les noms sont définis
    }
  };

  const handleHomeClick = () => {
    hideAllCards(); // Cache toutes les cartes
  };

  const closeModal = () => {
    setModalOpen(false); // Ferme le modal
  };

  const handleSave = (data) => {
    console.log('Saving data from modal:', data);
    updateUserPreferences(data); // Mise à jour des préférences utilisateur
    closeModal(); // Ferme le modal après enregistrement
    selectCard('ActionVerite'); // Sélection automatique de la carte 'ActionVerite'
  };

  // Render nothing if isVisible is false (i.e., width >= 500px)
  if (!isVisible) {
    return null;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', position: 'absolute', left: '48px', top: '48px', gap: '10px' }}>
      <Button icon={<HomeIcon />} label="Accueil" onClick={handleHomeClick} /> {/* Utilisation de handleHomeClick pour cacher toutes les cartes */}
      <Button icon={<KeyIcon />} label="Truth & Dare" onClick={handleActionClick} />
      <Button icon={<CompassIcon />} label="Positions" onClick={() => selectCard('Generator')} /> {/* Sélectionne 'Generator' */}
      <Button icon={<AwardIcon />} label="Rôle" onClick={() => selectCard('Roleplay')} /> {/* Sélectionne 'Roleplay' */}
      
      {/* Composant Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal} onSave={handleSave} />
    </div>
  );
};

export default NavbarLeft;
