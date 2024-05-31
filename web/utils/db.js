
import mysql from 'mysql2/promise';

export async function query(sql, values) {
  const db = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'renz',
    database: 'webfin',
  });
  const [results] = await db.execute(sql, values);
  db.end();
  return results;
}
