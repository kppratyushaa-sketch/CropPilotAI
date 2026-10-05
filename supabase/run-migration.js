import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to resolve packages from server/node_modules if not found at root
const requireFromServer = createRequire(path.join(__dirname, '../server/server.js'));

let dotenv;
try {
  dotenv = requireFromServer('dotenv');
} catch {
  try {
    dotenv = await import('dotenv');
  } catch {
    console.warn('⚠️  Notice: dotenv module not found. Reading environment variables from process.env.');
  }
}

// Attempt loading server/.env
const envPaths = [
  path.resolve(__dirname, '../server/.env'),
  path.resolve(__dirname, './.env'),
  path.resolve(__dirname, '../.env')
];

if (dotenv) {
  for (const p of envPaths) {
    if (fs.existsSync(p)) {
      dotenv.config({ path: p });
      console.log(`[Migration] Loaded environment from: ${p}`);
      break;
    }
  }
}

const sqlFilePath = path.join(__dirname, 'migrations', '001_initial_schema.sql');

async function runMigration() {
  console.log('----------------------------------------------------');
  console.log('🌾 CropPilotAI - Supabase PostgreSQL Migration Runner');
  console.log('----------------------------------------------------\n');

  if (!fs.existsSync(sqlFilePath)) {
    console.error(`❌ Migration file not found: ${sqlFilePath}`);
    process.exit(1);
  }

  const sql = fs.readFileSync(sqlFilePath, 'utf8');

  // Check for Postgres Direct Connection String
  const dbUrl = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL || process.env.POSTGRES_URL;

  if (dbUrl) {
    console.log('Connecting to PostgreSQL database via connection string...');
    let pgModule;
    try {
      pgModule = requireFromServer('pg');
    } catch {
      pgModule = (await import('pg')).default;
    }

    const { Client } = pgModule;
    const client = new Client({
      connectionString: dbUrl,
      ssl: { rejectUnauthorized: false }
    });

    try {
      await client.connect();
      console.log(' Connected to Supabase PostgreSQL database.');
      console.log('⚡ Applying migrations from 001_initial_schema.sql...');

      await client.query(sql);

      console.log('✅ Migration executed successfully!');
      console.log('  - Table "profiles" verified/created with RLS');
      console.log('  - Table "advisories" verified/created with RLS');
      console.log('  - Auth trigger on_auth_user_created registered');
      console.log('  - Policies and indices applied.');
    } catch (err) {
      console.error('❌ Migration failed:', err.message);
      console.log('\n💡 Note: You can also copy and paste the contents of:');
      console.log(`   ${sqlFilePath}`);
      console.log('   directly into your Supabase Dashboard -> SQL Editor and click "Run".\n');
      process.exit(1);
    } finally {
      await client.end();
    }
    return;
  }

  // If no direct DB URL, check for Supabase URL and Service Role Key
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey || supabaseUrl.includes('placeholder')) {
    console.log('ℹ️  No active DATABASE_URL or real SUPABASE_SERVICE_ROLE_KEY found in server/.env.');
    console.log('\n📝 How to apply this migration:');
    console.log('Option A (Quickest - Recommended):');
    console.log('  1. Open your Supabase Dashboard: https://supabase.com/dashboard');
    console.log('  2. Click on "SQL Editor" in the left navigation');
    console.log(`  3. Copy the entire contents of: ${sqlFilePath}`);
    console.log('  4. Paste into the SQL Editor and click "Run"');
    console.log('\nOption B (Direct Node script execution):');
    console.log('  1. Add your Supabase Postgres connection string to server/.env:');
    console.log('     DATABASE_URL=postgres://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres');
    console.log('  2. Run: npm run migrate\n');
    return;
  }

  console.log(`Found Supabase Project: ${supabaseUrl}`);
  console.log('Testing connection to Supabase REST endpoint with Service Role Key...');

  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/profiles?select=count`, {
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`
      }
    });

    if (res.status === 200 || res.status === 206) {
      console.log('✅ Connected to Supabase. "profiles" table is present and accessible!');
    } else if (res.status === 404 || res.status === 400) {
      console.log(`⚠️  Supabase responded with status ${res.status}. Tables may not be created yet.`);
      console.log('👉 Please apply the SQL file in your Supabase Dashboard:');
      console.log(`   File: ${sqlFilePath}`);
      console.log('   Go to: https://supabase.com/dashboard -> SQL Editor -> New Query -> Run');
    } else {
      console.log(`Response status: ${res.status}`);
    }
  } catch (error) {
    console.error('❌ Could not connect to Supabase endpoint:', error.message);
  }
}

runMigration();
