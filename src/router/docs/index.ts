import { Router, Request, Response } from 'express';
import { DocsService } from './docs-service';
import { authMiddleware } from '../auth/auth-middleware';
import { AuthRequest } from '../auth/types';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// 创建上传目录（如果不存在）
const uploadDir = path.join(__dirname, '../../../../public/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 配置multer存储
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // 使用当前时间戳和原始文件名来生成唯一的文件名
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// 创建multer实例
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB
  },
  fileFilter: (req, file, cb) => {
    // 允许的文件类型
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|txt|md/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('只允许上传图片、文档和文本文件！'));
    }
  }
});

export const createDocsRoutes = () => {
  const router = Router();

  // ==================== Docs 接口 ====================
  // 创建文档
  router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
    req.log.info('收到创建文档请求');
    try {
      const doc = await DocsService.createDoc({
        ...req.body,
        authorId: req.user?.id as number
      });
      res.status(201).json(doc);
    } catch (error) {
      req.log.error(`创建文档失败: ${error instanceof Error ? error.message : String(error)}`);
      res.status(400).json({
        message: error instanceof Error ? error.message : '创建文档失败',
      });
    }
  });

  // 文件上传
  router.post('/upload', authMiddleware, upload.any(), async (req: AuthRequest, res: Response) => {
    req.log.info('收到文件上传请求');
    try {
      if (!req.files || (req.files as any[]).length === 0) {
        // 打印所有收到的字段，查看实际的字段名称
        req.log.info('未找到文件字段，收到的所有字段:', Object.keys(req.body));
        return res.status(400).json({ message: '未选择文件' });
      }

      const file = (req.files as any[])[0];
      const fileData = {
        originalname: file.originalname,
        filename: file.filename,
        filePath: `/uploads/${file.filename}`, // 返回相对路径，前端可以通过BASE_URL访问
        fileSize: file.size,
        mimetype: file.mimetype
      };

      res.status(200).json(fileData);
    } catch (error) {
      req.log.error(`文件上传失败: ${error instanceof Error ? error.message : String(error)}`);
      res.status(400).json({
        message: error instanceof Error ? error.message : '文件上传失败',
      });
    }
  });

  // 获取所有文档
  router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
    req.log.info('收到获取所有文档请求');
    try {
      // 从查询参数获取分页信息
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 10;

      const docs = await DocsService.getDocs(page, pageSize);
      res.json(docs);
    } catch (error) {
      req.log.error(`获取文档列表失败: ${error instanceof Error ? error.message : String(error)}`);
      res.status(500).json({
        message: error instanceof Error ? error.message : '获取文档列表失败',
      });
    }
  });

  // 获取单个文档
  router.get('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
    req.log.info(`收到获取文档请求，ID: ${req.params.id}`);
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ message: '无效的文档ID' });
      }

      const doc = await DocsService.getDocById(id);
      if (!doc) {
        return res.status(404).json({ message: '文档不存在' });
      }

      // 检查权限：如果文档不公开，只能作者访问
      if (!doc.isPublic && doc.authorId !== req.user?.id) {
        return res.status(403).json({ message: '无权限访问此文档' });
      }

      res.json(doc);
    } catch (error) {
      req.log.error(`获取文档失败: ${error instanceof Error ? error.message : String(error)}`);
      res.status(500).json({
        message: error instanceof Error ? error.message : '获取文档失败',
      });
    }
  });

  // 更新文档
  router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
    req.log.info(`收到更新文档请求，ID: ${req.params.id}`);
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ message: '无效的文档ID' });
      }

      // 检查文档是否存在
      const existingDoc = await DocsService.getDocById(id);
      if (!existingDoc) {
        return res.status(404).json({ message: '文档不存在' });
      }

      // 检查权限：只能作者更新
      if (existingDoc.authorId !== req.user?.id) {
        return res.status(403).json({ message: '无权限更新此文档' });
      }

      const updatedDoc = await DocsService.updateDoc(id, req.body);
      res.json(updatedDoc);
    } catch (error) {
      req.log.error(`更新文档失败: ${error instanceof Error ? error.message : String(error)}`);
      res.status(400).json({
        message: error instanceof Error ? error.message : '更新文档失败',
      });
    }
  });

  // 删除文档
  router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
    req.log.info(`收到删除文档请求，ID: ${req.params.id}`);
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ message: '无效的文档ID' });
      }

      // 检查文档是否存在
      const existingDoc = await DocsService.getDocById(id);
      if (!existingDoc) {
        return res.status(404).json({ message: '文档不存在' });
      }

      // 检查权限：只能作者删除
      if (existingDoc.authorId !== req.user?.id) {
        return res.status(403).json({ message: '无权限删除此文档' });
      }

      await DocsService.deleteDoc(id);
      res.json({ message: '文档删除成功' });
    } catch (error) {
      req.log.error(`删除文档失败: ${error instanceof Error ? error.message : String(error)}`);
      res.status(500).json({
        message: error instanceof Error ? error.message : '删除文档失败',
      });
    }
  });

  // 获取当前用户的文档
  router.get('/author/me', authMiddleware, async (req: AuthRequest, res: Response) => {
    req.log.info('收到获取当前用户文档请求');
    try {
      const docs = await DocsService.getDocsByAuthorId(req.user?.id as number);
      res.json(docs);
    } catch (error) {
      req.log.error(`获取用户文档失败: ${error instanceof Error ? error.message : String(error)}`);
      res.status(500).json({
        message: error instanceof Error ? error.message : '获取用户文档失败',
      });
    }
  });

  return router;
};
