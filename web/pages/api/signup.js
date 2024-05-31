
import { query } from '../../utils/db';

export default async function handler(req, res) {
  const { firstname, email, password } = req.body;
  const result = await query(
    `INSERT INTO users (firstname, email, password) VALUES (?, ?, ?)`,
    [firstname, email, password]
  );
  res.status(201).json(result);
}
