import styled from 'styled-components';

// Effet lumière rose (pour le mode classique/rapide)
export const PinkLightEffect = styled.div`
  position: absolute;
  bottom: -150px;
  left: 50%;
  transform: translateX(-50%);
  width: 800px;
  height: 200px;
  background: radial-gradient(circle, rgba(255, 105, 180, 0.6) 0%, rgba(255, 105, 180, 0.3) 40%, transparent 70%);
  filter: blur(60px);
  z-index: 4;
  pointer-events: none;
  opacity: ${props => props.$show ? 1 : 0};
  transition: opacity 0.5s ease;
`;

// Effet lumière violet (pour le mode intense)
export const PurpleLightEffect = styled.div`
  position: absolute;
  bottom: -150px;
  left: 50%;
  transform: translateX(-50%);
  width: 800px;
  height: 200px;
  background: radial-gradient(circle, rgba(148, 0, 211, 0.8) 0%, rgba(148, 0, 211, 0.5) 40%, transparent 70%);
  filter: blur(60px);
  z-index: 4;
  pointer-events: none;
  opacity: ${props => props.$show ? 1 : 0};
  transition: opacity 0.5s ease;
`;

// Effet lumière rouge (pour ActionVerite - medium intensity)
export const RedLightEffect = styled.div`
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
  opacity: ${props => props.$show ? 1 : 0};
  transition: opacity 0.5s ease;
`;

// Effet lumière rouge foncé (pour ActionVerite - high intensity)
export const DarkRedLightEffect = styled.div`
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
  opacity: ${props => props.$show ? 1 : 0};
  transition: opacity 0.5s ease;
`;

// Effet lumière orange/dorée (pour le mode surprise)
export const GoldLightEffect = styled.div`
  position: absolute;
  bottom: -150px;
  left: 50%;
  transform: translateX(-50%);
  width: 800px;
  height: 200px;
  background: radial-gradient(circle, rgba(255, 215, 0, 0.6) 0%, rgba(255, 165, 0, 0.4) 40%, transparent 70%);
  filter: blur(60px);
  z-index: 4;
  pointer-events: none;
  opacity: ${props => props.$show ? 1 : 0};
  transition: opacity 0.5s ease;
`;
