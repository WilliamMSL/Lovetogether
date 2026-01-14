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
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import SettingsModal from './components/SettingsModal';
import UsersModal from './components/UsersModal';
import styled from 'styled-components';
import { SpeedInsights } from "@vercel/speed-insights/react"

const AppWrapper = styled.div`
  width: 100%;
  height: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: ${props => props.$bgColor};
  transition: background-color 0.4s cubic-bezier(0.4, 0, 0.2, 1);
`;

const ContentWrapper = styled.div`
  flex: 1;
  width: 100%;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
`;

// Composant interne qui utilise le thème
const ThemedApp = () => {
  const { theme } = useTheme();
  const [backgroundColor, setBackgroundColor] = useState(null);

  // Utiliser la couleur du thème si pas de couleur personnalisée
  const bgColor = backgroundColor || theme.background;

  return (
    <AppWrapper $bgColor={bgColor}>
      <GrainProvider>
        <SettingsModalProvider>
          <UsersModalProvider>
            <CardProvider>
              <ContentWrapper>
                <Router>
                  <Routes>
                    <Route path="/" element={<MainContent backgroundColor={bgColor} setBackgroundColor={setBackgroundColor} />} />
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

const App = () => {
  return (
    <ThemeProvider>
      <ThemedApp />
    </ThemeProvider>
  );
};

export default App;