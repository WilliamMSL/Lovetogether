/* eslint-disable */
// Dés personnalisés pour LoveTogether - Jeu de couple

export const LOVE_DICE = {
  // Dé des actions (Que faire ?)
  daction: {
    name: 'Dé des Actions',
    type: 'd6',
    labels: ['Embrasser', 'Masser', 'Caresser', 'Lécher', 'Mordiller', 'Souffler'],
    values: [1, 6],
    scale: 0.9,
    display: 'labels',
    system: 'love',
  },
  
  // Dé des parties du corps
  dbody: {
    name: 'Dé du Corps',
    type: 'd8',
    labels: ['Cou', 'Lèvres', 'Oreille', 'Épaule', 'Dos', 'Ventre', 'Cuisse', 'Main'],
    values: [1, 8],
    display: 'labels',
    system: 'love',
  },
  
  // Dé de durée
  dduration: {
    name: 'Dé de Durée',
    type: 'd6',
    labels: ['10s', '20s', '30s', '1min', '2min', '5min'],
    values: [1, 6],
    scale: 0.9,
    display: 'labels',
    system: 'love',
  },
  
  // Dé d'intensité (emojis)
  dintensity: {
    name: 'Dé Intensité',
    type: 'd6',
    labels: ['💋', '🔥', '❤️', '💕', '😏', '🥵'],
    values: [1, 6],
    scale: 0.9,
    display: 'labels',
    system: 'love',
  },
  
  // Dé des positions (pour le jeu positions)
  dposition: {
    name: 'Dé Position',
    type: 'd6',
    labels: ['Debout', 'Assis', 'Allongé', 'À genoux', 'De côté', 'Face à face'],
    values: [1, 6],
    scale: 0.9,
    display: 'labels',
    system: 'love',
  },
  
  // Dé des accessoires
  daccessory: {
    name: 'Dé Accessoires',
    type: 'd6',
    labels: ['Bandeau', 'Plume', 'Glaçon', 'Huile', 'Chocolat', 'Rien'],
    values: [1, 6],
    scale: 0.9,
    display: 'labels',
    system: 'love',
  },
};

// Configuration des sets de couleurs romantiques
export const LOVE_COLORSETS = {
  'love_pink': {
    name: 'Love Pink',
    category: 'LoveTogether',
    foreground: '#FFFFFF',
    background: ['#FF69B4', '#FF1493', '#DB7093', '#C71585'],
    outline: '#8B008B',
    texture: 'glitter',
    description: 'Rose romantique'
  },
  'love_red': {
    name: 'Love Red',
    category: 'LoveTogether',
    foreground: '#FFFFFF',
    background: ['#DC143C', '#FF0000', '#8B0000', '#B22222'],
    outline: '#4B0000',
    texture: 'fire',
    description: 'Rouge passion'
  },
  'love_purple': {
    name: 'Love Purple',
    category: 'LoveTogether',
    foreground: '#FFFFFF',
    background: ['#9400D3', '#8B008B', '#9932CC', '#BA55D3'],
    outline: '#4B0082',
    texture: 'stars',
    description: 'Violet mystère'
  },
  'love_gold': {
    name: 'Love Gold',
    category: 'LoveTogether',
    foreground: '#8B4513',
    background: ['#FFD700', '#FFA500', '#DAA520', '#F0E68C'],
    outline: '#8B4513',
    texture: 'metal',
    description: 'Or luxueux'
  },
  'love_black': {
    name: 'Love Noir',
    category: 'LoveTogether',
    foreground: '#FF69B4',
    background: ['#1a1a1a', '#2d2d2d', '#0d0d0d', '#404040'],
    outline: '#FF1493',
    texture: 'marble',
    description: 'Noir élégant'
  }
};

// Mapping des valeurs des dés vers les textes
export const DICE_RESULT_MAP = {
  action: {
    1: 'Embrasser',
    2: 'Masser',
    3: 'Caresser',
    4: 'Lécher',
    5: 'Mordiller',
    6: 'Souffler'
  },
  body: {
    1: 'la tête',
    2: 'les seins',
    3: 'le ventre',
    4: 'les fesses',
    5: 'les jambes',
    6: 'les cheveux'
  },
  duration: {
    1: '10 secondes',
    2: '30 secondes',
    3: '1 minute',
    4: '2 minutes',
    5: '3 minutes',
    6: '5 minutes'
  },
  durationSeconds: {
    1: 10,
    2: 30,
    3: 60,
    4: 120,
    5: 180,
    6: 300
  },
  position: {
    1: 'Debout',
    2: 'Assis',
    3: 'Allongé',
    4: 'À genoux',
    5: 'De côté',
    6: 'Face à face'
  },
  accessory: {
    1: 'un bandeau',
    2: 'une plume',
    3: 'un glaçon',
    4: "de l'huile",
    5: 'du chocolat',
    6: 'rien de spécial'
  }
};

// Fonction pour générer une phrase à partir des résultats des dés
export const generateSentence = (actionValue, bodyValue, durationValue) => {
  const action = DICE_RESULT_MAP.action[actionValue];
  const body = DICE_RESULT_MAP.body[bodyValue];
  const duration = DICE_RESULT_MAP.duration[durationValue];
  
  return `${action} ${body} pendant ${duration}`;
};
