/**
 * Script pour convertir le CSV MongoDB en INSERT SQL pour Supabase
 * 
 * Usage: node supabase/convert-csv-to-sql.js
 */

const fs = require('fs');
const path = require('path');

// Lire le fichier CSV
const csvPath = path.join(__dirname, '..', 'LoveTogether.truthordares.csv');
const outputPath = path.join(__dirname, 'import-data.sql');

const csvContent = fs.readFileSync(csvPath, 'utf-8');
const lines = csvContent.split('\n');

// Parser le CSV (gestion des virgules dans les champs entre guillemets)
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  
  return result;
}

// Générer le SQL
let sql = `-- ===========================================
-- IMPORT DES DONNÉES TRUTH OR DARE
-- Généré automatiquement depuis LoveTogether.truthordares.csv
-- ===========================================

`;

// Skip la première ligne (header)
const dataLines = lines.slice(1).filter(line => line.trim());

let insertCount = 0;

for (const line of dataLines) {
  const fields = parseCSVLine(line);
  
  if (fields.length < 5) continue;
  
  const [_id, type, player0, player1, template, toy0, toy1, intensity0, intensity1, intensity2, duration] = fields;
  
  if (!template || !type) continue;
  
  // Déterminer le player
  let player = 'all';
  if (player0 && player1) {
    // Les deux sont présents = all
    player = 'all';
  } else if (player0 === 'firstName1' && !player1) {
    player = 'firstName1'; // Femme uniquement
  } else if (player0 === 'firstName2' && !player1) {
    player = 'firstName2'; // Homme uniquement
  } else if (player1 === 'firstName1' && !player0) {
    player = 'firstName1';
  } else if (player1 === 'firstName2' && !player0) {
    player = 'firstName2';
  }
  
  // Construire le tableau d'intensités
  const intensities = [intensity0, intensity1, intensity2]
    .filter(i => i && i.trim())
    .map(i => i.trim().replace(/['"]/g, ''));
  
  // Construire le tableau de toys
  const toys = [toy0, toy1]
    .filter(t => t && t.trim())
    .map(t => t.trim().toLowerCase());
  
  if (toys.length === 0) {
    toys.push('all');
  }
  
  // Échapper les apostrophes dans le template
  const escapedTemplate = template.replace(/'/g, "''");
  
  // Formater les arrays pour PostgreSQL
  const intensityArray = intensities.length > 0 
    ? `ARRAY['${intensities.join("','")}']` 
    : `ARRAY['low']::text[]`;
  
  const toysArray = `ARRAY['${toys.join("','")}']`;
  
  // Durée (null si vide)
  const durationValue = duration && duration.trim() ? parseInt(duration) : 'NULL';
  
  sql += `INSERT INTO truth_or_dare (template, type, player, intensity, toys, duration) VALUES
  ('${escapedTemplate}', '${type}', '${player}', ${intensityArray}, ${toysArray}, ${durationValue});\n`;
  
  insertCount++;
}

// Ajouter un message de fin
sql += `
-- ===========================================
-- FIN DE L'IMPORT: ${insertCount} entrées
-- ===========================================
`;

// Écrire le fichier SQL
fs.writeFileSync(outputPath, sql);

console.log(`✅ Fichier SQL généré: ${outputPath}`);
console.log(`📊 Nombre d'entrées: ${insertCount}`);
console.log(`\n📋 Pour importer dans Supabase:`);
console.log(`   1. Va sur https://supabase.com/dashboard/project/ohwfqdhzthycunnwpumu/sql/new`);
console.log(`   2. Copie-colle le contenu de supabase/import-data.sql`);
console.log(`   3. Clique sur "Run"`);
