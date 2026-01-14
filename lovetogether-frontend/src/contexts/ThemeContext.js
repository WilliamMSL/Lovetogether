import React, { createContext, useContext, useState, useEffect } from 'react';

// Définition des thèmes
export const themes = {
  light: {
    name: 'light',
    // Couleurs principales
    background: '#FFFFFF',
    backgroundSecondary: '#F8F8F8',
    backgroundTertiary: '#F3F3F3',
    
    // Texte
    text: '#000000',
    textSecondary: '#666666',
    textMuted: '#999999',
    
    // Éléments UI
    cardBackground: '#FFFFFF',
    cardBorder: 'rgba(0, 0, 0, 0.1)',
    buttonBackground: '#F3F3F3',
    buttonBackgroundHover: '#E8E8E8',
    buttonBackgroundActive: '#C3C3C3',
    
    // Modals
    modalOverlay: 'rgba(0, 0, 0, 0.8)',
    modalBackground: '#FFFFFF',
    
    // Inputs
    inputBackground: '#F3F3F3',
    inputBorder: '#C2C2C2',
    
    // Accents
    accent: '#EE6C8F',
    accentSecondary: '#B89BC6',
    
    // Roulette
    rouletteAccent: '#FFFFFF',
    
    // Tooltips
    tooltipBackground: '#000000',
    tooltipText: '#FFFFFF',
    
    // Shadows
    shadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    shadowHover: '0 8px 30px rgba(0, 0, 0, 0.15)',
    
    // Transitions
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  dark: {
    name: 'dark',
    // Couleurs principales - Palette sombre élégante
    background: '#0D0D0F',
    backgroundSecondary: '#151518',
    backgroundTertiary: '#1C1C21',
    
    // Texte
    text: '#FFFFFF',
    textSecondary: '#A0A0A8',
    textMuted: '#6B6B75',
    
    // Éléments UI
    cardBackground: '#1C1C21',
    cardBorder: 'rgba(255, 255, 255, 0.08)',
    buttonBackground: '#252529',
    buttonBackgroundHover: '#2D2D33',
    buttonBackgroundActive: '#3A3A42',
    
    // Modals
    modalOverlay: 'rgba(0, 0, 0, 0.9)',
    modalBackground: '#1C1C21',
    
    // Inputs
    inputBackground: '#252529',
    inputBorder: '#3A3A42',
    
    // Accents - Couleurs néon subtiles
    accent: '#FF6B9D',
    accentSecondary: '#C9A0DC',
    
    // Roulette - Même couleur que le fond des boutons
    rouletteAccent: '#252529',
    
    // Tooltips
    tooltipBackground: '#FFFFFF',
    tooltipText: '#000000',
    
    // Shadows - Glow effect pour le dark mode
    shadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
    shadowHover: '0 8px 30px rgba(255, 107, 157, 0.15)',
    
    // Transitions
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  }
};

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Initialiser depuis localStorage ou préférence système
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) {
      return JSON.parse(saved);
    }
    // Détecter la préférence système
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const theme = isDarkMode ? themes.dark : themes.light;

  // Sauvegarder la préférence
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    
    // Appliquer les variables CSS au root
    const root = document.documentElement;
    Object.entries(theme).forEach(([key, value]) => {
      if (key !== 'name') {
        root.style.setProperty(`--${key}`, value);
      }
    });
    
    // Classe pour le body
    document.body.classList.toggle('dark-mode', isDarkMode);
    document.body.classList.toggle('light-mode', !isDarkMode);
    
    // Meta theme-color pour mobile
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute('content', theme.background);
    }
  }, [isDarkMode, theme]);

  // Écouter les changements de préférence système
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      const saved = localStorage.getItem('darkMode');
      // Ne changer que si l'utilisateur n'a pas de préférence sauvegardée
      if (saved === null) {
        setIsDarkMode(e.matches);
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  return (
    <ThemeContext.Provider value={{ theme, isDarkMode, toggleTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;
