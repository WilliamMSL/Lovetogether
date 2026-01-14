import React, { useState, useEffect, useRef, useMemo, useContext } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import useButtonSound from '../hooks/useButtonSound';
import GrainEffect from './GrainEffect';
import PageHeader from './PageHeader';
import { UserContext } from './UserContext';
import TruthDareCard from './TruthDareCard';
import dareImage from '../images/love.png';
import truthImage from '../images/junebaby.png';
import logger from '../utils/logger';
import { ReactComponent as XIcon } from '../images/assets/icons/x.svg';
import { useUsersModal } from '../contexts/UsersModalContext';
import background1 from '../images/backgrounds/background-1.png';
import background2 from '../images/backgrounds/background-2.png';
import background3 from '../images/backgrounds/background-3.png';
import background4 from '../images/backgrounds/background-4.png';
import { fetchRandomTruthOrDare } from '../lib/supabaseService';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  width: 100vw;
  padding: 2rem;
  background-color: var(--background);
  position: relative;
  overflow: hidden;
  z-index: 1;
  transition: background-color 0.4s cubic-bezier(0.4, 0, 0.2, 1);
`;

const WheelContainer = styled.div`
  position: relative;
  width: 600px;
  height: 600px;
  margin: 0 auto;

  @media (max-width: 800px) {
    width: 500px;
    height: 500px;
  }

  @media (max-width: 500px) {
    width: 350px;
    height: 350px;
  }
`;

const WheelCanvas = styled.canvas`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 4px solid var(--rouletteAccent);
  display: block;
  pointer-events: auto;
  cursor: pointer;
  transition: transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99), filter 0.2s, border-color 0.3s ease;
  box-shadow: inset 0 10px 30px rgba(0, 0, 0, 1);

  &:hover {
    filter: brightness(1.05);
  }

  &:active {
    filter: brightness(0.95);
  }
`;

const PointerWrapper = styled.div`
  position: absolute;
  top: 0px;
  left: 50%;
  transform: translateX(-50%);
  width: 70px;
  height: 85px;
  z-index: 10;
  pointer-events: none;
`;

const PointerCircle = styled.div`
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 50px;
  height: 50px;
  background: var(--rouletteAccent);
  border: 3px solid var(--rouletteAccent);
  border-radius: 50%;
  transition: background-color 0.3s ease, border-color 0.3s ease;
`;

const PointerTriangle = styled.div`
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  /* Triangle (bordure) */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 14px solid transparent;
    border-right: 14px solid transparent;
    border-top: 28px solid var(--rouletteAccent);
    transition: border-color 0.3s ease;
  }
  /* Triangle (intérieur) */
  &::after {
    content: '';
    position: absolute;
    top: 3px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 11px solid transparent;
    border-right: 11px solid transparent;
    border-top: 22px solid var(--rouletteAccent);
    transition: border-color 0.3s ease;
  }
`;

const CenterCircle = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90px;
  height: 90px;
  background: var(--rouletteAccent);
  border-radius: 50%;
  z-index: 5;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  transition: background-color 0.3s ease;
`;

const CardOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--modalOverlay);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999999 !important;
  backdrop-filter: blur(4px);
`;

const CloseButton = styled.button`
  position: absolute;
  top: 48px;
  right: 48px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--buttonBackground);
  border: none;
  border-radius: 14px;
  cursor: pointer;
  z-index: 10000000 !important;
  padding: 0;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: var(--buttonBackgroundHover);
    transform: scale(1.05);
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  svg {
    width: 20px;
    height: 20px;
    color: var(--text);
    stroke: var(--text) !important;
    
    path, line, circle, rect, polyline, polygon {
      stroke: var(--text) !important;
    }
  }
`;

const CardContainer = styled.div`
  position: relative;
  width: 392px;
  height: 548px;
  
  /* S'assurer que le CardWrapper enfant est centré */
  & > div {
    position: relative !important;
    left: 0 !important;
    top: 0 !important;
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

const Button = styled.button`
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

// Mapper le genre vers le paramètre API
const genderToApiPlayer = (gender) => {
  switch (gender) {
    case 'female': return 'firstName1';
    case 'male': return 'firstName2';
    default: return 'all';
  }
};

const buildPlayerParams = (playerName, playerGender, playersWithGender) => {
  // Mapper le genre vers le paramètre API
  const mappedPlayer = genderToApiPlayer(playerGender);
  
  // Trouver un autre joueur au hasard
  const otherPlayers = playersWithGender.filter(p => {
    const name = typeof p === 'string' ? p : p.name;
    return name !== playerName;
  });
  
  let otherPlayer = '';
  if (otherPlayers.length > 0) {
    const randomIndex = Math.floor(Math.random() * otherPlayers.length);
    const other = otherPlayers[randomIndex];
    otherPlayer = typeof other === 'string' ? other : other.name || '';
  } else if (playersWithGender.length > 0) {
    const first = playersWithGender[0];
    otherPlayer = typeof first === 'string' ? first : first.name || '';
  }

  return { mappedPlayer, otherPlayer };
};

const formatTemplate = (template, player, otherPlayer) => {
  if (!template) {
    return '';
  }

  const normalizedTemplate = template.charAt(0).toLowerCase() + template.slice(1);

  return normalizedTemplate
    .replace(/{Currentplayer}/gi, player)
    .replace(/{AutrePlayer}/gi, otherPlayer);
};

const Roulette = () => {
  const { firstName1, firstName2, players, playersWithGender, selectedToys } = useContext(UserContext);
  const canvasRef = useRef(null);
  const cardRef = useRef(null);
  const imagesRef = useRef({});
  const [currentRotation, setCurrentRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [showCard, setShowCard] = useState(false);
  const [cardText, setCardText] = useState('');
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [cardType, setCardType] = useState('dare'); // 'truth' ou 'dare'
  const [currentEmoji, setCurrentEmoji] = useState('🍒');
  const [cardPlayer, setCardPlayer] = useState(''); // Joueur pour la carte affichée
  
  // Son pour les boutons
  const playButtonSound = useButtonSound();
  const { openUsersModal } = useUsersModal();
  
  // Liste des emojis pour l'animation
  const emojis = ['🍒', '🎰', '🤗', '💋', '👄', '❤️', '💕', '🔥', '✨', '💖'];
  
  // Calculer le joueur actuel à partir de l'index (nom pour affichage)
  const currentPlayer = players && players.length > 0 ? players[currentPlayerIndex] : (firstName1 || '');
  
  // Obtenir le genre du joueur actuel
  const currentPlayerData = playersWithGender && playersWithGender.length > 0 
    ? playersWithGender[currentPlayerIndex] 
    : null;
  const currentPlayerGender = currentPlayerData?.gender || 'mixed';

  const options = useMemo(() => [
    { text: "Hard", color: "#EE6C8F", image: background1 },
    { text: "Verite", color: "#2E5C9E", image: background2 },
    { text: "Kiss", color: "#B89BC6", image: background3 },
    { text: "Spin again", color: "#EF4136", image: background4 },
    { text: "Mes regles", color: "#E88BB5", image: background1 },
    { text: "Foreplay", color: "#4A7BB7", image: background2 },
    { text: "Verite", color: "#A88CB8", image: background3 },
    { text: "Sensuel", color: "#F4A460", image: background4 }
  ], []);

  // Mapping des options vers les intensités API et le type
  const optionIntensityMap = useMemo(() => ({
    'Hard': { intensity: 'high', type: 'dare' },        // Main Event (high intensity)
    'Sensuel': { intensity: 'medium', type: 'dare' },   // Sensuel (medium intensity)
    'Foreplay': { intensity: 'low', type: 'dare' },     // Foreplay (low intensity)
    'Verite': { intensity: 'low', type: 'truth' },      // Vérité (truth)
    // 'Spin again' n'est pas mappé = relance automatiquement
  }), []);

  useEffect(() => {
    // Réinitialiser l'index si la liste de joueurs change
    if (players && players.length > 0) {
      setCurrentPlayerIndex(0);
    } else if (firstName1) {
      setCurrentPlayerIndex(0);
    }
  }, [firstName1, firstName2, players]);

  useEffect(() => {
    // Appliquer directement la rotation si la carte doit être affichée retournée
    if (showCard && isCardFlipped && cardRef.current) {
      const inner = cardRef.current.querySelector('.inner');
      if (inner) {
        inner.style.transform = 'rotateY(180deg)';
        inner.style.transition = 'none'; // Pas d'animation
      }
    }
  }, [showCard, isCardFlipped]);

  const loadImage = (src, index) => {
    return new Promise((resolve, reject) => {
      if (!src) {
        resolve(null);
        return;
      }
      
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        imagesRef.current[index] = img;
        resolve(img);
      };
      img.onerror = () => {
        console.warn(`Failed to load image for option ${index}: ${src}`);
        resolve(null);
      };
      img.src = src;
    });
  };

  const drawWheel = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    
    // La taille logique est la taille du canvas divisée par le DPR
    const logicalSize = canvas.width / dpr;
    const centerX = logicalSize / 2;
    const centerY = logicalSize / 2;
    const radius = logicalSize / 2;
    const sliceAngle = (2 * Math.PI) / options.length;

    // Nettoyer le canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    options.forEach((option, index) => {
      const startAngle = index * sliceAngle - Math.PI / 2;
      const endAngle = startAngle + sliceAngle;

      // Dessiner un arc simple sans ondulation
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = option.color;
      ctx.fill();

      // Bordure entre les sections
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Dessiner l'image si disponible - remplir toute la section
      const img = imagesRef.current[index];
      if (img && option.image) {
        ctx.save();
        
        // Créer un clipping path pour la section
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.clip();

        // Calculer les dimensions pour remplir complètement la section
        // On utilise une taille suffisamment grande pour couvrir toute la section
        const imageSize = radius * 2; // Taille suffisante pour couvrir toute la section
        const imageX = centerX - imageSize / 2;
        const imageY = centerY - imageSize / 2;
        
        // Dessiner l'image en remplissant complètement la section (le clipping fera le reste)
        ctx.drawImage(
          img,
          imageX,
          imageY,
          imageSize,
          imageSize
        );
        
        ctx.restore();
      }

      // Ajouter le texte
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(startAngle + sliceAngle / 2);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Texte principal
      ctx.fillStyle = '#fff';
      const fontSize = Math.max(15, radius * 0.17);
      ctx.font = `bold ${fontSize}px Switzerland, sans-serif`;
      
      // Centrer le texte au centre de la section
      // Position X au milieu de la section (entre le centre et le bord)
      const textRadius = radius * 0.60;
      ctx.fillText(option.text, textRadius, 20);

      ctx.restore();
    });

    // Dessiner l'ombre inversée autour de la roulette
    ctx.save();
    // Créer un dégradé radial pour l'ombre inversée
    // Le dégradé va du centre vers le bord, avec une ombre plus prononcée sur les bords
    const shadowGradient = ctx.createRadialGradient(
      centerX, centerY, radius * 0.6,
      centerX, centerY, radius
    );
    shadowGradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
    shadowGradient.addColorStop(0.7, 'rgba(0, 0, 0, 0.1)');
    shadowGradient.addColorStop(1, 'rgba(0, 0, 0, 0.5)');
    
    // Dessiner l'ombre uniquement sur le bord extérieur
    ctx.globalCompositeOperation = 'multiply';
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.fillStyle = shadowGradient;
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
    ctx.restore();
  };

  // Charger les images au montage du composant
  useEffect(() => {
    const loadAllImages = async () => {
      await Promise.all(
        options.map((option, index) => loadImage(option.image, index))
      );
      drawWheel();
    };
    
    loadAllImages();
  }, [options]);

  const getSelectedOption = (rotation) => {
    // Normaliser la rotation entre 0 et 360
    const normalizedRotation = ((rotation % 360) + 360) % 360;
    
    // Calculer l'angle de chaque section
    const sectionAngle = 360 / options.length;
    
    // Les sections sont dessinées en commençant à -90° (en haut), dans le sens horaire
    // Section 0: de -90° à -45° (centre à -67.5°)
    // Section 1: de -45° à 0° (centre à -22.5°)
    // etc.
    
    // Quand le canvas tourne de X° dans le sens horaire, ce qui était à angle A est maintenant à (A + X)°
    // Le pointer pointe vers 0° (en haut)
    // On cherche quelle section contient maintenant 0° après rotation
    // Ce qui contient 0° après rotation est ce qui contenait (-X)° avant rotation
    
    // L'angle avant rotation qui est maintenant à 0°
    const angleBeforeRotation = (360 - normalizedRotation) % 360;
    
    // Convertir cet angle en index de section
    // Les sections commencent à -90°, donc on ajoute 90° pour obtenir l'offset depuis le début
    const angleFromSectionStart = (angleBeforeRotation + 90) % 360;
    
    // Calculer l'index
    let selectedIndex = Math.floor(angleFromSectionStart / sectionAngle) % options.length;
    
    // Appliquer un offset de correction de -2 sections
    // (Le calcul théorique a un décalage constant de +2)
    selectedIndex = (selectedIndex - 2 + options.length) % options.length;
    
    logger.log('Roulette - getSelectedOption debug:', {
      normalizedRotation,
      angleBeforeRotation,
      angleFromSectionStart,
      sectionAngle,
      selectedIndex,
      selectedText: options[selectedIndex]?.text,
      allOptions: options.map((o, i) => ({ index: i, text: o.text }))
    });
    
    return options[selectedIndex];
  };

  const fetchAction = async (playerName, playerGender, intensity, type = 'dare') => {
    try {
      logger.log("Roulette - Selected toys from context:", selectedToys);
      logger.log("Roulette - Player gender:", playerGender);
      
      const playersData = playersWithGender && playersWithGender.length > 0 
        ? playersWithGender 
        : [{ name: firstName1, gender: 'mixed' }, { name: firstName2, gender: 'mixed' }].filter(p => p.name);
      
      const { mappedPlayer, otherPlayer } = buildPlayerParams(playerName, playerGender, playersData);
      
      // Préparer les toys pour Supabase (array)
      // On envoie directement les toys sélectionnés, le service gère le filtrage
      const toysArray = Array.isArray(selectedToys) ? selectedToys : [];
      
      logger.log("🎯 Roulette - Request params:", {
        player: mappedPlayer,
        selectedToys: toysArray,
        intensity
      });

      // Appel Supabase
      const response = await fetchRandomTruthOrDare({
        type,
        player: mappedPlayer,
        toys: toysArray,
        intensity: intensity || 'low' // Par défaut 'low' pour les vérités
      });

      if (response && response.template) {
        const { template } = response;
        logger.log('Roulette - Formatting template:', {
          template,
          playerName,
          otherPlayer,
          firstName1,
          firstName2
        });
        const formatted = formatTemplate(template, playerName, otherPlayer);
        logger.log('Roulette - Formatted result:', formatted);
        return formatted;
      } else {
        logger.error('Unexpected response format:', response);
        throw new Error('Réponse inattendue');
      }
    } catch (error) {
      logger.error('Error fetching action:', error);
      throw error;
    }
  };

  const spin = async () => {
    if (isSpinning) return;

    // Vérifier qu'il y a au moins 1 joueur
    const playersList = players && players.length > 0 ? players : [firstName1, firstName2].filter(p => p);
    if (playersList.length === 0) {
      openUsersModal();
      return;
    }

    setIsSpinning(true);
    setShowCard(false);
    setCardText('');
    setIsCardFlipped(false);

    // Démarrer l'animation des emojis
    let emojiIndex = 0;
    const emojiInterval = setInterval(() => {
      setCurrentEmoji(emojis[emojiIndex % emojis.length]);
      emojiIndex++;
    }, 100); // Changer d'emoji toutes les 100ms

    // Rotation aléatoire (5-8 tours complets + angle aléatoire)
    const randomSpins = 5 + Math.random() * 3;
    const randomAngle = Math.random() * 360;
    const totalRotation = (randomSpins * 360) + randomAngle;
    const newRotation = currentRotation + totalRotation;

    setCurrentRotation(newRotation);

    // Mettre à jour le style du canvas pour la rotation
    if (canvasRef.current) {
      canvasRef.current.style.transform = `rotate(${newRotation}deg)`;
    }

    // Après l'animation (4 secondes pour correspondre à la transition CSS), vérifier quelle option a été sélectionnée
    setTimeout(async () => {
      clearInterval(emojiInterval); // Arrêter l'animation des emojis
      setCurrentEmoji('🍒'); // Remettre l'emoji par défaut
      setIsSpinning(false);
      
      const selectedOption = getSelectedOption(newRotation);
      logger.log('Roulette - Selected option:', selectedOption);
      logger.log('Roulette - Number of options:', options.length);
      logger.log('Roulette - Final rotation:', newRotation);
      
      const optionConfig = optionIntensityMap[selectedOption.text];
      logger.log('Roulette - Option config:', optionConfig);
      
      // Vérifier si c'est une option qui ouvre une carte
      if (optionConfig) {
        try {
          const { intensity, type } = optionConfig;
          logger.log('Roulette - Fetching with type:', type, 'intensity:', intensity);
          // Sauvegarder le joueur actuel AVANT de changer
          const playerForCard = currentPlayer;
          // Récupérer l'action ou la vérité selon le type
          const actionText = await fetchAction(playerForCard, currentPlayerGender, intensity, type);
          setCardText(actionText);
          setCardType(type);
          setCardPlayer(playerForCard); // Sauvegarder le joueur pour la carte
          
          // Afficher la carte directement retournée
          setIsCardFlipped(true);
          setShowCard(true);
        } catch (error) {
          logger.error('Error fetching action:', error);
          setShowCard(false);
        }
      }
      
      // Passer au joueur suivant après le lancement
      if (players && players.length > 0) {
        setCurrentPlayerIndex(prevIndex => (prevIndex + 1) % players.length);
      } else if (firstName1 && firstName2) {
        setCurrentPlayerIndex(prevIndex => (prevIndex + 1) % 2);
      }
    }, 4000);
  };

  const handleNextPlayer = () => {
    // Passer au joueur suivant dans la liste
    if (players && players.length > 0) {
      setCurrentPlayerIndex(prevIndex => (prevIndex + 1) % players.length);
    } else if (firstName1 && firstName2) {
      setCurrentPlayerIndex(prevIndex => (prevIndex + 1) % 2);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const updateCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const size = Math.min(rect.width, rect.height, 600);
      
      // Définir la taille du canvas en pixels physiques
      canvas.width = size * dpr;
      canvas.height = size * dpr;
      
      // Ajuster le contexte pour le DPR
      const ctx = canvas.getContext('2d');
      ctx.scale(dpr, dpr);
      
      // Redessiner la roue
      drawWheel();
    };

    updateCanvas();
    
    // Réajuster si la fenêtre change de taille
    const handleResize = () => {
      updateCanvas();
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [options]);

  const handleCardClose = () => {
    // Réinitialiser la rotation de la carte
    if (cardRef.current) {
      const inner = cardRef.current.querySelector('.inner');
      if (inner) {
        inner.style.transform = 'rotateY(0deg)';
        inner.style.transition = ''; // Remettre la transition par défaut
      }
    }
    setShowCard(false);
    setCardText('');
    setIsCardFlipped(false);
    setCardType('dare');
    setCardPlayer('');
  };

  return (
    <Container>
      <PageHeader />
      <GrainEffect />
      <WheelContainer>
        <PointerWrapper>
          <PointerTriangle />
        </PointerWrapper>
        <WheelCanvas
          ref={canvasRef}
          width={600}
          height={600}
          onClick={isSpinning ? undefined : spin}
          style={{ cursor: isSpinning ? 'not-allowed' : 'pointer' }}
        />
        <CenterCircle>
          {currentEmoji}
        </CenterCircle>
      </WheelContainer>
      <ButtonContainer>
        <CombinedButton>
          <Button onClick={() => { playButtonSound(); handleNextPlayer(); }}>
            <span role="img" aria-label="Tour">👤</span> À ton tour, {currentPlayer}
          </Button>
          <Divider />
          <Button onClick={() => { playButtonSound(); spin(); }} disabled={isSpinning}>
            {isSpinning ? 'En cours...' : 'Lancer'}
          </Button>
        </CombinedButton>
      </ButtonContainer>
      
      {showCard && createPortal(
        <CardOverlay onClick={handleCardClose}>
          <CloseButton onClick={handleCardClose}>
            <XIcon />
          </CloseButton>
          <CardContainer 
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)'
            }}
          >
            <TruthDareCard
              cardRef={cardRef}
              image={cardType === 'truth' ? truthImage : dareImage}
              onClick={handleCardClose}
              isClicked={isCardFlipped}
              currentPlayer={cardPlayer}
              randomText={cardText}
            />
          </CardContainer>
        </CardOverlay>,
        document.body
      )}
    </Container>
  );
};

export default Roulette;

