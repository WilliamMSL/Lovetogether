import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import HeaderButton from './HeaderButton';
import { ReactComponent as UserIcon } from '../images/assets/icons/user.svg';
import { ReactComponent as SlidersIcon } from '../images/assets/icons/sliders.svg';
import { useSettingsModal } from '../contexts/SettingsModalContext';
import { useUsersModal } from '../contexts/UsersModalContext';
import LoveTogetherLogo from '../images/LoveTogether_logo.svg';

const HeaderContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 32px 50px;
  z-index: 1000;
  pointer-events: none;
  
  @media (max-width: 768px) {
    padding-left: 30px;
    padding-right: 30px;
  }
`;

const LogoContainer = styled.div`
  pointer-events: auto;
  height: 46px;
  display: flex;
  align-items: center;
  
  img {
    height: 100%;
    width: auto;
  }
`;

const HeaderButtonsContainer = styled.div`
  display: flex;
  gap: 10px;
  pointer-events: auto;
`;

const PageHeader = () => {
  const { openModal } = useSettingsModal();
  const { openUsersModal } = useUsersModal();
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <HeaderContainer>
      <LogoContainer onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
        <img src={LoveTogetherLogo} alt="LoveTogether" />
      </LogoContainer>
      <HeaderButtonsContainer>
        <HeaderButton 
          icon={<UserIcon />} 
          onClick={openUsersModal} 
          aria-label="Joueurs"
        />
        <HeaderButton 
          icon={<SlidersIcon />} 
          onClick={openModal} 
          aria-label="Paramètres"
        />
      </HeaderButtonsContainer>
    </HeaderContainer>
  );
};

export default PageHeader;

