import { Request, Response, NextFunction } from 'express';
import { verifyToken } from './token-utils';
import { JwtPayload, AuthRequest } from './types';

/**
 * 认证中间件
 * 解析请求头中的token并将用户信息添加到请求对象中
 */
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // 从请求头获取token
  const authHeader = req.headers.authorization;
  
  // 如果没有token，直接返回401错误
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: '未提供认证token' });
  }
  
  // 提取token部分
  const token = authHeader.substring(7);
  
  // 验证token
  const decoded = verifyToken(token);
  
  // 如果token无效，返回401错误
  if (!decoded) {
    return res.status(401).json({ message: '无效的认证token' });
  }
  
  // 将用户信息添加到请求对象中
  (req as AuthRequest).user = {
    userId: decoded.userId,
    username: decoded.username,
    email: decoded.email
  };
  
  // 继续处理请求
  next();
};
