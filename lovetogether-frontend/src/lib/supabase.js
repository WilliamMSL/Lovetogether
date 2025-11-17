import { createClient } from '@supabase/supabase-js';
import logger from '../utils/logger';

// Configuration Supabase depuis les variables d'environnement
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  logger.error('Supabase configuration missing. Please set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY');
}

// Créer le client Supabase UNE SEULE FOIS
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

logger.log('Supabase client initialized');

// Export des fonctions utilitaires pour les buckets si nécessaire
export const getBucket = (bucketName) => {
  return supabase.storage.from(bucketName);
};

// Exemple d'utilisation :
// const avatarBucket = getBucket('avatars');
// const { data, error } = await avatarBucket.list();

