import { useEffect, useRef } from 'react';

const useButtonSound = (soundFile = '/sound/sound-4.mp3') => {
  const audioRef = useRef(null);

  useEffect(() => {
    // Créer l'élément audio au montage
    audioRef.current = new Audio(soundFile);
    audioRef.current.volume = 0.5;
    audioRef.current.preload = 'auto';

    return () => {
      // Nettoyer l'audio lors du démontage
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [soundFile]);

  const playSound = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(error => {
        console.log('Erreur de lecture audio:', error);
      });
    }
  };

  return playSound;
};

export default useButtonSound;

