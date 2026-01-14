import React, { useState, useEffect, useContext, useRef } from 'react';
import styled from 'styled-components';
import { UserContext } from './UserContext';
import { useUsersModal } from '../contexts/UsersModalContext';
import { ReactComponent as XIcon } from '../images/assets/icons/x-square.svg';
import { ReactComponent as TrashIcon } from '../images/assets/icons/trash.svg';
import useButtonSound from '../hooks/useButtonSound';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--modalOverlay);
  display: ${props => props.isOpen ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 10000000000000000000000;
  backdrop-filter: blur(4px);
`;

const ModalContent = styled.div`
  background: var(--modalBackground);
  border-radius: 20px;
  padding: 24px;
  width: 90%;
  max-width: 600px;
  position: relative;
  box-shadow: var(--shadow);
  max-height: 80vh;
  overflow-y: auto;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  border: 1px solid var(--cardBorder);
  
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }

  @media (max-width: 768px) {
    padding: 24px;
    max-height: 90vh;
  }
`;

const TitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const Title = styled.h2`
  font-size: 26px;
  font-weight: 500;
  color: var(--text);
  margin: 0;
  font-family: 'Poppins', sans-serif;

  @media (max-width: 768px) {
    font-size: 22px;
  }
`;

const CloseButton = styled.button`
  width: 40px;
  height: 40px;
  background-color: var(--buttonBackground);
  border: none;
  border-radius: 14px;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  
  svg {
    width: 20px;
    height: 20px;
    color: var(--text);
    stroke: var(--text) !important;
    
    path, line, circle, rect, polyline, polygon {
      stroke: var(--text) !important;
    }
  }
  
  &:hover {
    background-color: var(--buttonBackgroundHover);
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const SubTitle = styled.p`
  font-size: 14px;
  color: var(--textSecondary);
  margin-bottom: 24px;
  font-family: 'Poppins', sans-serif;
`;

const UsersList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
`;

const UserItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
`;

const UserInput = styled.input`
  flex: 1;
  padding: 0 16px;
  height: 40px;
  background-color: var(--inputBackground);
  border: none;
  border-radius: 14px;
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
  outline: none;
  transition: all 0.2s ease;
  color: var(--text);
  min-width: 120px;

  &::placeholder {
    color: var(--textMuted);
  }

  &:focus {
    background-color: var(--buttonBackgroundHover);
    box-shadow: 0 0 0 2px var(--accent);
  }
`;

const GenderSelect = styled.select`
  padding: 0 12px;
  height: 40px;
  background-color: var(--inputBackground);
  border: none;
  border-radius: 14px;
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
  outline: none;
  transition: all 0.2s ease;
  color: var(--text);
  cursor: pointer;
  min-width: 100px;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 16px;
  padding-right: 32px;

  &:focus {
    background-color: var(--buttonBackgroundHover);
  }

  &:hover {
    background-color: var(--buttonBackgroundHover);
  }
  
  option {
    background-color: var(--modalBackground);
    color: var(--text);
  }
`;

const RemoveButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background-color: var(--buttonBackground);
  border: none;
  border-radius: 14px;
  cursor: pointer;
  padding: 0;
  transition: all 0.2s ease;

  svg {
    width: 20px;
    height: 20px;
    color: var(--text);
    stroke: var(--text) !important;
    
    path, line, circle, rect, polyline, polygon {
      stroke: var(--text) !important;
    }
  }

  &:hover {
    background-color: var(--buttonBackgroundHover);
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const AddButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin-bottom: 24px;
`;

const CombinedButton = styled.div`
  display: flex;
  align-items: stretch;
  background-color: var(--buttonBackground);
  border-radius: 1000px;
  height: 44px;
  overflow: hidden;
  transition: all 0.2s ease;

  &:hover {
    background-color: var(--buttonBackgroundHover);
    transform: scale(1.02);
  }

  &:active {
    transform: scale(0.98);
  }
`;

const AddButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 0 22px;
  height: 100%;
  background-color: transparent;
  border: none;
  color: var(--text);
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background-color: transparent;
  }

  &:active:not(:disabled) {
    background-color: transparent;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }

  svg {
    width: 20px;
    height: 20px;
    color: var(--text);
  }
`;

const ConfirmButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 22px;
  height: 100%;
  background-color: transparent;
  border: none;
  color: var(--text);
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: transparent;
  }

  &:active {
    background-color: transparent;
  }
`;

const Divider = styled.div`
  width: 0;
  height: 100%;
  border-left: 1px dashed var(--inputBorder);
  align-self: stretch;
  margin: 0;
  padding: 0;
`;

const ErrorMessage = styled.p`
  color: #EF4136;
  font-size: 12px;
  margin-top: 8px;
  font-family: 'Poppins', sans-serif;
`;

const PlusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 4V16M4 10H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const MinusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 10H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const UsersModal = () => {
  const { isOpen, closeUsersModal } = useUsersModal();
  const { playersWithGender, firstName1, firstName2, selectedToys, updateUserPreferences } = useContext(UserContext);
  const [localPlayers, setLocalPlayers] = useState([]);
  const [error, setError] = useState('');
  const playButtonSound = useButtonSound();
  const wasOpenRef = useRef(false); // Track if modal was previously open

  // Helper pour obtenir le nom d'un joueur
  const getPlayerName = (player) => {
    if (!player) return '';
    if (typeof player === 'string') return player;
    return player.name || '';
  };

  // Helper pour obtenir le genre d'un joueur
  const getPlayerGender = (player) => {
    if (!player) return 'mixed';
    if (typeof player === 'string') return 'mixed';
    return player.gender || 'mixed';
  };

  useEffect(() => {
    // Seulement initialiser quand le modal OUVRE (pas à chaque changement de context)
    if (isOpen && !wasOpenRef.current) {
      // Initialiser avec les joueurs existants (objets {name, gender})
      let initialPlayers = [];
      
      if (playersWithGender && playersWithGender.length > 0) {
        initialPlayers = playersWithGender.map(p => ({
          name: getPlayerName(p),
          gender: getPlayerGender(p)
        }));
      } else if (firstName1 || firstName2) {
        if (firstName1 && firstName1.trim()) {
          initialPlayers.push({ name: firstName1, gender: 'mixed' });
        }
        if (firstName2 && firstName2.trim()) {
          initialPlayers.push({ name: firstName2, gender: 'mixed' });
        }
      }
      
      // S'assurer qu'il y a au moins un joueur vide si la liste est vide
      if (initialPlayers.length === 0) {
        setLocalPlayers([{ name: '', gender: 'mixed' }]);
      } else {
        setLocalPlayers(initialPlayers);
      }
      setError('');
    }
    wasOpenRef.current = isOpen;
  }, [isOpen, playersWithGender, firstName1, firstName2]);

  const savePlayers = (playersToSave) => {
    const validPlayers = playersToSave.filter(p => p && p.name && p.name.trim() !== '');
    
    if (validPlayers.length === 0) {
      setError('Au moins un joueur est requis');
      return false;
    }

    if (validPlayers.length > 10) {
      setError('Maximum 10 joueurs autorisés');
      return false;
    }

    // Sauvegarder les préférences en conservant les toys existants
    updateUserPreferences({
      players: validPlayers,
      selectedToys: selectedToys || [] // Conserver les toys existants
    });

    setError('');
    return true;
  };

  const handlePlayerNameChange = (index, value) => {
    const newPlayers = [...localPlayers];
    newPlayers[index] = { ...newPlayers[index], name: value };
    setLocalPlayers(newPlayers);
    setError('');
    // Sauvegarder automatiquement
    savePlayers(newPlayers);
  };

  const handlePlayerGenderChange = (index, value) => {
    const newPlayers = [...localPlayers];
    newPlayers[index] = { ...newPlayers[index], gender: value };
    setLocalPlayers(newPlayers);
    // Sauvegarder automatiquement
    savePlayers(newPlayers);
  };

  const handleAddPlayer = () => {
    playButtonSound();
    if (localPlayers.length >= 10) {
      setError('Maximum 10 joueurs autorisés');
      return;
    }
    const newPlayers = [...localPlayers, { name: '', gender: 'mixed' }];
    setLocalPlayers(newPlayers);
    setError('');
    // Ne pas sauvegarder automatiquement ici car le joueur est vide
  };

  const handleRemovePlayer = (index) => {
    if (localPlayers.length <= 1) {
      setError('Au moins un joueur est requis');
      return;
    }
    const newPlayers = localPlayers.filter((_, i) => i !== index);
    setLocalPlayers(newPlayers);
    setError('');
    // Sauvegarder automatiquement
    savePlayers(newPlayers);
  };


  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      closeUsersModal();
    }
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay isOpen={isOpen} onClick={handleOverlayClick}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <TitleContainer>
          <Title>Gérer les joueurs</Title>
          <CloseButton onClick={closeUsersModal}>
            <XIcon />
          </CloseButton>
        </TitleContainer>
        <SubTitle>Ajoutez ou supprimez des joueurs (1 à 10 maximum)</SubTitle>

        <UsersList>
          {localPlayers.map((player, index) => (
            <UserItem key={index}>
              <UserInput
                type="text"
                placeholder="Prénom"
                value={player.name || ''}
                onChange={(e) => handlePlayerNameChange(index, e.target.value)}
              />
              <GenderSelect
                value={player.gender || 'mixed'}
                onChange={(e) => handlePlayerGenderChange(index, e.target.value)}
              >
                <option value="mixed">🔀 Mixte</option>
                <option value="female">👩 Femme</option>
                <option value="male">👨 Homme</option>
              </GenderSelect>
              {localPlayers.length > 1 && (
                <RemoveButton onClick={() => handleRemovePlayer(index)}>
                  <TrashIcon />
                </RemoveButton>
              )}
            </UserItem>
          ))}
        </UsersList>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <AddButtonContainer>
          <CombinedButton>
            <AddButton 
              onClick={handleAddPlayer} 
              disabled={localPlayers.length >= 10}
            >
              <PlusIcon />
              Ajouter un joueur
            </AddButton>
            <Divider />
            <ConfirmButton onClick={() => { playButtonSound(); closeUsersModal(); }}>
              Confirmer
            </ConfirmButton>
          </CombinedButton>
        </AddButtonContainer>
      </ModalContent>
    </ModalOverlay>
  );
};

export default UsersModal;

