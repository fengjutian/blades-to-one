import { Router, type Request, type Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { authenticateToken } from '../../auth/middleware';

const router = Router();

// 确保上传目录存在
const uploadDir = path.join(__dirname, '../../../public/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 配置 multer 存储
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // 生成唯一文件名，避免冲突
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const fileName = path.basename(file.originalname, ext) + '-' + uniqueSuffix + ext;
    cb(null, fileName);
  }
});

// 创建 multer 实例
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 限制文件大小为 50MB
  },
  fileFilter: (req, file, cb) => {
    // 允许的文件类型
    const allowedTypes = [
      '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx',
      '.txt', '.jpg', '.jpeg', '.png', '.gif'
    ];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('不支持的文件类型'), false);
    }
  }
});

/**
 * 上传文件接口
 * POST /docs/upload
 */
router.post('/upload', authenticateToken, upload.single('file'), (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: '没有文件被上传' });
    }

    // 构建相对文件路径，用于存储到数据库
    const relativePath = `/uploads/${req.file.filename}`;

    // 返回文件路径给前端
    res.status(200).json({
      message: '文件上传成功',
      filePath: relativePath,
      fileName: req.file.originalname,
      fileSize: req.file.size
    });
  } catch (error) {
    console.error('文件上传失败:', error);
    res.status(500).json({ message: '文件上传失败', error: (error as Error).message });
  }
});

/**
 * 删除文件接口
 * DELETE /docs/upload
 */
router.delete('/upload', authenticateToken, (req: Request, res: Response) => {
  try {
    const { filePath } = req.body;

    if (!filePath) {
      return res.status(400).json({ message: '文件路径不能为空' });
    }

    // 构建绝对文件路径
    const absolutePath = path.join(__dirname, '../../../public', filePath);

    // 检查文件是否存在
    if (fs.existsSync(absolutePath)) {
      // 删除文件
      fs.unlinkSync(absolutePath);
      res.status(200).json({ message: '文件删除成功' });
    } else {
      res.status(404).json({ message: '文件不存在' });
    }
  } catch (error) {
    console.error('文件删除失败:', error);
    res.status(500).json({ message: '文件删除失败', error: (error as Error).message });
  }
});

export default router;
