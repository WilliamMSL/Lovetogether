import React from 'react';
import styled from 'styled-components';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: #fff;
  border-radius: 20px;
  padding: 48px;
  width: 80%;
  max-width: 800px;
  position: relative;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
`;

const ModalButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background-color: black;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 12px;
  color: white;
  font-family: 'Poppins', sans-serif;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
  width: fit-content;

  &:hover {
    background-color: #fff5f5;
    color: #ff4500;
    border-color: #ff4500;
    box-shadow: 0 6px 12px rgba(255, 69, 0, 0.3);
  }
`;

const ButtonContainer = styled.div`
  margin-top: 16px;
  gap:8px;
  display: flex;
  justify-content: flex-end; 
`;

const CloseButton = styled.button`
  position: absolute;
  top: 40px;
  right: 40px;
  background: none;
  border: none;
  font-size: 40px;
  cursor: pointer;
  color: #000;
`;

const SectionTitle = styled.h2`
  font-size: 46px;
  font-weight: bold;
  color: #000;
  margin-bottom: 32px;
  margin-right: 64px;
  line-height: 50px;
`;

const AVModal = ({ onAccept, onDecline }) => {
  return (
    <ModalOverlay>
      <ModalContent>
        <CloseButton onClick={onDecline}>&times;</CloseButton>
        <SectionTitle>Passer à The Main Event ? 🔞 </SectionTitle>
        <p>
          Vous avez cliqué 10 fois au total sur une carte Action en Foreplay.
         <br></br> Voulez-vous passer à The Main Event ?
        </p>
        <ButtonContainer>
        <ModalButton onClick={onDecline}>Non</ModalButton>
          <ModalButton onClick={onAccept}>Oui, je veux.</ModalButton>

        </ButtonContainer>
      </ModalContent>
    </ModalOverlay>
  );
};

export default AVModal;
