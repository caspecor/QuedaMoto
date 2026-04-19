import { db } from './src/db';
import { users } from './src/db/schema';

// Explicitly set the URL for the diagnostic tool
process.env.POSTGRES_URL = "postgresql://neondb_owner:npg_7dEayfHZVi1j@ep-rapid-bonus-abxrztha-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

async function diag() {
  try {
    const res = await db.select().from(users);
    console.log("DIAGNOSTIC_RESULT: " + JSON.stringify(res.map(u => ({
      id: u.id,
      name: u.username,
      hasAvatar: !!u.avatar,
      avatarPrefix: u.avatar ? u.avatar.substring(0, 30) : null,
      avatarLength: u.avatar?.length
    })), null, 2));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

diag();
