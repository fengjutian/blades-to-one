import { LoginRequest, RegisterRequest, AuthResponse, JwtPayload } from './types';
import { generateToken } from './token-utils';
import bcrypt from 'bcryptjs';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';

// 创建数据库连接池
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  port: Number(process.env.MYSQL_PORT),
  user: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  connectionLimit: 10,
  waitForConnections: true,
  queueLimit: 0,
  connectTimeout: 300000,
  idleTimeout: 60000,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

/**
 * 用户认证服务类
 */
export class AuthService {
  /**
   * 用户登录
   * @param loginData 登录请求数据
   * @returns 认证响应（包含token和用户信息）
   */
  async login(loginData: LoginRequest): Promise<AuthResponse> {
    const { username, password } = loginData;

    // 查找用户
    const [users] = await pool.execute(
      'SELECT id, username, password, email, created_at FROM users WHERE username = ?',
      [username]
    );

    const user = (users as any[])[0];

    if (!user) {
      throw new Error('用户不存在');
    }

    // 验证密码
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('密码错误');
    }

    // 生成JWT token
    const jwtPayload: Omit<JwtPayload, 'exp' | 'iat'> = {
      userId: user.id,
      username: user.username,
      email: user.email,
    };

    const token = generateToken(jwtPayload);

    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        createdAt: user.created_at,
      },
    };
  }

  /**
   * 用户注册
   * @param registerData 注册请求数据
   * @returns 认证响应（包含token和用户信息）
   */
  async register(registerData: RegisterRequest): Promise<AuthResponse> {
    const { username, password, email } = registerData;

    // 检查用户名是否已存在
    const [existingUsers] = await pool.execute(
      'SELECT id FROM users WHERE username = ?',
      [username]
    );

    if ((existingUsers as any[]).length > 0) {
      throw new Error('用户名已存在');
    }

    // 检查邮箱是否已存在
    const [existingEmails] = await pool.execute(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if ((existingEmails as any[]).length > 0) {
      throw new Error('邮箱已存在');
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);

    // 创建用户
    const [result] = await pool.execute(
      'INSERT INTO users (username, password, email) VALUES (?, ?, ?)',
      [username, hashedPassword, email]
    );

    const newUser = {
      id: (result as any).insertId,
      username,
      email,
      created_at: new Date(),
    };

    // 生成JWT token
    const jwtPayload: Omit<JwtPayload, 'exp' | 'iat'> = {
      userId: newUser.id,
      username: newUser.username,
      email: newUser.email,
    };

    const token = generateToken(jwtPayload);

    return {
      token,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        createdAt: newUser.created_at,
      },
    };
  }

  /**
   * 根据用户ID获取用户信息
   * @param userId 用户ID
   * @returns 用户信息
   */
  async getUserById(userId: number) {
    const [users] = await pool.execute(
      'SELECT id, username, email, created_at FROM users WHERE id = ?',
      [userId]
    );

    const user = (users as any[])[0];

    if (!user) {
      throw new Error('用户不存在');
    }

    // 获取用户权限
    const [permissions] = await pool.execute(
      `SELECT p.name FROM permissions p
       JOIN user_permissions up ON p.id = up.permission_id
       WHERE up.user_id = ?`,
      [userId]
    );

    return {
      ...user,
      userPermissions: (permissions as any[]).map(p => ({ permission: { name: p.name } })),
    };
  }
}

// 导出认证服务实例
export const authService = new AuthService();



