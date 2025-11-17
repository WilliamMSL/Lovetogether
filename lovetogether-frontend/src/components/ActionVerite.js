import React, { useRef, useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { UserContext } from './UserContext';
import AVModal from './AVModal';
import AVModalForeplay from './AVModalForeplay';
import GrainEffect from './GrainEffect';
import PageHeader from './PageHeader';
import useTimer from '../hooks/useTimer';
import useIntensityProgression from '../hooks/useIntensityProgression';
import useButtonSound from '../hooks/useButtonSound';
import TruthDareCard from './TruthDareCard';
import { initializeCardPositions, animateCardSelection, resetCardPositions, flipCard } from '../utils/cardAnimations';
import truthImage from '../images/junebaby.png';
import dareImage from '../images/love.png';
import logger from '../utils/logger';
import { API_BASE_URL, API_ENDPOINTS } from '../constants/api';
import { INTENSITY_LEVELS } from '../constants/intensityLevels';
import { useSettingsModal } from '../contexts/SettingsModalContext';
import { useUsersModal } from '../contexts/UsersModalContext';

const buildPlayerParams = (player, playersList) => {
  // Trouver l'index du joueur actuel
  const currentIndex = playersList.findIndex(p => p === player);
  
  // Pour l'API, on utilise firstName1 ou firstName2 selon la position
  // Si plus de 2 joueurs, on alterne entre firstName1 et firstName2
  const mappedPlayer = currentIndex % 2 === 0 ? 'firstName1' : 'firstName2';
  
  // Choisir un autre joueur au hasard parmi les joueurs restants
  const otherPlayers = playersList.filter((_, index) => index !== currentIndex);
  let otherPlayer = '';
  
  if (otherPlayers.length > 0) {
    // Choisir un joueur aléatoire parmi les autres
    const randomIndex = Math.floor(Math.random() * otherPlayers.length);
    otherPlayer = otherPlayers[randomIndex] || '';
  } else if (playersList.length > 0) {
    // Fallback si un seul joueur
    otherPlayer = playersList[0] || '';
  }

  return { mappedPlayer, otherPlayer };
};

const buildToysParam = (selectedToys) => {
  if (!Array.isArray(selectedToys) || selectedToys.length === 0) {
    return ['all'];
  }

  return [...selectedToys, 'all'];
};

const buildRequestParams = ({ type, mappedPlayer, intensity, toysParam }) => ({
  type,
  player: mappedPlayer,
  toys: toysParam.join(','),
  intensity,
});

const formatTemplate = (template, player, otherPlayer) => {
  if (!template) {
    return '';
  }

  const normalizedTemplate = template.charAt(0).toLowerCase() + template.slice(1);

  return normalizedTemplate
    .replace(/{Currentplayer}/gi, player)
    .replace(/{AutrePlayer}/gi, otherPlayer);
};

// API Base URL log removed for security

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height:100%;
  width: 100vw;
  overflow: hidden;
  background-color: #FFFFFF;
  position: relative;
  z-index: 1;
`;

const CardsContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 5;

  transform: scale(1);

  @media (max-width: 500px) {
    transform: scale(0.8);
  }
`;

const ButtonContainer = styled.div`
  position: absolute;
  bottom: 48px;
  display: flex;
  justify-content: center;
  width: 100%;
  z-index: 5;
  align-items: center;
`;

const RedLightEffect = styled.div`
  position: absolute;
  bottom: -150px;
  left: 50%;
  transform: translateX(-50%);
  width: 800px;
  height: 200px;
  background: radial-gradient(circle, rgba(255, 0, 0, 0.6) 0%, rgba(255, 0, 0, 0.3) 40%, transparent 70%);
  filter: blur(60px);
  z-index: 4;
  pointer-events: none;
  opacity: ${props => props.show ? 1 : 0};
  transition: opacity 0.5s ease;
`;

const DarkRedLightEffect = styled.div`
  position: absolute;
  bottom: -150px;
  left: 50%;
  transform: translateX(-50%);
  width: 800px;
  height: 200px;
  background: radial-gradient(circle, rgba(200, 0, 0, 0.8) 0%, rgba(180, 0, 0, 0.5) 40%, transparent 70%);
  filter: blur(60px);
  z-index: 4;
  pointer-events: none;
  opacity: ${props => props.show ? 1 : 0};
  transition: opacity 0.5s ease;
`;

const CombinedButton = styled.div`
  display: flex;
  align-items: stretch;
  background-color: #F3F3F3;
  border-radius: 1000px;
  height: 44px;
  overflow: hidden;
  transition: all 0.2s ease;

  &:hover {
    background-color: #E8E8E8;
    transform: scale(1.02);
  }

  &:active {
    transform: scale(0.98);
  }
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 0 22px;
  height: 100%;
  background-color: transparent;
  border: none;
  color: #000;
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
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const Divider = styled.div`
  width: 0;
  height: 100%;
  border-left: 1px dashed #C2C2C2;
  align-self: stretch;
  margin: 0;
  padding: 0;
`;

const TimerButton = styled(Button)``;

const SkipButton = styled(Button)``;

const RecommencerButton = styled(TimerButton)``;

const TimerRectangle = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 0;
  background-color: rgba(255, 69, 0, 0.5);
  z-index: 2;
`;

const ActionVerite = () => {
  const { firstName1, firstName2, players, selectedToys } = useContext(UserContext);
  const [clickedCard, setClickedCard] = useState(null);
  const [randomText, setRandomText] = useState('');
  const [duration, setDuration] = useState(null);
  const [showSkipButton, setShowSkipButton] = useState(false);
  const timerRectangleRef = useRef(null);
  const leftCardRef = useRef(null);
  const rightCardRef = useRef(null);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [currentToys, setCurrentToys] = useState([]);
  
  // Calculer le joueur actuel à partir de l'index
  const currentPlayer = players && players.length > 0 ? players[currentPlayerIndex] : (firstName1 || '');

  // Hooks personnalisés
  const timer = useTimer(duration, timerRectangleRef);
  const intensityProgression = useIntensityProgression();
  const { openModal } = useSettingsModal();
  const { openUsersModal } = useUsersModal();
  const playButtonSound = useButtonSound();

  useEffect(() => {
    logger.log("ActionVerite - Loaded user data from context:", { firstName1, firstName2, players, selectedToys });
    // Réinitialiser l'index si la liste de joueurs change
    if (players && players.length > 0) {
      setCurrentPlayerIndex(0);
    } else if (firstName1) {
      setCurrentPlayerIndex(0);
    }
  }, [firstName1, firstName2, players, selectedToys]);

  useEffect(() => {
    logger.log("Current intensity:", intensityProgression.intensity);
    initializeCardPositions(leftCardRef, rightCardRef);
  }, [intensityProgression.intensity]);

  const fetchRandomActionOrTruth = async (type, player) => {
    try {
      logger.log("Selected toys before request:", selectedToys);
      const { mappedPlayer, otherPlayer } = buildPlayerParams(player, players && players.length > 0 ? players : [firstName1, firstName2].filter(p => p));
      const toysParam = buildToysParam(selectedToys);
      const params = buildRequestParams({ 
        type, 
        mappedPlayer, 
        intensity: intensityProgression.intensity, 
        toysParam 
      });

      logger.log("Toys parameter for request:", toysParam);
      // API request logs removed for security

      const response = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.TRUTH_OR_DARE}`, {
        params,
      });

      // API response log removed for security

      if (response.data && response.data.template) {
        const { template, duration, toys } = response.data;
        setDuration(duration || null);
        setCurrentToys(toys || []);

        return formatTemplate(template, player, otherPlayer);
      } else {
        logger.error('Unexpected API response format:', response.data);
        throw new Error('Réponse API inattendue');
      }
    } catch (error) {
      logger.error('Error fetching action or truth:', error);
      if (error.response) {
        logger.error('Error data:', error.response.data);
        logger.error('Error status:', error.response.status);
        logger.error('Error headers:', error.response.headers);
      } else if (error.request) {
        logger.error('No response received:', error.request);
      } else {
        logger.error('Error message:', error.message);
      }
      throw error;
    }
  };

  const handleCardClick = async (card) => {
    // Vérifier qu'il y a au moins 1 joueur
    const playersList = players && players.length > 0 ? players : [firstName1, firstName2].filter(p => p);
    if (playersList.length === 0) {
      openUsersModal();
      return;
    }
    // Vérifier qu'il y a au moins 2 joueurs pour jouer
    if (playersList.length < 2) {
      openUsersModal();
      return;
    }

    if (clickedCard) return;

    logger.log(`Card clicked: ${card}`);
    
    // Démarrer l'animation immédiatement au clic
    setClickedCard(card);
    const isLeftCard = card === 'left';
    const selectedCardRef = isLeftCard ? leftCardRef : rightCardRef;
    const otherCardRef = isLeftCard ? rightCardRef : leftCardRef;
    animateCardSelection(selectedCardRef, otherCardRef, isLeftCard);

    // Faire la requête API en parallèle
    try {
      let randomText = '';

      if (card === 'left') {
        randomText = await fetchRandomActionOrTruth('truth', currentPlayer);
      } else {
        randomText = await fetchRandomActionOrTruth('dare', currentPlayer);
        // Incrémenter le compteur de dare (seulement en low/medium, pas en high)
        if (intensityProgression.intensity !== INTENSITY_LEVELS.HIGH) {
          intensityProgression.incrementDareCount();
        }
      }

      // Mettre à jour le texte une fois la requête terminée
      setRandomText(randomText);
      
      // Faire le flip maintenant que le texte est disponible
      flipCard(selectedCardRef);

      if (duration) {
        setShowSkipButton(true);
      }
    } catch (error) {
      logger.error('Error handling card click:', error);
      // En cas d'erreur, réinitialiser la carte
      resetCards();
    }
  };

  const handleModalAccept = () => {
    intensityProgression.acceptUpgrade();
    resetCards();
  };

  const handleModalDecline = () => {
    intensityProgression.declineUpgrade();
  };

  const resetCards = () => {
    logger.log('Resetting cards');
    setClickedCard(null);
    setRandomText('');
    setDuration(null);
    setShowSkipButton(false);
    setCurrentToys([]);
    timer.reset();
    
    // Passer au joueur suivant dans la liste
    if (players && players.length > 0) {
      setCurrentPlayerIndex(prevIndex => (prevIndex + 1) % players.length);
    } else if (firstName1 && firstName2) {
      setCurrentPlayerIndex(prevIndex => (prevIndex + 1) % 2);
    }

    resetCardPositions(leftCardRef, rightCardRef);
  };

  const handleSkipClick = () => {
    logger.log("Skipping to next player");
    resetCards();
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <Container>
      <PageHeader />
      <CardsContainer>
        <TruthDareCard
          cardRef={leftCardRef}
          image={truthImage}
          onClick={() => handleCardClick('left')}
          isClicked={clickedCard === 'left'}
          currentPlayer={currentPlayer}
          randomText={randomText}
          currentToys={currentToys}
        />
        <TruthDareCard
          cardRef={rightCardRef}
          image={dareImage}
          onClick={() => handleCardClick('right')}
          isClicked={clickedCard === 'right'}
          currentPlayer={currentPlayer}
          randomText={randomText}
          currentToys={currentToys}
        />
      </CardsContainer>

      <TimerRectangle ref={timerRectangleRef} />

      <RedLightEffect show={intensityProgression.intensity === INTENSITY_LEVELS.MEDIUM} />
      <DarkRedLightEffect show={intensityProgression.intensity === INTENSITY_LEVELS.HIGH} />

      <ButtonContainer>
        {!clickedCard && (
          <CombinedButton>
            <Button disabled>
              <span role="img" aria-label="Tour">👤</span> À ton tour, {currentPlayer}
            </Button>
            <Divider />
            <Button onClick={() => { playButtonSound(); intensityProgression.cycleIntensity(); }}>
              Intensité ｜ {intensityProgression.currentConfig.label}
            </Button>
          </CombinedButton>
        )}

        {clickedCard && (
          <>
            <CombinedButton>
              <Button onClick={() => { playButtonSound(); resetCards(); }}>
                <span role="img" aria-label="Tour">👤</span> Joueur suivant
              </Button>
              {duration && timer.isIdle && (
                <>
                  <Divider />
                  <TimerButton onClick={() => { playButtonSound(); timer.toggle(); }}>
                    Lancer le timer
                  </TimerButton>
                </>
              )}
              {(timer.isRunning || timer.isPaused) && (
                <>
                  <Divider />
                  <TimerButton onClick={() => { playButtonSound(); timer.toggle(); }}>
                    {timer.isPaused ? 'Reprendre' : `Pause (${formatTime(timer.remainingTime)})`}
                  </TimerButton>
                </>
              )}
              {duration && !timer.isIdle && (
                <>
                  <Divider />
                  <RecommencerButton onClick={() => { playButtonSound(); timer.restart(); }}>
                    Recommencer
                  </RecommencerButton>
                </>
              )}
              {showSkipButton && (
                <>
                  <Divider />
                  <SkipButton onClick={() => { playButtonSound(); handleSkipClick(); }}>
                    Skip
                  </SkipButton>
                </>
              )}
            </CombinedButton>
          </>
        )}
      </ButtonContainer>

      {intensityProgression.showUpgradeModal && intensityProgression.intensity === INTENSITY_LEVELS.LOW && (
        <AVModal
          dizaine={intensityProgression.dizaine}
          onAccept={handleModalAccept}
          onDecline={handleModalDecline}
        />
      )}

      {intensityProgression.showUpgradeModal && intensityProgression.intensity === INTENSITY_LEVELS.MEDIUM && (
        <AVModalForeplay
          dizaine={intensityProgression.dizaine}
          onAccept={handleModalAccept}
          onDecline={handleModalDecline}
        />
      )}

      <GrainEffect />
    </Container>
  );
};

export default ActionVerite;