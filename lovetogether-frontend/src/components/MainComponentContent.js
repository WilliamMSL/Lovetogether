import React, { useState } from 'react';
import EntranceAnimation from './EntranceAnimation';
import MainContent from './MainContent';

const MainComponentContent = () => {
  const [hasEntered, setHasEntered] = useState(false);
  const [animateLogo, setAnimateLogo] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');

  return (
    <>
      {!hasEntered ? (
        <EntranceAnimation
          onEnterComplete={() => setHasEntered(true)}
          setAnimateLogo={setAnimateLogo}
        />
      ) : (
        <MainContent
          backgroundColor={backgroundColor}
          setBackgroundColor={setBackgroundColor}
          animateLogo={animateLogo}
        />
      )}
    </>
  );
};

export default MainComponentContent;
