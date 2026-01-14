/**
 * @deprecated L'API Express a été remplacée par Supabase.
 * Utiliser les fonctions de src/lib/supabaseService.js à la place.
 * 
 * Ce fichier est conservé pour compatibilité mais ne devrait plus être utilisé.
 */

export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:1812';

export const API_ENDPOINTS = {
  TRUTH_OR_DARE: '/api/truthordare/random',
};
