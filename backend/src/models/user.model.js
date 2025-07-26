import { pool } from '../config/db.js'

export const createUser = async (username, email, hashedPassword, role) => {
  const [result] = await pool.query(
    'INSERT INTO users (user_name, email, password_hash, role) VALUES (?, ?, ?, ?)',
    [username, email, hashedPassword, role]
  )
  return result.insertId
}

export const findUserByUsername = async (username) => {
  const [rows] = await pool.query('SELECT * FROM users WHERE user_name = ?', [username])
  return rows[0]
}

export const findUserByEmail = async (email) => {
  const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email])
  return rows[0]
}

export const updateUserLicenseType = async (email, licenseType) => {
  const [result] = await pool.query(
    'UPDATE users SET license_type = ? WHERE email = ?',
    [licenseType, email]
  )
  return result.affectedRows > 0
}

