import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

const CardContainer = styled.div`
  width: 100%;
  height: 100%;
  aspect-ratio: 1 / 1;
  background-image: url(${props => props.$image});
  background-size: cover;
  background-position: center;
  border-radius: 16px;
  box-shadow: none;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translate(${props => props.$translateX}px, ${props => props.$translateY}px) rotate(${props => props.$rotate || '0deg'});
  transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
  cursor: pointer;
  z-index: 1;
  position: relative;
  flex-shrink: 0;

  &:hover {
    cursor: pointer; 
  }
`;

const LabelOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: -50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 16px;
  opacity: ${props => props.$show ? 1 : 0};
  transition: opacity 0.3s ease;
  pointer-events: none;
  z-index: 2;
`;

const LabelText = styled.span`
  color: #FFFFFF;
  font-family: 'Switzerland', sans-serif;
  font-size: 60px;
  font-weight: 700;
  text-transform: capitalize;
  text-align: center;
  line-height: 1;
  display: block;
  margin: 0;
  padding: 0;
`;

const CardWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 300px;
  height: 300px;
  min-width: 300px;
  min-height: 300px;
  max-width: 300px;
  max-height: 300px;
  flex-shrink: 0;
  aspect-ratio: 1 / 1;
  
  @media (max-width: 800px) {
    width: 280px;
    height: 280px;
    min-width: 280px;
    min-height: 280px;
    max-width: 280px;
    max-height: 280px;
  }
`;

const HomeCard = ({ image, rotate, onMouseEnter, onMouseLeave, onClick, label, isActive }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 800);
  const [isHovered, setIsHovered] = useState(false);
  const hoverAudioRef = useRef(null);
  const clickAudioRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 800);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Créer les éléments audio au montage du composant
    hoverAudioRef.current = new Audio('/sound/sound-4.mp3');
    hoverAudioRef.current.volume = 0.5;
    hoverAudioRef.current.preload = 'auto';
    
    clickAudioRef.current = new Audio('/sound/sound-2.mp3');
    clickAudioRef.current.volume = 0.5;
    clickAudioRef.current.preload = 'auto';
    
    // Essayer de charger le son au clic pour activer l'audio dans le navigateur
    const enableAudio = () => {
      if (clickAudioRef.current) {
        clickAudioRef.current.play().then(() => {
          clickAudioRef.current.pause();
          clickAudioRef.current.currentTime = 0;
        }).catch(() => {
          // Ignorer les erreurs silencieusement
        });
      }
    };
    
    // Activer l'audio au premier clic sur la page
    document.addEventListener('click', enableAudio, { once: true });
    
    return () => {
      document.removeEventListener('click', enableAudio);
      // Nettoyer l'audio lors du démontage
      if (hoverAudioRef.current) {
        hoverAudioRef.current.pause();
        hoverAudioRef.current = null;
      }
      if (clickAudioRef.current) {
        clickAudioRef.current.pause();
        clickAudioRef.current = null;
      }
    };
  }, []);

  const handleMouseMove = (e) => {
    if (!isMobile) {
      const rect = e.target.getBoundingClientRect();
      const offsetX = (e.clientX - rect.left - rect.width / 10) / 20; 
      const offsetY = (e.clientY - rect.top - rect.height / 10) / 20;
      setPosition({ x: offsetX, y: offsetY });
    }
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
    // Sur mobile, ne pas désactiver l'overlay si la card est active
    if (!isMobile || !isActive) {
      setIsHovered(false);
    }
    if (onMouseLeave) {
      onMouseLeave();
    }
  };

  useEffect(() => {
    // Sur mobile, si la card est active (centrée), afficher l'overlay
    if (isMobile && isActive) {
      setIsHovered(true);
      if (onMouseEnter) {
        onMouseEnter();
      }
    } else if (isMobile && !isActive) {
      setIsHovered(false);
    }
  }, [isMobile, isActive, onMouseEnter]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (onMouseEnter) {
      onMouseEnter();
    }
    
    // Jouer le son au survol (seulement sur desktop)
    if (!isMobile && hoverAudioRef.current) {
      hoverAudioRef.current.currentTime = 0; // Réinitialiser le son pour pouvoir le rejouer
      hoverAudioRef.current.play().catch(error => {
        // Gérer les erreurs de lecture silencieusement
        console.log('Erreur de lecture audio au survol:', error);
      });
    }
  };

  const handleClick = (e) => {
    console.log('Click detected, playing sound...');
    
    // Jouer le son au clic
    if (clickAudioRef.current) {
      clickAudioRef.current.currentTime = 0;
      const playPromise = clickAudioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log('Sound played successfully');
          })
          .catch(error => {
            console.error('Error playing click sound:', error);
          });
      }
    } else {
      console.error('Click audio ref is null');
    }
    
    // Appeler la fonction onClick originale
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <CardWrapper>
      <CardContainer
        $image={image}
        $rotate={rotate}
        $translateX={position.x}
        $translateY={position.y}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      >
        {label && (isHovered || (isMobile && isActive)) && (
          <LabelOverlay $show={isHovered || (isMobile && isActive)}>
            <LabelText>{label}</LabelText>
          </LabelOverlay>
        )}
      </CardContainer>
    </CardWrapper>
  );
};

export default HomeCard;