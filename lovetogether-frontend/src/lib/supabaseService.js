/**
 * Service Supabase pour LoveTogether
 * Remplace l'ancienne API Express + MongoDB
 */

import { supabase } from './supabase';
import logger from '../utils/logger';

// ===========================================
// GESTION DES ACTIONS RÉCENTES (localStorage)
// ===========================================

const RECENT_ACTIONS_KEY = 'lovetogether_recent_actions';
const RECENT_ACTIONS_EXPIRY = 30 * 60 * 1000; // 30 minutes en ms

/**
 * Récupère les IDs des actions récentes depuis localStorage
 */
const getRecentActionIds = (player, type) => {
  try {
    const stored = localStorage.getItem(RECENT_ACTIONS_KEY);
    if (!stored) return [];

    const data = JSON.parse(stored);
    const now = Date.now();

    // Nettoyer les entrées expirées
    const validEntries = {};
    let hasExpired = false;

    Object.entries(data).forEach(([key, value]) => {
      if (value.expiry > now) {
        validEntries[key] = value;
      } else {
        hasExpired = true;
      }
    });

    // Sauvegarder si on a nettoyé des entrées
    if (hasExpired) {
      localStorage.setItem(RECENT_ACTIONS_KEY, JSON.stringify(validEntries));
    }

    // Récupérer les IDs pour ce player et type
    const playerKey = `${player}:${type}`;
    const sharedKey = `shared:${type}`;

    const playerIds = validEntries[playerKey]?.ids || [];
    const sharedIds = validEntries[sharedKey]?.ids || [];

    return [...new Set([...playerIds, ...sharedIds])];
  } catch (error) {
    logger.warn('Error reading recent actions:', error);
    return [];
  }
};

/**
 * Ajoute un ID aux actions récentes
 */
const addRecentActionId = (player, type, id, isShared = false) => {
  try {
    const stored = localStorage.getItem(RECENT_ACTIONS_KEY);
    const data = stored ? JSON.parse(stored) : {};
    const expiry = Date.now() + RECENT_ACTIONS_EXPIRY;

    // Ajouter pour le player
    const playerKey = `${player}:${type}`;
    if (!data[playerKey]) {
      data[playerKey] = { ids: [], expiry };
    }
    data[playerKey].ids = [...new Set([...data[playerKey].ids, id])];
    data[playerKey].expiry = expiry;

    // Ajouter aux shared si nécessaire
    if (isShared) {
      const sharedKey = `shared:${type}`;
      if (!data[sharedKey]) {
        data[sharedKey] = { ids: [], expiry };
      }
      data[sharedKey].ids = [...new Set([...data[sharedKey].ids, id])];
      data[sharedKey].expiry = expiry;
    }

    localStorage.setItem(RECENT_ACTIONS_KEY, JSON.stringify(data));
  } catch (error) {
    logger.warn('Error saving recent action:', error);
  }
};

/**
 * Réinitialise les actions récentes pour un player/type
 */
const clearRecentActions = (player, type) => {
  try {
    const stored = localStorage.getItem(RECENT_ACTIONS_KEY);
    if (!stored) return;

    const data = JSON.parse(stored);
    const playerKey = `${player}:${type}`;
    const sharedKey = `shared:${type}`;

    delete data[playerKey];
    delete data[sharedKey];

    localStorage.setItem(RECENT_ACTIONS_KEY, JSON.stringify(data));
  } catch (error) {
    logger.warn('Error clearing recent actions:', error);
  }
};

// ===========================================
// TOYS
// ===========================================

/**
 * Récupère tous les jouets
 */
export const fetchToys = async () => {
  const { data, error } = await supabase
    .from('toys')
    .select('*')
    .order('category', { ascending: true });

  if (error) {
    logger.error('Error fetching toys:', error);
    throw error;
  }

  logger.log(`Fetched ${data.length} toys from Supabase`);
  return data;
};

/**
 * Récupère un jouet par son name_id
 */
export const fetchToyByNameId = async (nameId) => {
  const { data, error } = await supabase
    .from('toys')
    .select('*')
    .eq('name_id', nameId)
    .single();

  if (error) {
    logger.error('Error fetching toy:', error);
    throw error;
  }

  return data;
};

// ===========================================
// ROLEPLAYS
// ===========================================

/**
 * Récupère tous les roleplays
 */
export const fetchRoleplays = async () => {
  const { data, error } = await supabase
    .from('roleplays')
    .select('*');

  if (error) {
    logger.error('Error fetching roleplays:', error);
    throw error;
  }

  return data;
};

/**
 * Récupère un roleplay aléatoire
 */
export const fetchRandomRoleplay = async () => {
  // Utiliser la fonction PostgreSQL pour un vrai random
  const { data, error } = await supabase
    .rpc('get_random_roleplay');

  if (error) {
    logger.error('Error fetching random roleplay:', error);
    throw error;
  }

  if (!data || data.length === 0) {
    throw new Error('Aucun roleplay trouvé');
  }

  return data[0];
};

/**
 * Crée un nouveau roleplay
 */
export const createRoleplay = async (title, description) => {
  const { data, error } = await supabase
    .from('roleplays')
    .insert([{ title, description }])
    .select()
    .single();

  if (error) {
    logger.error('Error creating roleplay:', error);
    throw error;
  }

  return data;
};

// ===========================================
// TRUTH OR DARE
// ===========================================

/**
 * Récupère un Truth or Dare aléatoire
 * @param {Object} params - Paramètres de la requête
 * @param {string} params.type - 'truth' ou 'dare'
 * @param {string} params.player - Le joueur cible ('firstName1', 'firstName2', 'all')
 * @param {string[]} params.toys - Liste des toys sélectionnés (optionnel)
 * @param {string} params.intensity - Niveau d'intensité (optionnel)
 */
export const fetchRandomTruthOrDare = async ({ type, player, toys, intensity }) => {
  if (!type || !player) {
    throw new Error('Type et player sont requis');
  }

  // Récupérer les IDs à exclure (actions récentes)
  const excludeIds = getRecentActionIds(player, type);
  
  logger.log('🎯 Fetching truth or dare with params:', {
    type,
    player,
    toys: toys || 'none',
    intensity: intensity || 'none',
    excludeIds: excludeIds.length
  });

  // Construire la requête
  let query = supabase
    .from('truth_or_dare')
    .select('id, template, duration, intensity, toys')
    .eq('type', type)
    .or(`player.eq.${player},player.eq.all`);

  // Filtrer par toys pour les dares (SEULEMENT si l'utilisateur a sélectionné des toys)
  // On ne filtre que si toys contient autre chose que juste 'all'
  const userSelectedToys = toys ? toys.filter(t => t !== 'all') : [];
  
  if (type === 'dare') {
    if (userSelectedToys.length > 0) {
      // L'utilisateur a des toys sélectionnés : montrer les cartes qui matchent OU ont 'all'
      const toysFilter = [...userSelectedToys, 'all'];
      logger.log('🎮 Filtering by user toys:', userSelectedToys);
      query = query.or(`toys.ov.{${toysFilter.join(',')}},toys.cs.{all}`);
    } else {
      // Aucun toy sélectionné : montrer SEULEMENT les cartes avec 'all' ou sans toys
      logger.log('⚠️ No toys selected - showing only cards with "all" toys or empty toys');
      query = query.or('toys.cs.{all},toys.eq.{}');
    }
  }

  // Filtrer par intensity pour les dares
  if (type === 'dare' && intensity) {
    query = query.contains('intensity', [intensity]);
  }

  // Exclure les actions récentes
  if (excludeIds.length > 0) {
    query = query.not('id', 'in', `(${excludeIds.join(',')})`);
  }

  let { data, error } = await query;

  if (error) {
    logger.error('Error fetching truth or dare:', error);
    throw error;
  }

  // Si aucun résultat, réinitialiser les actions récentes et réessayer
  if (!data || data.length === 0) {
    logger.log('No results found, clearing recent actions and retrying...');
    clearRecentActions(player, type);

    // Réessayer sans exclusion
    query = supabase
      .from('truth_or_dare')
      .select('id, template, duration, intensity, toys')
      .eq('type', type)
      .or(`player.eq.${player},player.eq.all`);

    if (type === 'dare') {
      if (userSelectedToys.length > 0) {
        const toysFilter = [...userSelectedToys, 'all'];
        query = query.or(`toys.ov.{${toysFilter.join(',')}},toys.cs.{all}`);
      } else {
        query = query.or('toys.cs.{all},toys.eq.{}');
      }
    }

    if (type === 'dare' && intensity) {
      query = query.contains('intensity', [intensity]);
    }

    const retryResult = await query;
    data = retryResult.data;
    error = retryResult.error;

    if (error) {
      throw error;
    }
  }

  if (!data || data.length === 0) {
    throw new Error('Aucune action ou vérité disponible pour ces critères');
  }

  // Sélectionner un élément aléatoire
  const randomIndex = Math.floor(Math.random() * data.length);
  const selected = data[randomIndex];

  // Enregistrer comme action récente
  const isShared = selected.player === 'all';
  addRecentActionId(player, type, selected.id, isShared);

  logger.log('Selected truth or dare:', {
    id: selected.id,
    template: selected.template.substring(0, 30) + '...',
    toys: selected.toys,
    intensity: selected.intensity
  });

  return {
    template: selected.template,
    duration: selected.duration || null,
    intensity: selected.intensity || null,
    toys: selected.toys || []
  };
};

/**
 * Crée un nouveau Truth or Dare
 */
export const createTruthOrDare = async ({ template, type, player, intensity, toys, duration }) => {
  const { data, error } = await supabase
    .from('truth_or_dare')
    .insert([{
      template,
      type,
      player,
      intensity: Array.isArray(intensity) ? intensity : [intensity],
      toys: toys || [],
      duration: duration || null
    }])
    .select()
    .single();

  if (error) {
    logger.error('Error creating truth or dare:', error);
    throw error;
  }

  return data;
};

// ===========================================
// EXPORT PAR DÉFAUT
// ===========================================

export default {
  // Toys
  fetchToys,
  fetchToyByNameId,
  // Roleplays
  fetchRoleplays,
  fetchRandomRoleplay,
  createRoleplay,
  // Truth or Dare
  fetchRandomTruthOrDare,
  createTruthOrDare
};
