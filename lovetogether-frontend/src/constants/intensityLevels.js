import lowIntensityImage from '../images/logo-5.svg';
import mediumIntensityImage from '../images/whitelogo-10.svg';
import highIntensityImage from '../images/whitelogo-20.svg';

export const INTENSITY_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
};

export const INTENSITY_CONFIG = {
  [INTENSITY_LEVELS.LOW]: {
    backgroundColor: '#FBF8F1',
    backgroundImage: lowIntensityImage,
    label: '👀  Warm-up',
    nextLevel: INTENSITY_LEVELS.MEDIUM,
  },
  [INTENSITY_LEVELS.MEDIUM]: {
    backgroundColor: '#D51C2C',
    backgroundImage: mediumIntensityImage,
    label: '🔥 Foreplay',
    nextLevel: INTENSITY_LEVELS.HIGH,
  },
  [INTENSITY_LEVELS.HIGH]: {
    backgroundColor: '#5A0C13',
    backgroundImage: highIntensityImage,
    label: '🔞  The Main Event',
    nextLevel: INTENSITY_LEVELS.LOW, // Cycle back to low
  },
};

export const DARE_CLICK_THRESHOLD = 10;

