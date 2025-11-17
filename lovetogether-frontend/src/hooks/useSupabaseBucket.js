import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import logger from '../utils/logger';

/**
 * Hook personnalisé pour gérer les opérations sur un bucket Supabase
 * @param {string} bucketName - Nom du bucket
 * @returns {object} Fonctions et état pour interagir avec le bucket
 */
export const useSupabaseBucket = (bucketName) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const bucket = supabase.storage.from(bucketName);

  // Upload un fichier
  const uploadFile = useCallback(async (file, path, options = {}) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: uploadError } = await bucket.upload(path, file, {
        cacheControl: '3600',
        upsert: false,
        ...options,
      });

      if (uploadError) throw uploadError;
      
      logger.log(`File uploaded to ${bucketName}/${path}`);
      return { data, error: null };
    } catch (err) {
      logger.error(`Error uploading file to ${bucketName}:`, err);
      setError(err);
      return { data: null, error: err };
    } finally {
      setLoading(false);
    }
  }, [bucket, bucketName]);

  // Récupérer l'URL publique d'un fichier
  const getPublicUrl = useCallback((path) => {
    const { data } = bucket.getPublicUrl(path);
    return data.publicUrl;
  }, [bucket]);

  // Lister les fichiers
  const listFiles = useCallback(async (folder = '') => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: listError } = await bucket.list(folder);
      
      if (listError) throw listError;
      
      logger.log(`Files listed from ${bucketName}/${folder}`);
      return { data, error: null };
    } catch (err) {
      logger.error(`Error listing files from ${bucketName}:`, err);
      setError(err);
      return { data: null, error: err };
    } finally {
      setLoading(false);
    }
  }, [bucket, bucketName]);

  // Supprimer un fichier
  const deleteFile = useCallback(async (path) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: deleteError } = await bucket.remove([path]);
      
      if (deleteError) throw deleteError;
      
      logger.log(`File deleted from ${bucketName}/${path}`);
      return { data, error: null };
    } catch (err) {
      logger.error(`Error deleting file from ${bucketName}:`, err);
      setError(err);
      return { data: null, error: err };
    } finally {
      setLoading(false);
    }
  }, [bucket, bucketName]);

  return {
    uploadFile,
    getPublicUrl,
    listFiles,
    deleteFile,
    loading,
    error,
  };
};

