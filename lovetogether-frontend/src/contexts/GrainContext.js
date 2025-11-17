import React, { createContext, useContext, useState, useEffect } from 'react';

const GrainContext = createContext();

// ============================================
// POUR DÉSACTIVER LE GRAIN TEMPORAIREMENT :
// Changez cette constante à false
// ============================================
const GRAIN_ENABLED = false; // false = grain désactivé partout

export const GrainProvider = ({ children }) => {
  const [grainEnabled, setGrainEnabled] = useState(() => {
    // Si la constante globale est désactivée, ignorer localStorage
    if (!GRAIN_ENABLED) {
      return false;
    }
    // Sinon, vérifier localStorage pour une préférence persistante
    const saved = localStorage.getItem('grainEnabled');
    return saved !== null ? saved === 'true' : true; // Par défaut activé
  });

  // L'état effectif combine la constante globale et l'état local
  const effectiveGrainEnabled = GRAIN_ENABLED && grainEnabled;

  useEffect(() => {
    if (GRAIN_ENABLED) {
      localStorage.setItem('grainEnabled', grainEnabled.toString());
    }
  }, [grainEnabled]);

  return (
    <GrainContext.Provider value={{ 
      grainEnabled: effectiveGrainEnabled, 
      setGrainEnabled 
    }}>
      {children}
    </GrainContext.Provider>
  );
};

export const useGrain = () => {
  const context = useContext(GrainContext);
  if (!context) {
    throw new Error('useGrain must be used within a GrainProvider');
  }
  return context;
};

