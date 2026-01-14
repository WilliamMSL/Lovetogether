require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

async function test() {
  console.log('🔍 Vérification des intensités disponibles...\n');
  
  // Compter par intensité
  const intensities = ['low', 'medium', 'high'];
  
  for (const intensity of intensities) {
    const { data, error } = await supabase
      .from('truth_or_dare')
      .select('id')
      .contains('intensity', [intensity]);
      
    if (error) {
      console.log(`❌ ${intensity}: Erreur - ${error.message}`);
    } else {
      console.log(`📊 ${intensity}: ${data?.length || 0} entrées`);
    }
  }
  
  // Test spécifique pour high
  console.log('\n🔍 Test requête "high" + "dare"...');
  const { data, error } = await supabase
    .from('truth_or_dare')
    .select('*')
    .eq('type', 'dare')
    .contains('intensity', ['high'])
    .limit(3);
    
  if (error) {
    console.log('❌ Erreur:', error.message);
  } else if (data && data.length > 0) {
    console.log('✅ Trouvé', data.length, 'dares high');
    console.log('Premier:', data[0].template.substring(0, 50) + '...');
  } else {
    console.log('⚠️ Aucun dare avec intensity "high" trouvé!');
  }
}

test().catch(console.error);
