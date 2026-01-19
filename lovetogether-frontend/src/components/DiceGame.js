import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import GrainEffect from './GrainEffect';
import PageHeader from './PageHeader';
import useButtonSound from '../hooks/useButtonSound';
import { DiceBox } from '../dice-box/DiceBox';
import { PinkLightEffect, PurpleLightEffect, GoldLightEffect } from './LightEffects';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background-color: var(--background);
  position: relative;
  z-index: 1;
  transition: background-color 0.4s cubic-bezier(0.4, 0, 0.2, 1);
`;

const DiceContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 5;
  pointer-events: none;
  
  canvas {
    width: 100% !important;
    height: 100% !important;
    display: block !important;
  }
`;

const ButtonContainer = styled.div`
  position: absolute;
  bottom: 48px;
  display: flex;
  justify-content: center;
  width: 100%;
  z-index: 10;
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
`;

// Modes de jeu
const GAME_MODES = {
  classic: {
    name: 'Positions (oral)',
    notation: '1dbody+1dsex',
  },
  quick: {
    name: 'Positions',
    notation: '1dbody',
  },
  intense: {
    name: 'Which and where?',
    notation: '1daction+1dbody',
  },
};

const DiceGame = () => {
  const diceContainerRef = useRef(null);
  const diceBoxRef = useRef(null);
  const [isRolling, setIsRolling] = useState(false);
  const [gameMode, setGameMode] = useState('classic');
  const [initialized, setInitialized] = useState(false);
  
  const playButtonSound = useButtonSound();

  // Initialiser DiceBox avec gestion robuste
  useEffect(() => {
    let mounted = true;
    let resizeObserver = null;
    let resizeHandler = null;
    
    const waitForDimensions = (container) => {
      return new Promise((resolve) => {
        // Si le container a déjà des dimensions, résoudre immédiatement
        if (container.clientWidth > 0 && container.clientHeight > 0) {
          resolve();
          return;
        }
        
        // Sinon, observer les changements de taille
        resizeObserver = new ResizeObserver((entries) => {
          const { width, height } = entries[0].contentRect;
          if (width > 0 && height > 0) {
            resizeObserver.disconnect();
            resolve();
          }
        });
        resizeObserver.observe(container);
        
        // Timeout de sécurité (5 secondes)
        setTimeout(() => {
          resizeObserver?.disconnect();
          resolve();
        }, 5000);
      });
    };
    
    const initDiceBox = async () => {
      const container = diceContainerRef.current;
      if (!container) return;
      
      // Attendre que le container ait des dimensions valides
      await waitForDimensions(container);
      
      // Vérifier si le composant est toujours monté
      if (!mounted) return;
      
      try {
        console.log("🎲 DiceBox init - Container dimensions:", container.clientWidth, "x", container.clientHeight);
        
        const box = new DiceBox("#dice-container", {
          assetPath: "/",
          theme_customColorset: {
            name: "love_white",
            foreground: "#000000",
            background: "#FFFFFF",
            outline: "#333333",
            texture: "none",
            material: "plastic"
          },
          gravity_multiplier: 300,
          sounds: true,
          volume: 50,
          baseScale: 120,
          strength: 1,
          onRollComplete: (results) => {
            console.log("🎲 Roll complete:", results);
            setIsRolling(false);
          }
        });
        
        await box.initialize();
        
        // Vérifier encore si le composant est monté après l'init async
        if (!mounted) {
          // Cleanup si démonté pendant l'init
          box.clearDice();
          box.renderer?.dispose();
          const canvas = box.renderer?.domElement;
          canvas?.parentNode?.removeChild(canvas);
          return;
        }
        
        console.log("🎲 DiceBox initialized successfully");
        diceBoxRef.current = box;
        setInitialized(true);
        
        // Ajouter le handler de resize pour adapter le renderer
        resizeHandler = () => {
          if (diceBoxRef.current?.renderer && diceBoxRef.current?.setDimensions) {
            const newWidth = container.clientWidth;
            const newHeight = container.clientHeight;
            if (newWidth > 0 && newHeight > 0) {
              diceBoxRef.current.setDimensions({ x: newWidth / 2, y: newHeight / 2 });
            }
          }
        };
        window.addEventListener('resize', resizeHandler);
        
      } catch (error) {
        console.error("❌ Erreur initialisation DiceBox:", error);
      }
    };
    
    initDiceBox();
    
    // Cleanup complet lors du démontage
    return () => {
      mounted = false;
      resizeObserver?.disconnect();
      
      if (resizeHandler) {
        window.removeEventListener('resize', resizeHandler);
      }
      
      if (diceBoxRef.current) {
        // Arrêter les animations et supprimer les dés
        diceBoxRef.current.clearDice();
        
        // Libérer le contexte WebGL
        if (diceBoxRef.current.renderer) {
          diceBoxRef.current.renderer.dispose();
          
          // Retirer le canvas du DOM
          const canvas = diceBoxRef.current.renderer.domElement;
          if (canvas?.parentNode) {
            canvas.parentNode.removeChild(canvas);
          }
        }
        
        // Reset la ref
        diceBoxRef.current = null;
      }
      
      setInitialized(false);
    };
  }, []); // Pas de dépendance - s'exécute une seule fois au mount

  const rollDice = async () => {
    if (!diceBoxRef.current || isRolling) return;
    
    playButtonSound();
    setIsRolling(true);
    
    const mode = GAME_MODES[gameMode];
    console.log("🎲 Rolling dice with notation:", mode.notation);
    
    try {
      const result = await diceBoxRef.current.roll(mode.notation);
      console.log("🎲 Roll result:", result);
    } catch (error) {
      console.error("❌ Erreur lors du lancer:", error);
      setIsRolling(false);
    }
  };

  // Cycle entre les modes
  const cycleMode = () => {
    playButtonSound();
    const modes = Object.keys(GAME_MODES);
    const currentIndex = modes.indexOf(gameMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setGameMode(modes[nextIndex]);
  };

  return (
    <Container>
      <PageHeader />
      <GrainEffect />
      
      <DiceContainer id="dice-container" ref={diceContainerRef} />
      
      {/* Effets de lumière selon le mode */}
      <PinkLightEffect $show={gameMode === 'classic' || gameMode === 'quick'} />
      <PurpleLightEffect $show={gameMode === 'intense'} />
      <GoldLightEffect $show={gameMode === 'random'} />
      
      <ButtonContainer>
        <CombinedButton>
          <Button onClick={rollDice} disabled={isRolling || !initialized}>
            <span role="img" aria-label="dice">🎲</span> 
            {isRolling ? 'En cours...' : 'Lancer les dés'}
          </Button>
          <Divider />
          <Button onClick={cycleMode}>
            Mode ｜ {GAME_MODES[gameMode].name}
          </Button>
        </CombinedButton>
      </ButtonContainer>
    </Container>
  );
};

export default DiceGame;
