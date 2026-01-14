import React from 'react';
import styled from 'styled-components';

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
  transition: all 0.2s ease;
  padding: 0;

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
  color: var(--text);

  svg {
    width: 20px;
    height: 20px;
    stroke: var(--text) !important;
    fill: none;
    
    path, line, circle, rect, polyline, polygon {
      stroke: var(--text) !important;
    }
  }
`;

const HeaderButton = ({ icon, onClick, 'aria-label': ariaLabel }) => {
  return (
    <ButtonContainer onClick={onClick} aria-label={ariaLabel}>
      <IconWrapper>{icon}</IconWrapper>
    </ButtonContainer>
  );
};

export default HeaderButton;

