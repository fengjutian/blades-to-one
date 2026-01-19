import { Router, Request, Response } from 'express';
import { CategoryService } from './category-service';
import { PromptService } from './prompt-service';
import { authMiddleware } from '../auth/auth-middleware';
import { AuthRequest } from '../auth/types';

export const createPromptsRoutes = () => {
  const router = Router();

  // ==================== Category 接口 ====================
  // 创建分类
  router.post('/categories', async (req, res) => {
    req.log.info('收到创建分类请求');
    try {
      const category = await CategoryService.createCategory(req.body);
      res.status(201).json(category);
    } catch (error) {
      req.log.error(`创建分类失败: ${error instanceof Error ? error.message : String(error)}`);
      res.status(400).json({
        message: error instanceof Error ? error.message : '创建分类失败',
      });
    }
  });

  // 获取所有分类
  router.get('/categories', async (req, res) => {
    req.log.info('收到获取所有分类请求');
    try {
      const categories = await CategoryService.getCategories();
      res.json(categories);
    } catch (error) {
      req.log.error(`获取分类列表失败: ${error instanceof Error ? error.message : String(error)}`);
      res.status(500).json({
        message: error instanceof Error ? error.message : '获取分类列表失败',
      });
    }
  });

  // 获取单个分类
  router.get('/categories/:id', async (req, res) => {
    req.log.info(`收到获取分类请求，ID: ${req.params.id}`);
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ message: '无效的分类ID' });
      }

      const category = await CategoryService.getCategoryById(id);
      if (!category) {
        return res.status(404).json({ message: '分类不存在' });
      }

      res.json(category);
    } catch (error) {
      req.log.error(`获取分类失败，ID: ${req.params.id}: ${error instanceof Error ? error.message : String(error)}`);
      res.status(500).json({
        message: error instanceof Error ? error.message : '获取分类失败',
      });
    }
  });

  // 更新分类
  router.put('/categories/:id', async (req, res) => {
    req.log.info(`收到更新分类请求，ID: ${req.params.id}`);
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ message: '无效的分类ID' });
      }

      const category = await CategoryService.updateCategory(id, req.body);
      if (!category) {
        return res.status(404).json({ message: '分类不存在' });
      }

      res.json(category);
    } catch (error) {
      req.log.error(`更新分类失败，ID: ${req.params.id}: ${error instanceof Error ? error.message : String(error)}`);
      res.status(400).json({
        message: error instanceof Error ? error.message : '更新分类失败',
      });
    }
  });

  // 删除分类
  router.delete('/categories/:id', async (req, res) => {
    req.log.info(`收到删除分类请求，ID: ${req.params.id}`);
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ message: '无效的分类ID' });
      }

      const category = await CategoryService.deleteCategory(id);
      if (!category) {
        return res.status(404).json({ message: '分类不存在' });
      }

      res.json({ message: '分类删除成功' });
    } catch (error) {
      req.log.error(`删除分类失败，ID: ${req.params.id}: ${error instanceof Error ? error.message : String(error)}`);
      res.status(500).json({
        message: error instanceof Error ? error.message : '删除分类失败',
      });
    }
  });

  // ==================== Prompt 接口 ====================
  // 创建Prompt
  router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
      // 从请求对象中获取用户ID
      if (!req.user) {
        return res.status(401).json({ error: '用户未认证' });
      }

      // 将用户ID添加到请求体中作为author_id
      const prompt = await PromptService.createPrompt({
        ...req.body,
        author_id: req.user.userId
      });

      req.log.info(`创建Prompt成功，ID: ${prompt.id}`);
      res.status(201).json(prompt);
    } catch (error) {
      // 记录详细的错误信息
      console.error('创建Prompt失败的详细错误:', error);
      req.log.error(`创建Prompt失败: ${error instanceof Error ? error.message : String(error)}`);
      req.log.error(`错误堆栈: ${error instanceof Error ? error.stack : '无堆栈信息'}`);

      // 返回更详细的错误信息给客户端
      res.status(500).json({
        error: '创建Prompt失败',
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });

  // 获取所有Prompt
  router.get('/', async (req: Request, res: Response) => {
    try {
      const result = await PromptService.getAllPrompts(req.query);
      req.log.info(`获取Prompts列表成功，共 ${result.total} 条`);
      res.status(200).json(result);
    } catch (error) {
      req.log.error(`获取Prompts列表失败: ${error instanceof Error ? error.message : String(error)}`);
      res.status(500).json({ error: '获取Prompts列表失败' });
    }
  });

  // 获取单个Prompt
  router.get('/:id', async (req: Request, res: Response) => {
    try {
      const prompt = await PromptService.getPromptById(parseInt(req.params.id, 10));
      if (!prompt) {
        req.log.warn(`Prompt不存在，ID: ${req.params.id}`);
        res.status(404).json({ error: 'Prompt不存在' });
        return;
      }
      req.log.info(`获取Prompt成功，ID: ${req.params.id}`);
      res.status(200).json(prompt);
    } catch (error) {
      req.log.error(`获取Prompt失败，ID: ${req.params.id}: ${error instanceof Error ? error.message : String(error)}`);
      res.status(500).json({ error: '获取Prompt失败' });
    }
  });

  // 更新Prompt
  router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
      // 从请求对象中获取用户ID
      if (!req.user) {
        return res.status(401).json({ error: '用户未认证' });
      }

      const promptId = parseInt(req.params.id, 10);

      // 先检查Prompt是否存在以及是否属于当前用户
      const existingPrompt = await PromptService.getPromptById(promptId);
      if (!existingPrompt) {
        req.log.warn(`更新Prompt失败，ID: ${promptId} 不存在`);
        return res.status(404).json({ error: 'Prompt不存在' });
      }

      // 检查是否是Prompt的作者
      if (existingPrompt.author_id !== req.user.userId) {
        return res.status(403).json({ error: '无权修改该Prompt' });
      }

      const prompt = await PromptService.updatePrompt(promptId, req.body);

      req.log.info(`更新Prompt成功，ID: ${promptId}`);
      res.status(200).json(prompt);
    } catch (error) {
      req.log.error(`更新Prompt失败，ID: ${req.params.id}: ${error instanceof Error ? error.message : String(error)}`);
      res.status(500).json({ error: '更新Prompt失败' });
    }
  });

  // 删除Prompt
  router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
      // 从请求对象中获取用户ID
      if (!req.user) {
        return res.status(401).json({ error: '用户未认证' });
      }

      const promptId = parseInt(req.params.id, 10);

      // 先检查Prompt是否存在以及是否属于当前用户
      const existingPrompt = await PromptService.getPromptById(promptId);
      if (!existingPrompt) {
        req.log.warn(`删除Prompt失败，ID: ${promptId} 不存在`);
        return res.status(404).json({ error: 'Prompt不存在' });
      }

      // 检查是否是Prompt的作者
      if (existingPrompt.author_id !== req.user.userId) {
        return res.status(403).json({ error: '无权删除该Prompt' });
      }

      const deleted = await PromptService.deletePrompt(promptId);

      req.log.info(`删除Prompt成功，ID: ${promptId}`);
      res.status(204).end();
    } catch (error) {
      req.log.error(`删除Prompt失败，ID: ${req.params.id}: ${error instanceof Error ? error.message : String(error)}`);
      res.status(500).json({ error: '删除Prompt失败' });
    }
  });

  // 增加使用次数
  router.post('/:id/usage', async (req: Request, res: Response) => {
    try {
      const prompt = await PromptService.incrementUsageCount(parseInt(req.params.id, 10));
      if (!prompt) {
        req.log.warn(`增加Prompt使用次数失败，ID: ${req.params.id} 不存在`);
        res.status(404).json({ error: 'Prompt不存在' });
        return;
      }
      req.log.info(`增加Prompt使用次数成功，ID: ${req.params.id}，当前使用次数: ${prompt.usage_count}`);
      res.status(200).json(prompt);
    } catch (error) {
      req.log.error(`增加Prompt使用次数失败，ID: ${req.params.id}: ${error instanceof Error ? error.message : String(error)}`);
      res.status(500).json({ error: '增加Prompt使用次数失败' });
    }
  });

  return router;
}