import { query } from '../../utils/db';
import jwt from 'jsonwebtoken';

const secretKey = '10022002'; 

export default async function handler(req, res) {
  const { username, email, password } = req.body;
  
  try {
    const result = await query(
      `SELECT * FROM users WHERE username = ? AND email = ? AND password = ?`,
      [username, email, password]
    );

    if (result.length > 0) {
      const user = result[0];
      const token = jwt.sign({ id: user.id }, secretKey, { expiresIn: '1h' });
      res.status(200).json({ token });
    } else {
      res.status(401).json({ error: 'Invalid information' });
    }
  } catch (error) {
    console.error('Login error', error);
    res.status(500).json({ error: 'An error occurred during login' });
  }
}
