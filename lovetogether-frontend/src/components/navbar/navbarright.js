import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSettingsModal } from '../../contexts/SettingsModalContext';
import { UserContext } from '../UserContext';
import { ReactComponent as XIcon } from '../../images/assets/icons/x-square.svg';
import { ReactComponent as SlidersIcon } from '../../images/assets/icons/sliders.svg';
import { ReactComponent as MenuIcon } from '../../images/assets/icons/menu.svg';
import { ReactComponent as KeyIcon } from '../../images/assets/icons/key.svg';
import { ReactComponent as HomeIcon } from '../../images/assets/icons/home.svg';
import { ReactComponent as CompassIcon } from '../../images/assets/icons/compass.svg';
import { ReactComponent as AwardIcon } from '../../images/assets/icons/award.svg';
import { ReactComponent as RouletteIcon } from '../../images/assets/icons/roulette.svg';
import NavButton from './navbarbutton';

const NavbarRight = ({ onResetAnimation }) => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 650);
  const location = useLocation();
  const { firstName1, firstName2 } = useContext(UserContext);
  const { openModal } = useSettingsModal();
  const navigate = useNavigate();
  
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 650);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleMenu = () => setMenuOpen(!isMenuOpen);

  const handleReturn = () => {
    navigate('/');
    if (onResetAnimation) {
      onResetAnimation();
    }
    setMenuOpen(false);
  };

  const handleActionClick = () => {
    if (!firstName1 || !firstName2) {
      openModal();
    } else {
      navigate('/action-verite');
    }
    setMenuOpen(false);
  };

  const handleHomeClick = () => {
    navigate('/');
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
              <NavButton icon={<CompassIcon />} label="Positions" onClick={() => { navigate('/generator'); setMenuOpen(false); }} />
              <NavButton icon={<AwardIcon />} label="Roleplay" onClick={() => { navigate('/roleplay'); setMenuOpen(false); }} />
              <NavButton icon={<RouletteIcon />} label="Roulette" onClick={() => { navigate('/roulette'); setMenuOpen(false); }} />
              <NavButton icon={<SlidersIcon />} label="Paramètres" onClick={openModal} />
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'row', position: 'absolute', right: '48px', top: '48px', gap: '10px' }}>
      <NavButton icon={<SlidersIcon />} label="Paramètres" onClick={openModal} />
      {!isHomePage && (
        <NavButton icon={<XIcon />} onClick={handleReturn} />
      )}
    </div>
  );
};

export default NavbarRight;