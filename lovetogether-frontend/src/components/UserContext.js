import React, { createContext, useState, useEffect, useMemo } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [firstName1, setFirstName1] = useState('');
  const [firstName2, setFirstName2] = useState('');
  const [players, setPlayers] = useState([]); // Nouveau: tableau de joueurs
  const [selectedToys, setSelectedToys] = useState([]);

  // Calculer les joueurs à partir de firstName1/firstName2 ou utiliser le tableau players
  const allPlayers = useMemo(() => {
    if (players && players.length > 0) {
      return players.filter(p => p && p.trim() !== '');
    }
    // Compatibilité avec l'ancien système
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
      
      // Support pour le nouveau format avec players
      if (data.players && Array.isArray(data.players) && data.players.length > 0) {
        const validPlayers = data.players.filter(p => p && p.trim() !== '');
        setPlayers(validPlayers);
        // Mettre à jour firstName1 et firstName2 pour cohérence
        setFirstName1(validPlayers[0] || '');
        setFirstName2(validPlayers[1] || '');
      } else {
        // Compatibilité avec l'ancien format
        setFirstName1(data.firstName1 || '');
        setFirstName2(data.firstName2 || '');
        // Créer le tableau players à partir de firstName1/firstName2
        const oldPlayers = [];
        if (data.firstName1 && data.firstName1.trim() !== '') oldPlayers.push(data.firstName1);
        if (data.firstName2 && data.firstName2.trim() !== '') oldPlayers.push(data.firstName2);
        setPlayers(oldPlayers);
      }
      setSelectedToys(data.selectedToys || []);
    }
  }, []);

  const updateUserPreferences = (data) => {
    console.log("UserProvider - Updating preferences:", data);
    
    // Si data contient players, utiliser le nouveau format
    if (data.players && Array.isArray(data.players)) {
      const validPlayers = data.players.filter(p => p && p.trim() !== '');
      setPlayers(validPlayers);
      // Garder firstName1 et firstName2 pour compatibilité (premiers 2 joueurs)
      setFirstName1(validPlayers[0] || '');
      setFirstName2(validPlayers[1] || '');
      
      // Mettre à jour les toys si fournis
      if (data.selectedToys !== undefined) {
        setSelectedToys(data.selectedToys);
      }
      
      // Sauvegarder dans localStorage avec le nouveau format
      setSelectedToys(prevToys => {
        const toysToSave = data.selectedToys !== undefined ? data.selectedToys : prevToys;
        const toSave = {
          players: validPlayers,
          firstName1: validPlayers[0] || '',
          firstName2: validPlayers[1] || '',
          selectedToys: toysToSave
        };
        localStorage.setItem('userPreferences', JSON.stringify(toSave));
        return toysToSave;
      });
    } else {
      // Format ancien
      setFirstName1(data.firstName1 || '');
      setFirstName2(data.firstName2 || '');
      // Mettre à jour players à partir de firstName1/firstName2
      const newPlayers = [];
      if (data.firstName1) newPlayers.push(data.firstName1);
      if (data.firstName2) newPlayers.push(data.firstName2);
      setPlayers(newPlayers);
      
      // Mettre à jour les toys si fournis
      if (data.selectedToys !== undefined) {
        setSelectedToys(data.selectedToys);
      }
      
      // Sauvegarder dans localStorage
      setSelectedToys(prevToys => {
        const toysToSave = data.selectedToys !== undefined ? data.selectedToys : prevToys;
        const toSave = {
          firstName1: data.firstName1 || '',
          firstName2: data.firstName2 || '',
          players: newPlayers,
          selectedToys: toysToSave
        };
        localStorage.setItem('userPreferences', JSON.stringify(toSave));
        return toysToSave;
      });
    }
  };

  return (
    <UserContext.Provider value={{ 
      firstName1, 
      firstName2, 
      players: allPlayers, // Nouveau: tableau de tous les joueurs
      selectedToys, 
      updateUserPreferences 
    }}>
      {children}
    </UserContext.Provider>
  );
};
