import mysql from 'mysql2/promise';

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'allen',
  database: 'websys',
};

export const connectToDatabase = async () => {
  const connection = await mysql.createConnection(dbConfig);
  return connection;
};
