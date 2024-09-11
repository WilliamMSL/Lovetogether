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
  z-index: 100; /* Assurez-vous que le bouton est au-dessus des autres éléments */
  transition: transform 0.3s ease, background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: rotate(7deg) scale(1.05);
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
  
  transition: stroke 0.3s ease, fill 0.3s ease;

  svg {
    stroke: currentColor;
    fill: none;
    width: 100%;
    height: 100%;
  }

  ${StyledButton}:hover & svg {
    stroke: #ff4500; /* Changer la couleur du contour au survol */
    fill: none; /* S'assure que le remplissage reste transparent */
  }
`;

// Déclarez le composant PageButton
const PageButton = ({ icon, label, onClick }) => {
  return (
    <StyledButton onClick={onClick}>
      <Icon>{icon}</Icon>
      {label}
    </StyledButton>
  );
};

export default PageButton;