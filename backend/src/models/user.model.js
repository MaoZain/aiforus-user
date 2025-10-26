import { pool } from "../config/db.js";

export const createUser = async (user) => {
  try {
    const [result] = await pool.query(
      "INSERT INTO users (user_name, email, password_hash, role, license_type, registration_date, license_start_date, license_expiration_date, license_state, verificationToken, verificationTokenExpires,couponCode) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?)",
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
        user.couponCode,
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

export const updateUserLicenseType = async (email, licenseType, couponCode, price) => {
  try {
    // 更新用户许可证类型
    const [result] = await pool.query("UPDATE users SET license_type = ? WHERE email = ?", [licenseType, email]);

    // 如果提供了 couponCode 和 price，则查找并更新 credits
    if (couponCode && price) {
      // 查询 couponCode 对应的用户 email
      const [couponRows] = await pool.query("SELECT email FROM users WHERE couponCode = ?", [couponCode]);
      
      if (couponRows.length > 0) {
        const inviterEmail = couponRows[0].email;
        
        // 更新邀请人的 credits
        const [updateCredits] = await pool.query(
          "UPDATE users SET credits = COALESCE(credits, 0) + ? WHERE couponCode = ?",
          [price / 100, couponCode]
        );
        
        // 插入 coupon_history 记录
        await pool.query("INSERT INTO coupon_history (inviterEmail, inviteeEmail, state, memo) VALUES (?, ?, ?, ?)", [
          inviterEmail,
          email,
          "active",
          `Added credits ${price / 100}`,
        ]);
      }
    }

    return result.affectedRows > 0;
  } catch (error) {
    console.error("Error updating user license type:", error);
    throw new Error("Failed to update user license type");
  }
};

export const updateUserToken = async (email, token) => {
  try {
    const result = await pool.query("UPDATE users SET license_token = ? WHERE email = ?", [token, email]);

    return result.affectedRows > 0;
  } catch (error) {
    console.error("Database update error:", error);
    throw new Error("Failed to update user token in database");
  }
};
