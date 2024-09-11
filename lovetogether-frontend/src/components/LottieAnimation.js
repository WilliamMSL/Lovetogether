import React, { useEffect } from 'react';
import Lottie from 'lottie-react';
import animationData from '../test.json';
import styled from 'styled-components';

const LottieWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: transparent;
  z-index: 9999;
`;

const LottieAnimation = ({ onComplete }) => {
  useEffect(() => {
    console.log('LottieAnimation mounted');
    
    return () => {
      console.log('LottieAnimation unmounted');
    };
  }, []);

  return (
    <LottieWrapper>
      <Lottie
        animationData={animationData}
        loop={false}
        onComplete={() => {
          console.log('Lottie animation completed');
          if (onComplete) {
            console.log('onComplete callback is defined, calling onComplete');
            onComplete();
          } else {
            console.log('onComplete callback is not defined');
          }
        }}
        style={{ width: '50%', height: '50%' }}
      />
    </LottieWrapper>
  );
};

export default LottieAnimation;
