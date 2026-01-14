import React, { createContext, useState, useEffect, useMemo } from 'react';

export const UserContext = createContext();

// Helper pour extraire le nom d'un joueur (string ou objet)
const getPlayerName = (player) => {
  if (!player) return '';
  if (typeof player === 'string') return player;
  return player.name || '';
};

// Helper pour extraire le genre d'un joueur
const getPlayerGender = (player) => {
  if (!player) return 'mixed';
  if (typeof player === 'string') return 'mixed';
  return player.gender || 'mixed';
};

// Helper pour normaliser un joueur en objet {name, gender}
const normalizePlayer = (player) => {
  if (!player) return null;
  if (typeof player === 'string') {
    return player.trim() ? { name: player.trim(), gender: 'mixed' } : null;
  }
  if (player.name && player.name.trim()) {
    return { name: player.name.trim(), gender: player.gender || 'mixed' };
  }
  return null;
};

export const UserProvider = ({ children }) => {
  const [firstName1, setFirstName1] = useState('');
  const [firstName2, setFirstName2] = useState('');
  const [players, setPlayers] = useState([]); // Tableau de joueurs {name, gender}
  const [selectedToys, setSelectedToys] = useState([]);

  // Calculer les noms des joueurs (pour compatibilité avec le code existant)
  const playerNames = useMemo(() => {
    if (players && players.length > 0) {
      return players.map(p => getPlayerName(p)).filter(n => n);
    }
    const result = [];
    if (firstName1 && firstName1.trim() !== '') result.push(firstName1);
    if (firstName2 && firstName2.trim() !== '') result.push(firstName2);
    return result;
  }, [firstName1, firstName2, players]);

  useEffect(() => {
    const savedPreferences = localStorage.getItem('userPreferences');
    if (savedPreferences) {
      const data = JSON.parse(savedPreferences);
      console.log("UserProvider - Loaded from localStorage:", data);
      
      // Support pour le nouveau format avec players (objets ou strings)
      if (data.players && Array.isArray(data.players) && data.players.length > 0) {
        const validPlayers = data.players.map(normalizePlayer).filter(p => p !== null);
        setPlayers(validPlayers);
        // Mettre à jour firstName1 et firstName2 pour cohérence
        setFirstName1(getPlayerName(validPlayers[0]) || '');
        setFirstName2(getPlayerName(validPlayers[1]) || '');
      } else {
        // Compatibilité avec l'ancien format
        setFirstName1(data.firstName1 || '');
        setFirstName2(data.firstName2 || '');
        // Créer le tableau players à partir de firstName1/firstName2
        const oldPlayers = [];
        if (data.firstName1 && data.firstName1.trim() !== '') {
          oldPlayers.push({ name: data.firstName1, gender: 'mixed' });
        }
        if (data.firstName2 && data.firstName2.trim() !== '') {
          oldPlayers.push({ name: data.firstName2, gender: 'mixed' });
        }
        setPlayers(oldPlayers);
      }
      setSelectedToys(data.selectedToys || []);
    }
  }, []);

  const updateUserPreferences = (data) => {
    console.log("UserProvider - Updating preferences:", data);
    
    // Si data contient players, utiliser le nouveau format
    if (data.players && Array.isArray(data.players)) {
      const validPlayers = data.players.map(normalizePlayer).filter(p => p !== null);
      setPlayers(validPlayers);
      // Garder firstName1 et firstName2 pour compatibilité (premiers 2 joueurs)
      setFirstName1(getPlayerName(validPlayers[0]) || '');
      setFirstName2(getPlayerName(validPlayers[1]) || '');
      
      // Mettre à jour les toys si fournis
      if (data.selectedToys !== undefined) {
        setSelectedToys(data.selectedToys);
      }
      
      // Sauvegarder dans localStorage avec le nouveau format
      setSelectedToys(prevToys => {
        const toysToSave = data.selectedToys !== undefined ? data.selectedToys : prevToys;
        const toSave = {
          players: validPlayers,
          firstName1: getPlayerName(validPlayers[0]) || '',
          firstName2: getPlayerName(validPlayers[1]) || '',
          selectedToys: toysToSave
        };
        console.log("UserProvider - Saving to localStorage:", toSave);
        localStorage.setItem('userPreferences', JSON.stringify(toSave));
        return toysToSave;
      });
    } else if (data.selectedToys !== undefined && !data.firstName1 && !data.firstName2) {
      // Cas spécial: mise à jour des toys uniquement (depuis le modal Personnaliser)
      // Préserver les joueurs existants avec leur genre
      console.log("UserProvider - Updating toys only, preserving players");
      setSelectedToys(data.selectedToys);
      
      // Sauvegarder dans localStorage en préservant les joueurs existants
      setPlayers(prevPlayers => {
        const toSave = {
          players: prevPlayers,
          firstName1: getPlayerName(prevPlayers[0]) || firstName1 || '',
          firstName2: getPlayerName(prevPlayers[1]) || firstName2 || '',
          selectedToys: data.selectedToys
        };
        console.log("UserProvider - Saving to localStorage (toys only):", toSave);
        localStorage.setItem('userPreferences', JSON.stringify(toSave));
        return prevPlayers;
      });
    } else {
      // Format ancien avec firstName1/firstName2
      // Préserver le genre existant si possible
      setPlayers(prevPlayers => {
        const newPlayers = [];
        if (data.firstName1) {
          // Chercher si ce joueur existe déjà avec un genre
          const existingPlayer = prevPlayers.find(p => getPlayerName(p) === data.firstName1);
          newPlayers.push({ 
            name: data.firstName1, 
            gender: existingPlayer ? getPlayerGender(existingPlayer) : 'mixed' 
          });
        }
        if (data.firstName2) {
          const existingPlayer = prevPlayers.find(p => getPlayerName(p) === data.firstName2);
          newPlayers.push({ 
            name: data.firstName2, 
            gender: existingPlayer ? getPlayerGender(existingPlayer) : 'mixed' 
          });
        }
        
        setFirstName1(data.firstName1 || '');
        setFirstName2(data.firstName2 || '');
        
        // Sauvegarder dans localStorage
        const toysToSave = data.selectedToys !== undefined ? data.selectedToys : selectedToys;
        if (data.selectedToys !== undefined) {
          setSelectedToys(data.selectedToys);
        }
        
        const toSave = {
          players: newPlayers,
          firstName1: data.firstName1 || '',
          firstName2: data.firstName2 || '',
          selectedToys: toysToSave
        };
        console.log("UserProvider - Saving to localStorage (old format):", toSave);
        localStorage.setItem('userPreferences', JSON.stringify(toSave));
        
        return newPlayers;
      });
    }
  };

  return (
    <UserContext.Provider value={{ 
      firstName1, 
      firstName2, 
      players: playerNames, // Noms uniquement pour compatibilité
      playersWithGender: players, // Nouveau: tableau complet avec genre
      selectedToys, 
      updateUserPreferences,
      getPlayerName,
      getPlayerGender
    }}>
      {children}
    </UserContext.Provider>
  );
};
