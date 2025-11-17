import { useState, useEffect } from 'react';
import { INTENSITY_LEVELS, INTENSITY_CONFIG, DARE_CLICK_THRESHOLD } from '../constants/intensityLevels';
import logger from '../utils/logger';

const useIntensityProgression = (initialIntensity = INTENSITY_LEVELS.LOW) => {
  const [intensity, setIntensity] = useState(initialIntensity);
  const [dareClickCount, setDareClickCount] = useState(0);
  const [dizaine, setDizaine] = useState(0);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // Vérifier si on doit afficher le modal d'upgrade
  useEffect(() => {
    if (dareClickCount >= DARE_CLICK_THRESHOLD && intensity !== INTENSITY_LEVELS.HIGH) {
      const modalType = intensity === INTENSITY_LEVELS.LOW ? 'Foreplay' : 'The Main Event';
      logger.log(`Showing modal for ${modalType}`);
      setShowUpgradeModal(true);
    }
  }, [dareClickCount, intensity]);

  // Incrémenter le compteur de dare
  const incrementDareCount = () => {
    if (intensity === INTENSITY_LEVELS.HIGH) return; // Pas de comptage en HIGH
    
    setDareClickCount((prevCount) => {
      const newCount = prevCount + 1;
      logger.log(`Dare click count: ${newCount}`);
      return newCount;
    });
  };

  // Accepter l'upgrade d'intensité
  const acceptUpgrade = () => {
    logger.log('Modal accepted, increasing intensity');
    const nextLevel = INTENSITY_CONFIG[intensity].nextLevel;
    setIntensity(nextLevel);
    setShowUpgradeModal(false);
    setDareClickCount(0);
    setDizaine((prev) => prev + 1);
    logger.log('Dare click count reset, dizaine incremented');
  };

  // Décliner l'upgrade d'intensité
  const declineUpgrade = () => {
    logger.log('Modal declined');
    setShowUpgradeModal(false);
    setDareClickCount(0);
    setDizaine((prev) => prev + 1);
    logger.log('Dare click count reset, dizaine incremented');
  };

  // Changer manuellement l'intensité (bouton cycle)
  const cycleIntensity = () => {
    logger.log('Changing intensity');
    const nextLevel = INTENSITY_CONFIG[intensity].nextLevel;
    setIntensity(nextLevel);
  };

  // Reset le compteur de dare (utilisé lors du skip/reset de cartes)
  const resetDareCount = () => {
    setDareClickCount(0);
  };

  return {
    intensity,
    setIntensity,
    dareClickCount,
    dizaine,
    showUpgradeModal,
    incrementDareCount,
    acceptUpgrade,
    declineUpgrade,
    cycleIntensity,
    resetDareCount,
    currentConfig: INTENSITY_CONFIG[intensity],
  };
};

export default useIntensityProgression;

