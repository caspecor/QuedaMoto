import { db } from './src/db/index';
import { notifications } from './src/db/schema';
import { desc } from 'drizzle-orm';

async function check() {
  console.log("--- Ultimas 10 Notificaciones ---");
  const res = await db.select().from(notifications).orderBy(desc(notifications.createdAt)).limit(10);
  console.log(JSON.stringify(res, null, 2));
  process.exit(0);
}

check();
