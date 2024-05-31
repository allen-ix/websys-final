
import { query } from '../../utils/db';

export default async function handler(req, res) {
  const { firstname, lastname, username, email, password } = req.body;
  const result = await query(
    `INSERT INTO users (firstname, lastname, username, email, password) VALUES (?, ?, ?, ?, ?)`,
    [firstname, lastname, username, email, password]
  );
  res.status(201).json(result);
}
