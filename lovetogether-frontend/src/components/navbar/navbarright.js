import React, { useState, useContext, useEffect } from 'react';
import Modal from '../Modal';
import { useCard } from '../CardContext';
import { UserContext } from '../UserContext';
import { ReactComponent as XIcon } from '../../images/assets/icons/x-square.svg';
import { ReactComponent as SlidersIcon } from '../../images/assets/icons/sliders.svg';
import { ReactComponent as MenuIcon } from '../../images/assets/icons/menu.svg';
import { ReactComponent as KeyIcon } from '../../images/assets/icons/key.svg';
import { ReactComponent as HomeIcon } from '../../images/assets/icons/home.svg';
import { ReactComponent as CompassIcon } from '../../images/assets/icons/compass.svg';
import { ReactComponent as AwardIcon } from '../../images/assets/icons/award.svg';
import NavButton from './navbarbutton';

const NavbarRight = ({ onResetAnimation }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 650);
  const { selectedCard, resetCards, selectCard, hideAllCards } = useCard();
  const { firstName1, firstName2, updateUserPreferences } = useContext(UserContext);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 650);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);
  const toggleMenu = () => setMenuOpen(!isMenuOpen);

  const handleSave = (data) => {
    updateUserPreferences(data);
    closeModal();
  };

  const handleReturn = () => {
    resetCards();
    if (onResetAnimation) {
      onResetAnimation();
    }
    setMenuOpen(false);
  };

  const handleActionClick = () => {
    if (!firstName1 || !firstName2) {
      setModalOpen(true);
    } else {
      selectCard('ActionVerite');
    }
    setMenuOpen(false);
  };

  const handleHomeClick = () => {
    hideAllCards();
    setMenuOpen(false);
  };

  if (isMobile) {
    return (
      <>
        <div style={{ position: 'absolute', right: '48px', top: '48px' }}>
          <NavButton icon={<MenuIcon />} onClick={toggleMenu} />
        </div>
        {isMenuOpen && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            padding: '48px',
          }}>
            <div style={{ alignSelf: 'flex-end' }}>
              <NavButton icon={<XIcon />} onClick={toggleMenu} />
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '20px' }}>
              <NavButton icon={<HomeIcon />} label="Accueil" onClick={handleHomeClick} />
              <NavButton icon={<KeyIcon />} label="Actions ou vérité" onClick={handleActionClick} />
              <NavButton icon={<CompassIcon />} label="Positions" onClick={() => { selectCard('Generator'); setMenuOpen(false); }} />
              <NavButton icon={<AwardIcon />} label="Roleplay" onClick={() => { selectCard('Roleplay'); setMenuOpen(false); }} />
              <NavButton icon={<SlidersIcon />} label="Paramètres" onClick={openModal} />
            </div>
          </div>
        )}
        <Modal isOpen={isModalOpen} onClose={closeModal} onSave={handleSave} />
      </>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'row', position: 'absolute', right: '48px', top: '48px', gap: '10px' }}>
      <NavButton icon={<SlidersIcon />} label="Paramètres" onClick={openModal} />
      {selectedCard && (
        <NavButton icon={<XIcon />} onClick={handleReturn} />
      )}
      <Modal isOpen={isModalOpen} onClose={closeModal} onSave={handleSave} />
    </div>
  );
};

export default NavbarRight;