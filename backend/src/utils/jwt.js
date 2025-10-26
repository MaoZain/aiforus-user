import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { updateUserToken } from "../models/user.model.js";

// 获取当前文件的绝对路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
/**
 * 使用RSA私钥生成JWT token
 * @param {Object} payload - 包含用户信息的载荷
 * @param {string} privateKeyPath - 私钥文件路径
 * @param {Object} options - JWT选项
 * @returns {string} 生成的JWT token
 */
export const generateTokenWithRSA = async (payload) => {
  try {
    // 读取私钥文件
    const privateKeyPath = path.join(__dirname, "../../keys/test/es256-private.pem");

    console.log("Private key path:", privateKeyPath);
    console.log(payload);

    const privateKey = fs.readFileSync(privateKeyPath, "utf8");
    if (!privateKey) {
      throw new Error("Private key not found");
    }
    console.log(privateKey);

    // 合并选项
    const jwtOptions = {
      algorithm: "ES256",
    };

    // 生成token
    const token = jwt.sign(payload, privateKey, jwtOptions);
    console.log("Generated token:", token);
    // await updateUserToken(payload.email, token);
    return token;
  } catch (error) {
    throw new Error(`Token generation failed: ${error.message}`);
  }
};

export const generateToken = async (payload) => {
  try {
    // 读取私钥文件
    const privateKeyPath = path.join(__dirname, "../../keys/private.pem");

    console.log("Private key path:", privateKeyPath);
    console.log(payload);

    const privateKey = fs.readFileSync(privateKeyPath, "utf8");
    if (!privateKey) {
      throw new Error("Private key not found");
    }
    console.log(privateKey);

    // 合并选项
    const jwtOptions = {
      algorithm: "RS256",
    };

    // 生成token
    const token = jwt.sign(payload, privateKey, jwtOptions);
    console.log("Generated token:", token);
    return token;
  } catch (error) {
    throw new Error(`Token generation failed: ${error.message}`);
  }
};

export const verifyTokenWithRSA = async (token) => {
  try {
    // 读取公钥文件
    const publicKeyPath = path.join(__dirname, "../../keys/public.pem");
    console.log("Public key path:", publicKeyPath);
    const publicKey = fs.readFileSync(publicKeyPath, "utf8");
    console.log(publicKey);
    console.log(token);
    if (!publicKey) {
      throw new Error("Public key not found");
    }

    // 验证token
    const decoded = jwt.verify(token, publicKey);
    return decoded;
  } catch (error) {
    throw new Error(`Token verification failed: ${error.message}`);
  }
};
