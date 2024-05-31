import { query } from '../../utils/db';
import jwt from 'jsonwebtoken';

const secretKey = '10022002'; 
export default async function handler(req, res) {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Authentication token missing' });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    if (req.method === 'GET') {
      const result = await query(`SELECT * FROM users WHERE id = ?`, [decoded.id]);
      res.status(200).json(result[0]);
    } else if (req.method === 'PUT') {
      const { firstname, email, bio } = req.body;
      const result = await query(
        `UPDATE users SET firstname = ?, email = ?, bio = ? WHERE id = ?`,
        [firstname, email, bio, decoded.id]
      );
      res.status(200).json(result);
    }
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
}

