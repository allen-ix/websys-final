import { query } from '../../utils/db';

export default async function handler(req, res) {
  const { method } = req;
  const { id, search } = req.query;

  switch (method) {
    case 'GET':
      let employees;
      if (search) {
        employees = await query(
          `SELECT * FROM employees WHERE firstname LIKE ? OR lastname LIKE ? OR section LIKE ?`,
          [`%${search}%`, `%${search}%`, `%${search}%`]
        );
      } else {
        employees = await query(`SELECT * FROM employees`);
      }
      res.status(200).json(employees);
      break;
    case 'POST':
      const { firstname, lastname, email, section, age } = req.body;
      await query(
        `INSERT INTO employees (firstname, lastname, email, section, age ) VALUES (?, ?, ?, ?, ?)`,
        [firstname, lastname, email, section, age ]
      );
      res.status(201).json({ message: 'Employee added' });
      break;
    case 'PUT':
      const { firstname: updateFirst, lastname: updateLast, email: updateEmail, section: updateSection, age: updateAge } = req.body;
      await query(
        `UPDATE employees SET firstname = ?, lastname = ?, email = ?, section = ?, age = ? WHERE id = ?`,
        [updateFirst, updateLast, updateEmail, updateSection, updateAge, id]
      );
      res.status(200).json({ message: 'Employee updated' });
      break;
    case 'DELETE':
      await query(`DELETE FROM employees WHERE id = ?`, [id]);
      res.status(200).json({ message: 'Employee deleted' });
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
