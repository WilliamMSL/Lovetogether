import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './navitem';
import { ReactComponent as KeyIcon } from '../../images/assets/icons/key.svg';
import { ReactComponent as HomeIcon } from '../../images/assets/icons/home.svg';
import { ReactComponent as CompassIcon } from '../../images/assets/icons/compass.svg';
import { ReactComponent as AwardIcon } from '../../images/assets/icons/award.svg';
import { ReactComponent as RouletteIcon } from '../../images/assets/icons/roulette.svg';
import { UserContext } from '../UserContext';
import { useSettingsModal } from '../../contexts/SettingsModalContext';

const NavbarLeft = () => {
  const { firstName1, firstName2 } = useContext(UserContext);
  const [isVisible, setIsVisible] = useState(window.innerWidth > 650);
  const { openModal } = useSettingsModal();
  const navigate = useNavigate();

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
      openModal();
    } else {
      navigate('/action-verite');
    }
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  // Render nothing if isVisible is false (i.e., width >= 500px)
  if (!isVisible) {
    return null;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', position: 'absolute', left: '48px', top: '48px', gap: '10px' }}>
      <Button icon={<HomeIcon />} label="Accueil" onClick={handleHomeClick} />
      <Button icon={<KeyIcon />} label="Truth & Dare" onClick={handleActionClick} />
      <Button icon={<CompassIcon />} label="Positions" onClick={() => navigate('/generator')} />
      <Button icon={<AwardIcon />} label="Rôle" onClick={() => navigate('/roleplay')} />
      <Button icon={<RouletteIcon />} label="Roulette" onClick={() => navigate('/roulette')} />
    </div>
  );
};

export default NavbarLeft;
