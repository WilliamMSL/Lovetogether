import { useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import timerSound from '../sound/gong.mp3';

const useTimer = (duration, timerRectangleRef) => {
  const [remainingTime, setRemainingTime] = useState(null);
  const [timerState, setTimerState] = useState('idle'); // 'idle' | 'running' | 'paused' | 'completed'
  const intervalRef = useRef(null);
  const animationRef = useRef(null);

  const playSound = () => {
    const audio = new Audio(timerSound);
    audio.play();
  };

  const cleanup = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (animationRef.current) {
      animationRef.current.kill();
      animationRef.current = null;
    }
  };

  const start = () => {
    const timeToUse = remainingTime || duration;
    if (!timeToUse || timeToUse <= 0) return;

    cleanup();
    setTimerState('running');

    // Animation GSAP
    const currentHeight = gsap.getProperty(timerRectangleRef.current, 'height');
    const currentHeightPercent = typeof currentHeight === 'string' 
      ? parseFloat(currentHeight) 
      : (currentHeight / timerRectangleRef.current.offsetHeight) * 100;

    animationRef.current = gsap.to(timerRectangleRef.current, {
      height: '100%',
      duration: timeToUse,
      ease: 'linear',
      onComplete: () => {
        setTimerState('completed');
        playSound();
      },
    });

    // Intervalle pour le décompte
    intervalRef.current = setInterval(() => {
      setRemainingTime((prevTime) => {
        if (prevTime <= 1) {
          cleanup();
          setTimerState('completed');
          playSound();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  };

  const pause = () => {
    setTimerState('paused');
    clearInterval(intervalRef.current);
    if (animationRef.current) {
      animationRef.current.pause();
    }
  };

  const resume = () => {
    setTimerState('running');
    if (animationRef.current) {
      animationRef.current.resume();
    }

    intervalRef.current = setInterval(() => {
      setRemainingTime((prevTime) => {
        if (prevTime <= 1) {
          cleanup();
          setTimerState('completed');
          playSound();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  };

  const reset = () => {
    cleanup();
    setRemainingTime(duration);
    setTimerState('idle');
    if (timerRectangleRef.current) {
      gsap.set(timerRectangleRef.current, { height: '0%' });
    }
  };

  const restart = () => {
    cleanup();
    setRemainingTime(duration);
    gsap.set(timerRectangleRef.current, { height: '0%' });
    setTimerState('running');

    animationRef.current = gsap.to(timerRectangleRef.current, {
      height: '100%',
      duration: duration,
      ease: 'linear',
      onComplete: () => {
        setTimerState('completed');
        playSound();
      },
    });

    intervalRef.current = setInterval(() => {
      setRemainingTime((prevTime) => {
        if (prevTime <= 1) {
          cleanup();
          setTimerState('completed');
          playSound();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  };

  const toggle = () => {
    if (timerState === 'idle') {
      start();
    } else if (timerState === 'running') {
      pause();
    } else if (timerState === 'paused') {
      resume();
    }
  };

  // Initialiser remainingTime quand duration change
  useEffect(() => {
    if (duration) {
      setRemainingTime(duration);
    }
  }, [duration]);

  // Cleanup au démontage
  useEffect(() => {
    return () => cleanup();
  }, []);

  return {
    remainingTime,
    timerState,
    start,
    pause,
    resume,
    reset,
    restart,
    toggle,
    isRunning: timerState === 'running',
    isPaused: timerState === 'paused',
    isIdle: timerState === 'idle',
    isCompleted: timerState === 'completed',
  };
};

export default useTimer;

