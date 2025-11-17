import React, { useEffect } from 'react';
import { useGrain } from '../contexts/GrainContext';

const GrainEffect = () => {
  const { grainEnabled } = useGrain();

  useEffect(() => {
    if (!grainEnabled) {
      // Si le grain est désactivé, nettoyer l'effet existant
      const container = document.getElementById('grain-container');
      if (container) {
        container.style.display = 'none';
      }
      return;
    }

    console.log("Grained.js initialisation");
    const script = document.createElement('script');
    script.src = '/grained.min.js';
    script.onload = () => {
      console.log("Grained.js loaded");
      if (window.grained) {
        console.log("Applying grained effect");
        const container = document.getElementById('grain-container');
        if (container) {
          container.style.display = 'block';
        }
        window.grained('#grain-container', {
          animate: true,
          patternWidth: 200,
          patternHeight: 200,
          grainOpacity: 0.06,
          grainDensity: 1,
          grainWidth: 1,
          grainHeight: 1,
        });
      } else {
        console.log("Grained.js not found");
      }
    };
    document.head.appendChild(script);

    return () => {
      // Cleanup: retirer le script si le composant est démonté
      const existingScript = document.querySelector('script[src="/grained.min.js"]');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, [grainEnabled]);

  if (!grainEnabled) {
    return null;
  }

  return <div id="grain-container" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }} />;
};

export default GrainEffect;