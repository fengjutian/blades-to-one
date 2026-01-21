import { prisma } from '../../db';
import { Docs, Prisma } from '../../generated/prisma/client';

export interface CreateDocInput {
  name: string;
  description?: string;
  type: string;
  authorId: number;
  filePath?: string;
  fileSize?: number;
  isPublic?: boolean;
  status?: string;
}

export interface UpdateDocInput {
  name?: string;
  description?: string;
  type?: string;
  filePath?: string;
  fileSize?: number;
  isPublic?: boolean;
  status?: string;
}

export class DocsService {
  /**
   * 创建新的文档
   */
  static async createDoc(data: CreateDocInput): Promise<Docs> {
    try {
      // 验证必填字段
      if (!data.name || !data.type || !data.authorId) {
        throw new Error('Name, type and authorId are required fields');
      }

      // 构建Prisma创建数据
      const createData: Prisma.DocsCreateInput = {
        name: data.name,
        description: data.description,
        type: data.type,
        author: { connect: { id: data.authorId } },
        filePath: data.filePath,
        fileSize: data.fileSize,
        isPublic: data.isPublic ?? true,
        status: data.status ?? 'active',
      };

      const doc = await prisma.docs.create({
        data: createData,
        include: {
          author: { select: { id: true, username: true, email: true } },
        },
      });

      console.log('Created doc successfully:', doc.id);
      return doc;
    } catch (error) {
      console.error('Error in createDoc:', error);
      if (error instanceof Error) {
        console.error('Error message:', error.message);
      }
      throw error;
    }
  }

  /**
   * 获取所有文档（支持分页）
   */
  static async getDocs(page: number = 1, pageSize: number = 10): Promise<{ total: number; data: Docs[] }> {
    try {
      // 获取总记录数
      const total = await prisma.docs.count();

      // 计算偏移量
      const skip = (page - 1) * pageSize;

      const docs = await prisma.docs.findMany({
        include: {
          author: { select: { id: true, username: true, email: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: pageSize,
      });

      return { total, data: docs };
    } catch (error) {
      console.error('Error in getDocs:', error);
      throw error;
    }
  }

  /**
   * 获取单个文档
   */
  static async getDocById(id: number): Promise<Docs | null> {
    try {
      const doc = await prisma.docs.findUnique({
        where: { id },
        include: {
          author: { select: { id: true, username: true, email: true } },
        },
      });
      return doc;
    } catch (error) {
      console.error('Error in getDocById:', error);
      throw error;
    }
  }

  /**
   * 更新文档
   */
  static async updateDoc(id: number, data: UpdateDocInput): Promise<Docs | null> {
    try {
      // 构建Prisma更新数据
      const updateData: Prisma.DocsUpdateInput = {};

      if (data.name !== undefined) updateData.name = data.name;
      if (data.description !== undefined) updateData.description = data.description;
      if (data.type !== undefined) updateData.type = data.type;
      if (data.filePath !== undefined) updateData.filePath = data.filePath;
      if (data.fileSize !== undefined) updateData.fileSize = data.fileSize;
      if (data.isPublic !== undefined) updateData.isPublic = data.isPublic;
      if (data.status !== undefined) updateData.status = data.status;

      const doc = await prisma.docs.update({
        where: { id },
        data: updateData,
        include: {
          author: { select: { id: true, username: true, email: true } },
        },
      });

      console.log('Updated doc successfully:', doc.id);
      return doc;
    } catch (error) {
      console.error('Error in updateDoc:', error);
      throw error;
    }
  }

  /**
   * 删除文档
   */
  static async deleteDoc(id: number): Promise<boolean> {
    try {
      await prisma.docs.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      console.error('Error in deleteDoc:', error);
      throw error;
    }
  }

  /**
   * 根据作者ID获取文档
   */
  static async getDocsByAuthorId(authorId: number): Promise<Docs[]> {
    try {
      const docs = await prisma.docs.findMany({
        where: { authorId },
        include: {
          author: { select: { id: true, username: true, email: true } },
        },
        orderBy: { createdAt: 'desc' },
      });
      return docs;
    } catch (error) {
      console.error('Error in getDocsByAuthorId:', error);
      throw error;
    }
  }
}

