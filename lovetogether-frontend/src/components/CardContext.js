import React, { createContext, useContext, useState } from 'react';

// Création du contexte
const CardContext = createContext();

// Hook personnalisé pour utiliser le contexte
export const useCard = () => {
  const context = useContext(CardContext);
  if (!context) {
    throw new Error('useCard must be used within a CardProvider');
  }
  return context;
};

// Fournisseur de contexte
export const CardProvider = ({ children }) => {
  const [selectedCard, setSelectedCard] = useState(null);
  const [hasEntered, setHasEntered] = useState(false);

  const selectCard = (card) => {
    setSelectedCard(card);
  };

  const resetCards = () => {
    setSelectedCard(null);
    setHasEntered(true); // Assure que CardsWrapper est visible
  };

  return (
    <CardContext.Provider value={{ selectedCard, selectCard, resetCards, hasEntered }}>
      {children}
    </CardContext.Provider>
  );
};
