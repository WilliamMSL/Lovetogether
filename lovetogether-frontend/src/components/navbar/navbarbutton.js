import React from 'react';
import styled from 'styled-components';

// Déclarez le bouton stylisé
const StyledButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  width: fit-content;
  background-color: white;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 12px;
  color: #000;
  font-family: 'Poppins', sans-serif;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    background-color: #fff5f5;
    color: #ff4500;
    border-color: #ff4500;
    box-shadow: 0 6px 12px rgba(255, 69, 0, 0.3);
  }
`;

const Icon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  color: white;
  transition: background-color 0.3s ease, color 0.3s ease;

  ${StyledButton}:hover & {
    color: #fff;
  }
`;

// Déclarez le composant NavButton
const NavButton = ({ icon, label, onClick }) => {
  return (
    <StyledButton onClick={onClick}>
      {icon && <Icon>{icon}</Icon>}
      {label}
    </StyledButton>
  );
};

export default NavButton;
