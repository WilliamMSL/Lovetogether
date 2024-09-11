import React, { useEffect } from 'react';
import { gsap } from 'gsap';
import styled from 'styled-components';

const TransitionWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 9999;
`;

const LineSVG = styled.svg`
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  width: 100%;
  height: 5px;
`;

const Line = ({ onComplete }) => {
  useEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo(
      '.line-path',
      { strokeDasharray: '1000', strokeDashoffset: '1000' },
      { strokeDashoffset: '0', duration: 1, ease: 'power1.inOut' }
    ).to('.line-path', {
      stroke: 'none',
      duration: 0.5,
      delay: 0.3,
      onComplete: onComplete,
    });
  }, [onComplete]);

  return (
    <TransitionWrapper>
      <LineSVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 5">
        <path className="line-path" d="M0,2.5 L800,2.5" stroke="#6BD6D3" strokeWidth="5" />
      </LineSVG>
    </TransitionWrapper>
  );
};

export default Line;