import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainContent from './components/MainContent';
import Generator from './components/Generator';
import ActionVerite from './components/ActionVerite';
import Roleplay from './components/Roleplay';
import { CardProvider } from './components/CardContext';
import styled from 'styled-components';
import { SpeedInsights } from "@vercel/speed-insights/react"

const AppWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const ContentWrapper = styled.div`
  flex: 1;
  width: 100%;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
`;

const App = () => {
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');

  return (
    <AppWrapper style={{ backgroundColor }}>
      <CardProvider>
        <ContentWrapper>
          <Router>
            <Routes>
              <Route path="/" element={<MainContent backgroundColor={backgroundColor} setBackgroundColor={setBackgroundColor} />} />
              <Route path="/generator" element={<Generator />} />
              <Route path="/action-verite" element={<ActionVerite />} />
              <Route path="/roleplay" element={<Roleplay />} />
            </Routes>
          </Router>
        </ContentWrapper>
      </CardProvider>
      <SpeedInsights/>
    </AppWrapper>
  );
};

export default App;