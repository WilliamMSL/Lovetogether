-- ===========================================
-- AJOUTER TOUS LES TOYS UTILISÉS DANS LES CARTES
-- ===========================================
-- Exécute ce SQL dans le SQL Editor de Supabase

-- Supprimer les anciens toys et tout recréer
DELETE FROM toys;

-- Catégorie: BDSM
INSERT INTO toys (name, name_id, category) VALUES 
  ('Menottes', 'handcuffs', 'BDSM'),
  ('Bandeau', 'blindfold', 'BDSM'),
  ('Corde', 'rope', 'BDSM'),
  ('Fouet', 'whip', 'BDSM');

-- Catégorie: Plugs
INSERT INTO toys (name, name_id, category) VALUES 
  ('Plug anal', 'plug', 'Plugs'),
  ('Hush', 'hush', 'Plugs');

-- Catégorie: Vibrators
INSERT INTO toys (name, name_id, category) VALUES 
  ('Lush', 'lush', 'Vibrators'),
  ('Domi', 'domi', 'Vibrators');

-- Catégorie: Tech
INSERT INTO toys (name, name_id, category) VALUES 
  ('Téléphone', 'phone', 'Tech'),
  ('Polaroid', 'polaroid', 'Tech'),
  ('Film porno', 'porno_movie', 'Tech');

-- Catégorie: Massage
INSERT INTO toys (name, name_id, category) VALUES 
  ('Huile de massage', 'massage_oil', 'Massage'),
  ('Bougies', 'candles', 'Massage');

-- Catégorie: Nourriture
INSERT INTO toys (name, name_id, category) VALUES 
  ('Crème chantilly', 'whipped_cream', 'Nourriture'),
  ('Glaçons', 'icecube', 'Nourriture'),
  ('Chocolat', 'chocolate', 'Nourriture'),
  ('Fruits', 'fruits', 'Nourriture');

-- Catégorie: Lubrifiants
INSERT INTO toys (name, name_id, category) VALUES 
  ('Lubrifiant', 'lubrifiant', 'Lubrifiants');

-- Catégorie: Boissons
INSERT INTO toys (name, name_id, category) VALUES 
  ('Alcool', 'alcool', 'Boissons');

-- Afficher tous les toys pour vérification
SELECT name, name_id, category FROM toys ORDER BY category, name;
