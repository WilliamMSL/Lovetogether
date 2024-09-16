import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const CardContainer = styled.div`
  width: 392px;
  height: ${props => props.isMobile ? '254px' : '548px'};
  background-image: url(${props => props.image});
  background-size: cover;
  background-position: center;
  border-radius: 16px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translate(${props => props.translateX}px, ${props => props.translateY}px) rotate(${props => props.rotate || '0deg'});
  transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.6s ease;
  cursor: pointer;
  z-index: 1;

  &:hover {
    cursor: wait; 
  }
`;

const CardWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const HomeCard = ({ image, rotate, onMouseEnter, onMouseLeave, onClick }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 800);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 800);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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
    onMouseLeave();
  };

  return (
    <CardWrapper>
      <CardContainer
        image={image}
        rotate={rotate}
        translateX={position.x}
        translateY={position.y}
        onMouseMove={handleMouseMove}
        onMouseEnter={onMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
        isMobile={isMobile}
      >
        {/* Vous pouvez ajouter du contenu ici si nécessaire */}
      </CardContainer>
    </CardWrapper>
  );
};

export default HomeCard;