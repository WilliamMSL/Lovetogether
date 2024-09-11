import React, { useEffect } from 'react';

const GrainEffect = () => {
  useEffect(() => {
    console.log("Grained.js initialisation");
    const script = document.createElement('script');
    script.src = '/grained.min.js'; // Assurez-vous que ce chemin est correct
    script.onload = () => {
      console.log("Grained.js loaded");
      if (window.grained) {
        console.log("Applying grained effect");
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
  }, []);

  return <div id="grain-container" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }} />;
};

export default GrainEffect;