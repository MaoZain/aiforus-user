import { pool } from "../config/db.js";

export const createUser = async (user) => {
  try
  {
    const [result] = await pool.query(
      "INSERT INTO users (user_name, email, password_hash, role, license_type, registration_date, license_start_date, license_expiration_date, license_state, verificationToken, verificationTokenExpires) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?,?,?)",
      [
        user.username,
        user.email,
        user.password_hash,
        user.role,
        user.licenseType,
        user.registrationDate,
        user.licenseStartDate,
        user.licenseExpirationDate,
        user.licenseState,
        user.verificationToken,
        user.verificationTokenExpires,
      ]
    );
    return result.insertId;
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error("Failed to create user");
  }
};

export const findUserByUsername = async (username) => {
  const [rows] = await pool.query("SELECT * FROM users WHERE user_name = ?", [username]);
  return rows[0];
};

export const findUserByEmail = async (email) => {
  const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
  return rows[0];
};

export const updateUserLicenseType = async (email, licenseType) => {
  const [result] = await pool.query("UPDATE users SET license_type = ? WHERE email = ?", [licenseType, email]);
  return result.affectedRows > 0;
};

export const updateUserToken = async (email, token) => {
  try {
    const result = await pool.query(
      'UPDATE users SET license_token = ? WHERE email = ?', 
      [token, email]
    );
    
    return result.affectedRows > 0;
  } catch (error) {
    console.error('Database update error:', error);
    throw new Error('Failed to update user token in database');
  }
};
