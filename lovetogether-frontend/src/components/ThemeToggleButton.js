import React from 'react';
import styled, { keyframes } from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const ButtonContainer = styled.button`
  width: 40px;
  height: 40px;
  background-color: var(--buttonBackground);
  border: none;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0;
  position: relative;
  overflow: hidden;

  &:hover {
    background-color: var(--buttonBackgroundHover);
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const IconWrapper = styled.div`
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  
  &.rotating {
    animation: ${rotate} 0.5s ease-out;
  }
`;

// Icône Soleil
const SunIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="4" stroke="var(--text)" strokeWidth="2"/>
    <path d="M12 2V4" stroke="var(--text)" strokeWidth="2" strokeLinecap="round"/>
    <path d="M12 20V22" stroke="var(--text)" strokeWidth="2" strokeLinecap="round"/>
    <path d="M4 12H2" stroke="var(--text)" strokeWidth="2" strokeLinecap="round"/>
    <path d="M22 12H20" stroke="var(--text)" strokeWidth="2" strokeLinecap="round"/>
    <path d="M19.778 4.222L18.364 5.636" stroke="var(--text)" strokeWidth="2" strokeLinecap="round"/>
    <path d="M5.636 18.364L4.222 19.778" stroke="var(--text)" strokeWidth="2" strokeLinecap="round"/>
    <path d="M19.778 19.778L18.364 18.364" stroke="var(--text)" strokeWidth="2" strokeLinecap="round"/>
    <path d="M5.636 5.636L4.222 4.222" stroke="var(--text)" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

// Icône Lune
const MoonIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" 
      stroke="var(--text)" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

const ThemeToggleButton = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [isAnimating, setIsAnimating] = React.useState(false);

  const handleClick = () => {
    setIsAnimating(true);
    toggleTheme();
    setTimeout(() => setIsAnimating(false), 500);
  };

  return (
    <ButtonContainer 
      onClick={handleClick}
      aria-label={isDarkMode ? 'Activer le mode clair' : 'Activer le mode sombre'}
    >
      <IconWrapper className={isAnimating ? 'rotating' : ''}>
        {isDarkMode ? <SunIcon /> : <MoonIcon />}
      </IconWrapper>
    </ButtonContainer>
  );
};

export default ThemeToggleButton;
