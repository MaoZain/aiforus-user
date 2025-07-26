import { pool } from '../config/db.js'

export const getDictionaryByType = async (dictType) => {
  const [rows] = await pool.query('SELECT * FROM user_dict WHERE dict_type = ?', [dictType])
  return rows
}