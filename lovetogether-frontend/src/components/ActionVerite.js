import React, { useRef, useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { gsap } from 'gsap';
import axios from 'axios';
import { UserContext } from './UserContext';
import lowIntensityImage from '../images/logo-5.svg';
import mediumIntensityImage from '../images/whitelogo-10.svg';
import highIntensityImage from '../images/whitelogo-20.svg';
import AVModal from './AVModal';
import AVModalForeplay from './AVModalForeplay';
import Modal from './Modal';
import GrainEffect from './GrainEffect';
import timerSound from '../sound/gong.mp3';
import AddTruthOrDareModal from './AddTruthOrDareModal';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:1812';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background-color: ${({ intensity }) => 
    intensity === 'low' ? '#FBF8F1' : 
    intensity === 'medium' ? '#D51C2C' : 
    '#5A0C13'};
  background-image: ${({ intensity }) => 
    intensity === 'low' ? `url(${lowIntensityImage})` : 
    intensity === 'medium' ? `url(${mediumIntensityImage})` : 
    `url(${highIntensityImage})`};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
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

const CardWrapper = styled.div`
  perspective: 1000px;
  width: 392px;
  height: 548px;
  position: absolute;
  cursor: pointer;
  z-index: 5;
`;

const Footer = styled.div`
  font-family: 'Poppins', sans-serif;
  text-transform: uppercase;
  font-size: 14px;
  font-weight: 400;
  color: #000000;
  margin-top: 20px;
`;

const CardInner = styled.div`
  width: 100%;
  height: 100%;
  transition: transform 1s;
  transform-style: preserve-3d;
  position: relative;
`;

const CardFace = styled.div`
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  border-radius: 16px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  position: absolute;
  backface-visibility: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  box-sizing: border-box;
`;

const CardFront = styled(CardFace)`
  background-image: url(${props => props.image});
`;

const Title = styled.h1`
  font-family: 'Poppins', sans-serif;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 20px;
  text-transform: uppercase;
`;

const CardBack = styled(CardFace)`
  background-color: white;
  transform: rotateY(180deg);
  display: flex;
  flex-direction: column;
  padding: 48px;
  justify-content: space-between;
`;

const CardText = styled.div`
  color: #333;
  font-family: Paragon;
  font-size: 1.75rem;
  text-align: center;
`;

const ButtonGroup = styled.div`
  display: flex; 
  flex-direction: row; 
  gap: 12px;

  @media (max-width: 500px) {
    flex-direction: column;
    gap: 6px;
  }
`;

const ButtonContainer = styled.div`
  position: absolute;
  bottom: 48px;
  display: flex;
  gap: 32px;
  margin-top: 20px;
  z-index: 5;
  justify-content: center;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background-color: white;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 12px;
  color: #000;
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;

  &:hover:enabled {
    background-color: #fff5f5;
    color: #ff4500;
    border-color: #ff4500;
    box-shadow: 0 6px 12px rgba(255, 69, 0, 0.3);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const TimerButton = styled(Button)`
  background-color: #ff4500;
  color: white;

  &:hover {
    background-color: #ff5733;
  }
`;

const SkipButton = styled(Button)`
  background-color: #ff5733;
  color: white;

  &:hover {
    background-color: #ff4500;
  }
`;

const RecommencerButton = styled(TimerButton)``;

const TimerRectangle = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 0;
  background-color: rgba(255, 69, 0, 0.5);
  z-index: 2;
`;

const AddButton = styled(Button)`
  background-color: #4CAF50;
  color: white;

  &:hover {
    background-color: #45a049;
  }
`;

const ToyChip = styled.span`
  background-color: #f0f0f0;
  border-radius: 16px;
  padding: 4px 8px;
  margin-right: 4px;
  font-size: 12px;
`;

const ActionVerite = () => {
  const { firstName1, firstName2, selectedToys } = useContext(UserContext);
  const [clickedCard, setClickedCard] = useState(null);
  const [randomText, setRandomText] = useState('');
  const [duration, setDuration] = useState(null);
  const [remainingTime, setRemainingTime] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const intervalRef = useRef(null);
  const [showSkipButton, setShowSkipButton] = useState(false);
  const timerRectangleRef = useRef(null);
  const animationRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [showModalForeplay, setShowModalForeplay] = useState(false);
  const [dareClickCount, setDareClickCount] = useState(0);
  const [dizaine, setDizaine] = useState(0);
  const [showSetupModal, setShowSetupModal] = useState(false);
  const leftCardRef = useRef(null);
  const rightCardRef = useRef(null);
  const [currentPlayer, setCurrentPlayer] = useState(firstName1 || '');
  const [intensity, setIntensity] = useState('low');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [currentToys, setCurrentToys] = useState([]);

  useEffect(() => {
    console.log("ActionVerite - Loaded user data from context:", { firstName1, firstName2, selectedToys });
    setCurrentPlayer(firstName1 || '');
  }, [firstName1, firstName2, selectedToys]);

  useEffect(() => {
    console.log("Current intensity:", intensity);
    gsap.set(leftCardRef.current, { x: '-150px', rotation: -10 });
    gsap.set(rightCardRef.current, { x: '150px', rotation: 10 });
  }, [intensity]);

  useEffect(() => {
    console.log("Updated selected toys:", selectedToys);
  }, [selectedToys]);

  const fetchRandomActionOrTruth = async (type, player) => {
    try {
      console.log("Selected toys before request:", selectedToys);
      const mappedPlayer = player === firstName1 ? 'firstName1' : 'firstName2';
      const otherPlayer = player === firstName1 ? firstName2 : firstName1;
      const toysParam = selectedToys?.length ? [...selectedToys, 'all'] : ['all'];

      console.log("Toys parameter for request:", toysParam);

      const response = await axios.get(`${API_BASE_URL}/api/truthordare/random`, {
        params: { type: type, player: mappedPlayer, toys: toysParam.join(','), intensity: intensity }
      });

      console.log('Full API Response:', response.data);

      if (response.data && response.data.template) {
        let { template, duration, toys } = response.data;
        setDuration(duration || null);
        setRemainingTime(duration);
        setCurrentToys(toys || []);

        template = template.charAt(0).toLowerCase() + template.slice(1);
        template = template.replace('{Currentplayer}', player)
                           .replace('{AutrePlayer}', otherPlayer);

        return template;
      } else {
        console.error('Unexpected API response format:', response.data);
        return 'Une erreur s\'est produite lors du chargement de la question/du défi.';
      }
    } catch (error) {
      console.error('Error fetching action or truth:', error);
      if (error.response) {
        console.error('Error data:', error.response.data);
        console.error('Error status:', error.response.status);
        console.error('Error headers:', error.response.headers);
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
      return 'Une erreur s\'est produite. Veuillez réessayer.';
    }
  };

  const handleCardClick = async (card) => {
    if (!firstName1 || !firstName2) {
      setShowSetupModal(true);
      return;
    }

    if (clickedCard) return;

    console.log(`Card clicked: ${card}`);
    try {
      let randomText = '';

      if (card === 'left') {
        randomText = await fetchRandomActionOrTruth('truth', currentPlayer);
      } else {
        randomText = await fetchRandomActionOrTruth('dare', currentPlayer);
        if (intensity === 'low' || intensity === 'medium') {
          setDareClickCount(prevCount => {
            const newCount = prevCount + 1;
            console.log(`Dare click count: ${newCount}`);
            return newCount;
          });
        }
      }

      setRandomText(randomText);
      setClickedCard(card);

      if (card === 'left') {
        gsap.to(leftCardRef.current, { duration: 0.8, x: 0, y: 0, rotation: 0, scale: 1 });
        gsap.to(rightCardRef.current, { duration: 0.8, x: 1000, opacity: 0 });
        setTimeout(() => {
          gsap.to(leftCardRef.current.querySelector('.inner'), { rotationY: 180 });
        }, 500);
      } else {
        gsap.to(rightCardRef.current, { duration: 0.8, x: 0, y: 0, rotation: 0, scale: 1 });
        gsap.to(leftCardRef.current, { duration: 0.8, x: -1000, opacity: 0 });
        setTimeout(() => {
          gsap.to(rightCardRef.current.querySelector('.inner'), { rotationY: 180 });
        }, 500);
      }

      if (duration) {
        setShowSkipButton(true);
      }
    } catch (error) {
      console.error('Error handling card click:', error);
    }
  };

  useEffect(() => {
    if (dareClickCount >= 10 && intensity === 'low') {
      console.log('Showing modal for Foreplay');
      setShowModal(true);
    } else if (dareClickCount >= 10 && intensity === 'medium') {
      console.log('Showing modal for The Main Event');
      setShowModalForeplay(true);
    }
  }, [dareClickCount, intensity]);

  const handleModalAccept = () => {
    console.log('Modal accepted, increasing intensity');
    if (intensity === 'low') {
      setIntensity('medium');
    } else if (intensity === 'medium') {
      setIntensity('high');
    }
    resetCards();
    setShowModal(false);
    setShowModalForeplay(false);
    setDareClickCount(0);
    setDizaine(dizaine + 1);
    console.log('Dare click count reset, dizaine incremented');
  };

  const handleModalDecline = () => {
    console.log('Modal declined');
    setShowModal(false);
    setShowModalForeplay(false);
    setDareClickCount(0);
    setDizaine(dizaine + 1);
    console.log('Dare click count reset, dizaine incremented');
  };

  const handleModalSave = (formState) => {
    setShowSetupModal(false);
  };

  const resetCards = () => {
    console.log('Resetting cards');
    setClickedCard(null);
    setRandomText('');
    setDuration(null);
    setRemainingTime(null);
    setIsPaused(false);
    setIsStarted(false);
    setShowSkipButton(false);
    setCurrentToys([]);
    clearInterval(intervalRef.current);
    setCurrentPlayer(prevPlayer => prevPlayer === firstName1 ? firstName2 : firstName1);

    if (animationRef.current) {
      animationRef.current.kill();
      animationRef.current = null;
    }
    gsap.set(timerRectangleRef.current, { height: '0%' });

    gsap.to(leftCardRef.current.querySelector('.inner'), { rotationY: 0 });
    gsap.to(rightCardRef.current.querySelector('.inner'), { rotationY: 0 });
    gsap.to(leftCardRef.current, { duration: 0.8, x: '-150px', rotation: -10, scale: 1, opacity: 1 });
    gsap.to(rightCardRef.current, { duration: 0.8, x: '150px', rotation: 10, scale: 1, opacity: 1 });
  };

  const startTimer = () => {
    if (!remainingTime || remainingTime <= 0) {
      setRemainingTime(duration);
    }

    console.log("Starting timer with duration:", duration);

    clearInterval(intervalRef.current);
    setIsStarted(true);
    setIsPaused(false);

    if (animationRef.current) {
      animationRef.current.resume();
    } else {
      animationRef.current = gsap.to(timerRectangleRef.current, {
        height: '100%',
        duration: remainingTime,
        ease: 'linear',
        onComplete: () => {
          console.log("Timer and animation complete.");
          setIsStarted(false);
          playSound();
        },
      }).play();
    }

    intervalRef.current = setInterval(() => {
      setRemainingTime(prevTime => {
        if (prevTime <= 1) {
          clearInterval(intervalRef.current);
          setIsPaused(true);
          setIsStarted(false);
          playSound();
          console.log("Timer reached zero, interval cleared.");
          return 0;
        }
        console.log("Timer ticking:", prevTime - 1);
        return prevTime - 1;
      });
    }, 1000);
  };

  const resetAndStartTimer = () => {
    console.log("Recommencer button clicked - resetting and starting timer");

    clearInterval(intervalRef.current);
    setRemainingTime(duration);
    setIsPaused(false);
    setIsStarted(true);

    if (animationRef.current) {
      animationRef.current.kill();
      animationRef.current = null;
    }

    gsap.set(timerRectangleRef.current, { height: '0%' });

    animationRef.current = gsap.to(timerRectangleRef.current, {
        height: '100%',
        duration: duration,
        ease: 'linear',
        onComplete: () => {
          console.log("Timer and animation complete.");
          setIsStarted(false);
          playSound();
        }
    });

    intervalRef.current = setInterval(() => {
      setRemainingTime(prevTime => {
        if (prevTime <= 1) {
          clearInterval(intervalRef.current);
          setIsPaused(true);
          setIsStarted(false);
          playSound();
          console.log("Timer reached zero, interval cleared.");
          return 0;
        }
        console.log("Timer ticking:", prevTime - 1);
        return prevTime - 1;
      });
    }, 1000);
  };

  const handleTimerButtonClick = () => {
    if (!isStarted) {
      console.log("Starting timer");
      startTimer();
    } else if (isPaused) {
      console.log("Resuming timer");
      startTimer();
    } else {
      console.log("Pausing timer");
      pauseTimer();
    }
  };

  const pauseTimer = () => {
    console.log("Pausing timer");
    setIsPaused(true);
    clearInterval(intervalRef.current);
    if (animationRef.current) {
      animationRef.current.pause();
    }
  };

  const handleSkipClick = () => {
    console.log("Skipping to next player");
    resetCards();
  };

  const changeIntensity = () => {
    console.log("Changing intensity");
    setIntensity(prev => {
      if (prev === 'low') return 'medium';
      if (prev === 'medium') return 'high';
      return 'low';
    });
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const playSound = () => {
    console.log("Playing sound");
    const audio = new Audio(timerSound);
    audio.play();
  };

  return (
    <Container intensity={intensity}>
      <CardsContainer>
        <CardWrapper
          ref={leftCardRef}
          onClick={() => handleCardClick('left')}
        >
          <CardInner className="inner">
            <CardFront image={require('../images/junebaby.png')} />
            <CardBack>
              <Title>Truth & Dare</Title>
              <CardText>
                {clickedCard === 'left' && randomText 
                  ? `${currentPlayer}, ${randomText}` 
                  : currentPlayer}
              </CardText>
              {currentToys.length > 0 && (
                <div>
                  Jouets utilisés: 
                  {currentToys.map(toy => (
                    <ToyChip key={toy}>{toy}</ToyChip>
                  ))}
                </div>
              )}
              <Footer>LoveTogether</Footer>
            </CardBack>
          </CardInner>
        </CardWrapper>
        <CardWrapper
          ref={rightCardRef}
          onClick={() => handleCardClick('right')}
        >
          <CardInner className="inner">
            <CardFront image={require('../images/love.png')} />
            <CardBack>
              <Title>Truth & Dare</Title>
              <CardText>
                {clickedCard === 'right' && randomText 
                  ? `${currentPlayer}, ${randomText}` 
                  : currentPlayer}
              </CardText>
              {currentToys.length > 0 && (
                <div>
                  Jouets utilisés: 
                  {currentToys.map(toy => (
                    <ToyChip key={toy}>{toy}</ToyChip>
                  ))}
                </div>
              )}
              <Footer>LoveTogether</Footer>
            </CardBack>
          </CardInner>
        </CardWrapper>
      </CardsContainer>

      <TimerRectangle ref={timerRectangleRef} />

      <ButtonContainer>
        {!clickedCard && (
          <ButtonGroup>
            <Button disabled>
              <span role="img" aria-label="Tour">👤</span> À ton tour, {currentPlayer}
            </Button>
            <Button onClick={changeIntensity}>
              Intensité ｜ {intensity === 'low' ? '👀  Warm-up' : intensity === 'medium' ? '🔥 Foreplay' : "🔞  The Main Event"}
            </Button>
            <AddButton onClick={() => setIsAddModalOpen(true)}>
              Ajouter
            </AddButton>
          </ButtonGroup>
        )}

        {clickedCard && (
          <>
            <Button onClick={resetCards}>
              <span role="img" aria-label="Tour">👤</span> Joueur suivant
            </Button>

            <div style={{ display: 'flex', flexDirection: 'row', gap: '12px' }}>
              {duration && !isStarted && (
                <TimerButton onClick={handleTimerButtonClick}>
                  Lancer le timer
                </TimerButton>
              )}
              {isStarted && (
                <TimerButton onClick={handleTimerButtonClick}>
                  {isPaused ? 'Reprendre' : `Pause (${formatTime(remainingTime)})`}
                </TimerButton>
              )}
              {duration && isStarted && (
                <RecommencerButton onClick={resetAndStartTimer}>
                  Recommencer
                </RecommencerButton>
              )}
              {showSkipButton && (
                <SkipButton onClick={handleSkipClick}>
                  Skip
                </SkipButton>
              )}
            </div>
          </>
        )}
      </ButtonContainer>

      {showModal && (
        <AVModal
          dizaine={dizaine}
          onAccept={handleModalAccept}
          onDecline={handleModalDecline}
        />
      )}

      {showModalForeplay && (
        <AVModalForeplay
          dizaine={dizaine}
          onAccept={handleModalAccept}
          onDecline={handleModalDecline}
        />
      )}

      {showSetupModal && (
        <Modal 
          isOpen={showSetupModal} 
          onClose={() => setShowSetupModal(false)} 
          onSave={handleModalSave} 
        />
      )}

      <AddTruthOrDareModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      <GrainEffect />
    </Container>
  );
};

export default ActionVerite;