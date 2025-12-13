// Quick script to check user roles in the database
// Run with: node check-user-role.js

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkUserRoles() {
  const { data: users, error } = await supabase
    .from('users')
    .select('id, email, role, name')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching users:', error);
    return;
  }

  console.log('\n=== User Roles in Database ===\n');
  users.forEach(user => {
    console.log(`Email: ${user.email}`);
    console.log(`Role: ${user.role}`);
    console.log(`Name: ${user.name || 'N/A'}`);
    console.log('---');
  });
}

checkUserRoles();
