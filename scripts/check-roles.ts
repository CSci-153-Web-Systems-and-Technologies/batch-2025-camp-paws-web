// Quick script to check user roles in the database
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkUserRoles() {
  console.log('\n🔍 Checking user roles in database...\n');
  
  const { data: users, error } = await supabase
    .from('users')
    .select('id, email, role, name, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('❌ Error fetching users:', error.message);
    return;
  }

  if (!users || users.length === 0) {
    console.log('⚠️  No users found in database');
    return;
  }

  console.log(`✅ Found ${users.length} user(s):\n`);
  users.forEach((user, index) => {
    console.log(`${index + 1}. ${user.email || 'No email'}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Name: ${user.name || 'N/A'}`);
    console.log(`   Created: ${new Date(user.created_at).toLocaleString()}`);
    console.log('');
  });
}

checkUserRoles().catch(console.error);
