
import { query } from '../../utils/db';
import jwt from 'jsonwebtoken';

const secretKey = '10022002'; 

export default async function handler(req, res) {
  const { email, password } = req.body;
  const result = await query(
    `SELECT * FROM users WHERE email = ? AND password = ?`,
    [email, password]
  );

  if (result.length > 0) {
    const user = result[0];
    const token = jwt.sign({ id: user.id }, secretKey, { expiresIn: '1h' });
    res.status(200).json({ token });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
}