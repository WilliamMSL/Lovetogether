import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import HomeCard from './HomeCard';
import styled from 'styled-components';
import useEmblaCarousel from 'embla-carousel-react';
import { ReactComponent as ChevronLeftIcon } from '../images/assets/icons/chevron-left.svg';
import { ReactComponent as ChevronRightIcon } from '../images/assets/icons/chevron-right.svg';

// Import des images
import whiteLogoSvg from '../images/logo-truth.svg';
import whiteLogo10Svg from '../images/logo-role.svg';
import whiteLogo20Svg from '../images/logo-positions.svg';

import background1 from '../images/backgrounds/background-1.png';
import background2 from '../images/backgrounds/background-2.png';
import background3 from '../images/backgrounds/background-3.png';
import background4 from '../images/backgrounds/background-4.png';

// ============== DESKTOP STYLES ==============
const DesktopContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 20px;
  position: relative;
  z-index: 1000;
  width: 100%;
  
  @media (max-width: 800px) {
    display: none;
  }
`;

const StyledHomeCardDesktop = styled(HomeCard)`
  position: relative;
  z-index: 1001;
  flex-shrink: 0;
`;

// ============== MOBILE CAROUSEL STYLES ==============
const MobileContainer = styled.div`
  display: none;
  
  @media (max-width: 800px) {
    display: block;
    position: relative;
    width: 100%;
    overflow: visible;
  }
`;

const EmblaViewport = styled.div`
  overflow: visible;
  width: 100%;
`;

const EmblaContainer = styled.div`
  display: flex;
  user-select: none;
  -webkit-touch-callout: none;
  -khtml-user-select: none;
  -webkit-tap-highlight-color: transparent;
`;

const EmblaSlide = styled.div`
  position: relative;
  flex: 0 0 auto;
  min-width: 0;
  padding: 0 10px;
`;

const SlideInner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform: scale(${props => props.$isSelected ? 1 : 0.88});
  opacity: ${props => props.$isSelected ? 1 : 0.6};
  flex-shrink: 0;
`;

const NavButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: transparent;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    transform: translateY(-50%) scale(1.1);
  }
  
  &:active:not(:disabled) {
    transform: translateY(-50%) scale(0.95);
  }
  
  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
  
  svg {
    width: 24px;
    height: 24px;
    stroke: var(--text) !important;
    
    path, line, polyline {
      stroke: var(--text) !important;
    }
  }
`;

const PrevButton = styled(NavButton)`
  left: 15px;
`;

const NextButton = styled(NavButton)`
  right: 15px;
`;

const StyledHomeCardMobile = styled(HomeCard)`
  flex-shrink: 0;
`;

const cards = [
  { 
    image: background1, 
    label: 'Truth or Dare', 
    logo: whiteLogoSvg,
    path: '/action-verite' 
  },
  { 
    image: background2, 
    label: 'Positions', 
    logo: whiteLogo10Svg,
    path: '/generator' 
  },
  { 
    image: background3, 
    label: 'Roleplay', 
    logo: whiteLogo20Svg,
    path: '/roleplay' 
  },
  { 
    image: background4, 
    label: 'Roulette', 
    logo: whiteLogo20Svg,
    path: '/roulette' 
  },
];

const CardsWrapper = ({ setLogoSrc, setShowBackgroundImage, onCardHover }) => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 800);
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'center',
    skipSnaps: false,
    dragFree: false,
  });

  // Detect mobile
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 800);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    const index = emblaApi.selectedScrollSnap();
    setSelectedIndex(index);
    
    // Mettre à jour le label sur mobile
    if (isMobile && onCardHover) {
      onCardHover(cards[index].label);
    }
  }, [emblaApi, isMobile, onCardHover]);

  useEffect(() => {
    if (!emblaApi) return;
    
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  // Initialiser le label au chargement sur mobile
  useEffect(() => {
    if (isMobile && onCardHover) {
      onCardHover(cards[0].label);
    }
  }, [isMobile, onCardHover]);

  // Desktop handlers
  const handleMouseEnter = (card) => {
    if (!isMobile && onCardHover) {
      onCardHover(card.label);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile && onCardHover) {
      onCardHover(null);
    }
  };

  // Mobile handler - remettre le label de la carte sélectionnée
  const handleMobileMouseLeave = () => {
    if (isMobile && onCardHover) {
      onCardHover(cards[selectedIndex].label);
    }
  };

  return (
    <>
      {/* Desktop: Layout original avec toutes les cartes visibles */}
      <DesktopContainer>
        {cards.map((card, index) => (
          <StyledHomeCardDesktop
            key={index}
            image={card.image}
            rotate="0deg"
            label={card.label}
            onMouseEnter={() => handleMouseEnter(card)}
            onMouseLeave={handleMouseLeave}
            onClick={() => navigate(card.path)}
            isActive={false}
          />
        ))}
      </DesktopContainer>

      {/* Mobile: Carousel Embla avec loop et centrage */}
      <MobileContainer>
        <PrevButton onClick={scrollPrev} aria-label="Précédent">
          <ChevronLeftIcon />
        </PrevButton>
        
        <EmblaViewport ref={emblaRef}>
          <EmblaContainer>
            {cards.map((card, index) => (
              <EmblaSlide key={index}>
                <SlideInner $isSelected={index === selectedIndex}>
                  <StyledHomeCardMobile
                    image={card.image}
                    rotate="0deg"
                    label={card.label}
                    onMouseLeave={handleMobileMouseLeave}
                    onClick={() => navigate(card.path)}
                    isActive={index === selectedIndex}
                  />
                </SlideInner>
              </EmblaSlide>
            ))}
          </EmblaContainer>
        </EmblaViewport>
        
        <NextButton onClick={scrollNext} aria-label="Suivant">
          <ChevronRightIcon />
        </NextButton>
      </MobileContainer>
    </>
  );
};

export default CardsWrapper;
