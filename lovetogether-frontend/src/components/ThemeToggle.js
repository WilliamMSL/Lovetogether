import React from 'react';
import styled, { keyframes } from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';

const sunRise = keyframes`
  0% {
    transform: translateY(10px) rotate(-45deg);
    opacity: 0;
  }
  100% {
    transform: translateY(0) rotate(0deg);
    opacity: 1;
  }
`;

const moonRise = keyframes`
  0% {
    transform: translateY(-10px) rotate(45deg);
    opacity: 0;
  }
  100% {
    transform: translateY(0) rotate(0deg);
    opacity: 1;
  }
`;

const starTwinkle = keyframes`
  0%, 100% {
    opacity: 0.3;
    transform: scale(0.8);
  }
  50% {
    opacity: 1;
    transform: scale(1);
  }
`;

const ToggleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ToggleLabel = styled.span`
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: ${props => props.theme.text};
  transition: color 0.3s ease;
`;

const ToggleContainer = styled.button`
  position: relative;
  width: 64px;
  height: 34px;
  background: ${props => props.$isDark 
    ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' 
    : 'linear-gradient(135deg, #87CEEB 0%, #98D8F5 50%, #B8E4F9 100%)'};
  border: none;
  border-radius: 34px;
  cursor: pointer;
  padding: 0;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: ${props => props.$isDark 
    ? 'inset 0 2px 8px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(0, 0, 0, 0.3)' 
    : 'inset 0 2px 8px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(135, 206, 235, 0.3)'};

  &:hover {
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.98);
  }

  &:focus {
    outline: none;
    box-shadow: ${props => props.$isDark 
      ? '0 0 0 3px rgba(255, 107, 157, 0.3)' 
      : '0 0 0 3px rgba(135, 206, 235, 0.5)'};
  }
`;

const ToggleThumb = styled.div`
  position: absolute;
  top: 3px;
  left: ${props => props.$isDark ? 'calc(100% - 31px)' : '3px'};
  width: 28px;
  height: 28px;
  background: ${props => props.$isDark 
    ? 'linear-gradient(135deg, #f5f3ce 0%, #ffd700 100%)' 
    : 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)'};
  border-radius: 50%;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: ${props => props.$isDark 
    ? '0 0 15px rgba(255, 215, 0, 0.4), inset -3px -3px 6px rgba(0, 0, 0, 0.1)' 
    : '0 0 20px rgba(255, 165, 0, 0.5), inset -3px -3px 6px rgba(0, 0, 0, 0.1)'};
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

const SunIcon = styled.div`
  width: 16px;
  height: 16px;
  position: relative;
  animation: ${props => props.$isVisible ? sunRise : 'none'} 0.4s ease-out;
  opacity: ${props => props.$isVisible ? 1 : 0};
  transition: opacity 0.2s ease;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 8px;
    height: 8px;
    background: #FF6B35;
    border-radius: 50%;
  }

  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 16px;
    height: 16px;
    background: transparent;
    border: 2px solid #FF6B35;
    border-radius: 50%;
    opacity: 0.5;
  }
`;

const MoonIcon = styled.div`
  width: 14px;
  height: 14px;
  position: relative;
  animation: ${props => props.$isVisible ? moonRise : 'none'} 0.4s ease-out;
  opacity: ${props => props.$isVisible ? 1 : 0};
  transition: opacity 0.2s ease;

  &::before {
    content: '';
    position: absolute;
    width: 14px;
    height: 14px;
    background: #E8E3D3;
    border-radius: 50%;
    box-shadow: inset -3px -2px 4px rgba(0, 0, 0, 0.2);
  }

  &::after {
    content: '';
    position: absolute;
    top: -2px;
    right: -2px;
    width: 10px;
    height: 10px;
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    border-radius: 50%;
  }
`;

const Stars = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  opacity: ${props => props.$isDark ? 1 : 0};
  transition: opacity 0.4s ease;
`;

const Star = styled.div`
  position: absolute;
  width: ${props => props.$size || '2px'};
  height: ${props => props.$size || '2px'};
  background: #fff;
  border-radius: 50%;
  animation: ${starTwinkle} ${props => props.$duration || '2s'} ease-in-out infinite;
  animation-delay: ${props => props.$delay || '0s'};
`;

const Clouds = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  opacity: ${props => props.$isDark ? 0 : 1};
  transition: opacity 0.4s ease;
`;

const Cloud = styled.div`
  position: absolute;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 20px;
  
  &::before, &::after {
    content: '';
    position: absolute;
    background: rgba(255, 255, 255, 0.8);
    border-radius: 50%;
  }
`;

const Cloud1 = styled(Cloud)`
  width: 12px;
  height: 5px;
  top: 8px;
  left: 8px;
  
  &::before {
    width: 6px;
    height: 6px;
    top: -3px;
    left: 2px;
  }
  
  &::after {
    width: 5px;
    height: 5px;
    top: -2px;
    left: 6px;
  }
`;

const Cloud2 = styled(Cloud)`
  width: 10px;
  height: 4px;
  top: 20px;
  left: 12px;
  
  &::before {
    width: 5px;
    height: 5px;
    top: -2px;
    left: 1px;
  }
  
  &::after {
    width: 4px;
    height: 4px;
    top: -1px;
    left: 5px;
  }
`;

const ThemeToggle = ({ showLabel = true }) => {
  const { isDarkMode, toggleTheme, theme } = useTheme();

  return (
    <ToggleWrapper>
      {showLabel && (
        <ToggleLabel theme={theme}>
          {isDarkMode ? '🌙 Sombre' : '☀️ Clair'}
        </ToggleLabel>
      )}
      <ToggleContainer
        $isDark={isDarkMode}
        onClick={toggleTheme}
        aria-label={isDarkMode ? 'Activer le mode clair' : 'Activer le mode sombre'}
        role="switch"
        aria-checked={isDarkMode}
      >
        <Stars $isDark={isDarkMode}>
          <Star $size="2px" $delay="0s" $duration="1.5s" style={{ top: '6px', left: '8px' }} />
          <Star $size="1px" $delay="0.3s" $duration="2s" style={{ top: '12px', left: '15px' }} />
          <Star $size="2px" $delay="0.6s" $duration="1.8s" style={{ top: '22px', left: '10px' }} />
          <Star $size="1px" $delay="0.9s" $duration="2.2s" style={{ top: '8px', left: '20px' }} />
          <Star $size="1px" $delay="1.2s" $duration="1.6s" style={{ top: '18px', left: '6px' }} />
        </Stars>
        
        <Clouds $isDark={isDarkMode}>
          <Cloud1 />
          <Cloud2 />
        </Clouds>
        
        <ToggleThumb $isDark={isDarkMode}>
          <IconContainer>
            {isDarkMode ? (
              <MoonIcon $isVisible={isDarkMode} />
            ) : (
              <SunIcon $isVisible={!isDarkMode} />
            )}
          </IconContainer>
        </ToggleThumb>
      </ToggleContainer>
    </ToggleWrapper>
  );
};

export default ThemeToggle;
