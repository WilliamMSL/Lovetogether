import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainContent from './components/MainContent';
import Generator from './components/Generator';
import ActionVerite from './components/ActionVerite';
import Roleplay from './components/Roleplay';
import Roulette from './components/Roulette';
import Layout from './components/Layout';
import { CardProvider } from './components/CardContext';
import { SettingsModalProvider } from './contexts/SettingsModalContext';
import { UsersModalProvider } from './contexts/UsersModalContext';
import { GrainProvider } from './contexts/GrainContext';
import SettingsModal from './components/SettingsModal';
import UsersModal from './components/UsersModal';
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
      <GrainProvider>
        <SettingsModalProvider>
          <UsersModalProvider>
            <CardProvider>
              <ContentWrapper>
                <Router>
                  <Routes>
                    <Route path="/" element={<MainContent backgroundColor={backgroundColor} setBackgroundColor={setBackgroundColor} />} />
                    <Route path="/generator" element={<Layout><Generator /></Layout>} />
                    <Route path="/action-verite" element={<Layout><ActionVerite /></Layout>} />
                    <Route path="/roleplay" element={<Layout><Roleplay /></Layout>} />
                    <Route path="/roulette" element={<Layout><Roulette /></Layout>} />
                  </Routes>
                </Router>
              </ContentWrapper>
              <SettingsModal />
              <UsersModal />
            </CardProvider>
          </UsersModalProvider>
        </SettingsModalProvider>
      </GrainProvider>
      <SpeedInsights/>
    </AppWrapper>
  );
};

export default App;