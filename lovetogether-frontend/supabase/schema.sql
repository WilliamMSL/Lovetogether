-- ===========================================
-- SCHÉMA SUPABASE POUR LOVETOGETHER
-- ===========================================
-- À exécuter dans le SQL Editor de Supabase

-- Table des jouets (toys)
CREATE TABLE IF NOT EXISTS toys (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  name_id TEXT NOT NULL UNIQUE,
  category TEXT DEFAULT 'Uncategorized',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table des roleplays
CREATE TABLE IF NOT EXISTS roleplays (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table Truth or Dare
CREATE TABLE IF NOT EXISTS truth_or_dare (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  template TEXT NOT NULL,
  duration INTEGER,
  intensity TEXT[] DEFAULT '{}',
  type TEXT NOT NULL CHECK (type IN ('truth', 'dare')),
  player TEXT NOT NULL,
  toys TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour optimiser les requêtes fréquentes
CREATE INDEX IF NOT EXISTS idx_truth_or_dare_type ON truth_or_dare(type);
CREATE INDEX IF NOT EXISTS idx_truth_or_dare_player ON truth_or_dare(player);
CREATE INDEX IF NOT EXISTS idx_truth_or_dare_intensity ON truth_or_dare USING GIN(intensity);
CREATE INDEX IF NOT EXISTS idx_truth_or_dare_toys ON truth_or_dare USING GIN(toys);
CREATE INDEX IF NOT EXISTS idx_toys_name_id ON toys(name_id);
CREATE INDEX IF NOT EXISTS idx_toys_category ON toys(category);

-- ===========================================
-- ROW LEVEL SECURITY (RLS)
-- ===========================================

-- Activer RLS sur toutes les tables
ALTER TABLE toys ENABLE ROW LEVEL SECURITY;
ALTER TABLE roleplays ENABLE ROW LEVEL SECURITY;
ALTER TABLE truth_or_dare ENABLE ROW LEVEL SECURITY;

-- Policies pour lecture publique (anon)
CREATE POLICY "Allow public read on toys" ON toys
  FOR SELECT USING (true);

CREATE POLICY "Allow public read on roleplays" ON roleplays
  FOR SELECT USING (true);

CREATE POLICY "Allow public read on truth_or_dare" ON truth_or_dare
  FOR SELECT USING (true);

-- Policies pour insertion (optionnel - pour ajouter du contenu)
CREATE POLICY "Allow public insert on truth_or_dare" ON truth_or_dare
  FOR INSERT WITH CHECK (true);

-- ===========================================
-- FONCTION POUR RÉCUPÉRER UN TRUTH OR DARE ALÉATOIRE
-- ===========================================

CREATE OR REPLACE FUNCTION get_random_truth_or_dare(
  p_type TEXT,
  p_player TEXT,
  p_toys TEXT[] DEFAULT NULL,
  p_intensity TEXT DEFAULT NULL,
  p_exclude_ids UUID[] DEFAULT '{}'
)
RETURNS TABLE (
  id UUID,
  template TEXT,
  duration INTEGER,
  intensity TEXT[],
  toys TEXT[]
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    tod.id,
    tod.template,
    tod.duration,
    tod.intensity,
    tod.toys
  FROM truth_or_dare tod
  WHERE 
    tod.type = p_type
    AND (tod.player = p_player OR tod.player = 'all')
    AND (
      p_type = 'truth' 
      OR p_toys IS NULL 
      OR tod.toys && p_toys 
      OR 'all' = ANY(tod.toys)
    )
    AND (
      p_type = 'truth' 
      OR p_intensity IS NULL 
      OR p_intensity = ANY(tod.intensity)
    )
    AND NOT (tod.id = ANY(p_exclude_ids))
  ORDER BY RANDOM()
  LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- ===========================================
-- FONCTION POUR RÉCUPÉRER UN ROLEPLAY ALÉATOIRE
-- ===========================================

CREATE OR REPLACE FUNCTION get_random_roleplay()
RETURNS TABLE (
  id UUID,
  title TEXT,
  description TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT r.id, r.title, r.description
  FROM roleplays r
  ORDER BY RANDOM()
  LIMIT 1;
END;
$$ LANGUAGE plpgsql;
