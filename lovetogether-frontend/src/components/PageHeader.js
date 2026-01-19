import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import HeaderButton from './HeaderButton';
import ThemeToggleButton from './ThemeToggleButton';
import { ReactComponent as UserIcon } from '../images/assets/icons/user.svg';
import { ReactComponent as SlidersIcon } from '../images/assets/icons/sliders.svg';
import { useSettingsModal } from '../contexts/SettingsModalContext';
import { useUsersModal } from '../contexts/UsersModalContext';
import { UserContext } from './UserContext';
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

const ButtonWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const Tooltip = styled.div`
  position: absolute;
  bottom: -45px;
  right: 0;
  transform: translateX(0);
  background-color: var(--tooltipBackground);
  color: var(--tooltipText);
  padding: 8px 12px;
  border-radius: 14px;
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  z-index: 1001;
  pointer-events: none;
  opacity: ${props => props.show ? 1 : 0};
  transition: opacity 0.2s ease;
  
  &:after {
    content: '';
    position: absolute;
    top: -4px;
    right: 20px;
    transform: translateX(0);
    width: 0;
    height: 0;
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-bottom: 4px solid var(--tooltipBackground);
  }
`;

const PageHeader = () => {
  const { openModal } = useSettingsModal();
  const { openUsersModal } = useUsersModal();
  const { selectedToys, players, firstName1, firstName2 } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/');
  };

  // Vérifier si des joueurs sont ajoutés
  const playersList = players && players.length > 0 ? players : [firstName1, firstName2].filter(Boolean);
  const hasNoPlayers = playersList.length === 0;
  const hasNoToys = !selectedToys || selectedToys.length === 0;

  return (
    <HeaderContainer>
      <LogoContainer onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
        <img src={LoveTogetherLogo} alt="LoveTogether" />
      </LogoContainer>
      <HeaderButtonsContainer>
        <ThemeToggleButton />
        <ButtonWrapper>
          <HeaderButton 
            icon={<UserIcon />} 
            onClick={openUsersModal} 
            aria-label="Joueurs"
          />
          <Tooltip show={hasNoPlayers}>
            Ajouter des joueurs
          </Tooltip>
        </ButtonWrapper>
        <ButtonWrapper>
          <HeaderButton 
            icon={<SlidersIcon />} 
            onClick={openModal} 
            aria-label="Paramètres"
          />
          <Tooltip show={!hasNoPlayers && hasNoToys}>
            Sélectionnez des jouets
          </Tooltip>
        </ButtonWrapper>
      </HeaderButtonsContainer>
    </HeaderContainer>
  );
};

export default PageHeader;

