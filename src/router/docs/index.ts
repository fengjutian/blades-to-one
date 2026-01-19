import { Router, Request, Response } from 'express';
import { DocsService } from './docs-service';
import { authMiddleware } from '../auth/auth-middleware';
import { AuthRequest } from '../auth/types';

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

  // 获取所有文档
  router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
    req.log.info('收到获取所有文档请求');
    try {
      const docs = await DocsService.getDocs();
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
