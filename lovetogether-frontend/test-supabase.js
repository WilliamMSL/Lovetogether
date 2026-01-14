require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

console.log('URL:', supabaseUrl);
console.log('Key exists:', !!supabaseKey);

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables manquantes!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  console.log('\n🔍 Test de connexion Supabase...\n');
  
  // Test 1: Vérifier si la table existe
  console.log('1. Test table truth_or_dare...');
  const { data, error } = await supabase
    .from('truth_or_dare')
    .select('*')
    .limit(3);
    
  if (error) {
    console.error('❌ Erreur:', error.message);
    console.error('   Code:', error.code);
    console.error('   Details:', error.details);
    return;
  }
  
  console.log('✅ Connexion OK!');
  console.log('📊 Nombre de résultats:', data?.length || 0);
  
  if (data && data.length > 0) {
    console.log('\n📋 Premier résultat:');
    console.log(JSON.stringify(data[0], null, 2));
  } else {
    console.log('\n⚠️ La table est VIDE! Tu dois importer les données.');
  }
}

test().catch(console.error);
