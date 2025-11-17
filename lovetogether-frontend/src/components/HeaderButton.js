import React from 'react';
import styled from 'styled-components';

const ButtonContainer = styled.button`
  width: 40px;
  height: 40px;
  background-color: #F3F3F3;
  border: none;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 0;

  &:hover {
    background-color: #E8E8E8;
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
  color: #111111;

  svg {
    width: 20px;
    height: 20px;
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

