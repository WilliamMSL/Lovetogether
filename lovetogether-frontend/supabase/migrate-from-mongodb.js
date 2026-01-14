/**
 * Script de migration MongoDB → Supabase
 * 
 * Usage:
 * 1. S'assurer que MongoDB est accessible
 * 2. Configurer les variables d'environnement Supabase
 * 3. Exécuter: node supabase/migrate-from-mongodb.js
 */

require('dotenv').config({ path: './api/.env' });
const mongoose = require('mongoose');
const { createClient } = require('@supabase/supabase-js');

// Configuration Supabase
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY; // Utiliser la clé service pour les migrations

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variables Supabase manquantes. Définissez:');
  console.error('   - REACT_APP_SUPABASE_URL');
  console.error('   - SUPABASE_SERVICE_KEY (clé service, pas anon)');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Modèles MongoDB
const ToySchema = new mongoose.Schema({
  name: String,
  name_id: String,
  category: String
});

const RoleplaySchema = new mongoose.Schema({
  title: String,
  description: String
});

const TruthOrDareSchema = new mongoose.Schema({
  template: String,
  duration: Number,
  intensity: [String],
  type: String,
  player: String,
  toys: [String]
});

const Toy = mongoose.model('Toy', ToySchema);
const Roleplay = mongoose.model('Roleplay', RoleplaySchema);
const TruthOrDare = mongoose.model('TruthOrDare', TruthOrDareSchema);

async function migrateToys() {
  console.log('\n📦 Migration des Toys...');
  
  const toys = await Toy.find({});
  console.log(`   Trouvé ${toys.length} toys dans MongoDB`);
  
  if (toys.length === 0) {
    console.log('   ⚠️ Aucun toy à migrer');
    return;
  }

  const toysData = toys.map(toy => ({
    name: toy.name,
    name_id: toy.name_id,
    category: toy.category || 'Uncategorized'
  }));

  const { data, error } = await supabase
    .from('toys')
    .upsert(toysData, { onConflict: 'name_id' })
    .select();

  if (error) {
    console.error('   ❌ Erreur lors de la migration des toys:', error);
  } else {
    console.log(`   ✅ ${data.length} toys migrés avec succès`);
  }
}

async function migrateRoleplays() {
  console.log('\n🎭 Migration des Roleplays...');
  
  const roleplays = await Roleplay.find({});
  console.log(`   Trouvé ${roleplays.length} roleplays dans MongoDB`);
  
  if (roleplays.length === 0) {
    console.log('   ⚠️ Aucun roleplay à migrer');
    return;
  }

  const roleplaysData = roleplays.map(rp => ({
    title: rp.title,
    description: rp.description
  }));

  const { data, error } = await supabase
    .from('roleplays')
    .insert(roleplaysData)
    .select();

  if (error) {
    console.error('   ❌ Erreur lors de la migration des roleplays:', error);
  } else {
    console.log(`   ✅ ${data.length} roleplays migrés avec succès`);
  }
}

async function migrateTruthOrDare() {
  console.log('\n🎯 Migration des Truth or Dare...');
  
  const items = await TruthOrDare.find({});
  console.log(`   Trouvé ${items.length} truth or dare dans MongoDB`);
  
  if (items.length === 0) {
    console.log('   ⚠️ Aucun truth or dare à migrer');
    return;
  }

  // Migrer par batch de 100 pour éviter les timeouts
  const batchSize = 100;
  let migrated = 0;

  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    
    const batchData = batch.map(item => ({
      template: item.template,
      duration: item.duration || null,
      intensity: item.intensity || [],
      type: item.type,
      player: item.player,
      toys: item.toys || []
    }));

    const { data, error } = await supabase
      .from('truth_or_dare')
      .insert(batchData)
      .select();

    if (error) {
      console.error(`   ❌ Erreur batch ${i}-${i + batchSize}:`, error);
    } else {
      migrated += data.length;
      console.log(`   📊 Batch ${Math.floor(i/batchSize) + 1}: ${data.length} éléments migrés`);
    }
  }

  console.log(`   ✅ Total: ${migrated} truth or dare migrés avec succès`);
}

async function main() {
  console.log('🚀 Démarrage de la migration MongoDB → Supabase');
  console.log('================================================\n');

  // Connexion MongoDB
  if (!process.env.MONGODB_URI) {
    console.error('❌ MONGODB_URI non défini');
    process.exit(1);
  }

  try {
    console.log('📡 Connexion à MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connecté à MongoDB\n');

    // Test connexion Supabase
    console.log('📡 Test connexion Supabase...');
    const { data, error } = await supabase.from('toys').select('count').limit(1);
    if (error && !error.message.includes('does not exist')) {
      throw error;
    }
    console.log('✅ Connecté à Supabase\n');

    // Exécuter les migrations
    await migrateToys();
    await migrateRoleplays();
    await migrateTruthOrDare();

    console.log('\n================================================');
    console.log('🎉 Migration terminée avec succès!');
    console.log('================================================\n');

  } catch (error) {
    console.error('❌ Erreur de migration:', error);
  } finally {
    await mongoose.connection.close();
    console.log('📡 Connexion MongoDB fermée');
  }
}

main();
