import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainContent from './components/MainContent';
import Generator from './components/Generator';
import ActionVerite from './components/ActionVerite';
import Roleplay from './components/Roleplay';
import { CardProvider } from './components/CardContext';
import styled from 'styled-components';
import { SpeedInsights } from "@vercel/speed-insights/react"

const SmallScreenMessage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background-color: white;
  color: black;
  font-size: 18px;
  text-align: center;
  padding: 20px;
`;

const App = () => {
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 500);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  if (isSmallScreen) {
    return (
      <SmallScreenMessage>
        Cette application n'est pas disponible sur les petits écrans.
      </SmallScreenMessage>
    );
  }

  return (
    <CardProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MainContent backgroundColor={backgroundColor} setBackgroundColor={setBackgroundColor} />} />
          <Route path="/generator" element={<Generator />} />
          <Route path="/action-verite" element={<ActionVerite />} />
          <Route path="/roleplay" element={<Roleplay />} />
        </Routes>
      </Router>
      <SpeedInsights/>
    </CardProvider>
    
  );
};

export default App;