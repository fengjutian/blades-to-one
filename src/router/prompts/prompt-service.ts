import { prisma } from '../../db';
import { Prompts, Prisma } from '../../generated/prisma/client';
import { CreatePromptInput, UpdatePromptInput, GetPromptsQuery } from '../../types/prompts.schems';

export class PromptService {
  /**
   * 创建新的Prompt
   */
  static async createPrompt(data: CreatePromptInput): Promise<Prompts> {
    return prisma.prompts.create({
      data,
      include: {
        category: true,
        author: { select: { id: true, username: true, email: true } },
      },
    });
  }

  /**
   * 获取所有Prompts，支持分页、筛选和排序
   */
  static async getAllPrompts(query: GetPromptsQuery) {
    const { page = 1, pageSize = 20, categoryId, status, tags, search, sortBy = 'updated_at', sortOrder = 'desc' } = query;
    const skip = (page - 1) * pageSize;

    // 构建筛选条件
    const where: Prisma.PromptsWhereInput = {};

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (status) {
      where.status = status;
    }

    if (tags) {
      where.tags = { contains: tags };
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { content: { contains: search } },
        { tags: { contains: search } }
      ];
    }

    // 构建排序条件
    const orderBy: any = {};
    orderBy[sortBy] = sortOrder;

    try {
      // 获取总数
      const total = await prisma.prompts.count({ where });

      // 获取分页数据
      const prompts = await prisma.prompts.findMany({
        where,
        orderBy,
        skip,
        take: pageSize,
        include: {
          category: true,
          author: { select: { id: true, username: true, email: true } }
        }
      });

      return {
        prompts,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize)
      };
    } catch (error) {
      console.error('获取Prompts失败:', error);
      throw new Error('获取Prompts失败');
    }
  }

  /**
   * 根据ID获取单个Prompt
   */
  static async getPromptById(id: number): Promise<Prompts | null> {
    return prisma.prompts.findUnique({
      where: { id },
      include: {
        category: true,
        author: { select: { id: true, username: true, email: true } },
      },
    });
  }

  /**
   * 更新Prompt
   */
  static async updatePrompt(id: number, data: UpdatePromptInput): Promise<Prompts | null> {
    try {
      return prisma.prompts.update({
        where: { id },
        data,
        include: {
          category: true,
          author: { select: { id: true, username: true, email: true } },
        },
      });
    } catch (error) {
      if ((error as Prisma.PrismaClientKnownRequestError).code === 'P2025') {
        return null;
      }
      throw error;
    }
  }

  /**
   * 删除Prompt
   */
  static async deletePrompt(id: number): Promise<boolean> {
    try {
      await prisma.prompts.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      if ((error as Prisma.PrismaClientKnownRequestError).code === 'P2025') {
        return false;
      }
      throw error;
    }
  }

  /**
   * 增加Prompt使用次数
   */
  static async incrementUsageCount(id: number): Promise<Prompts | null> {
    try {
      return prisma.prompts.update({
        where: { id },
        data: {
          usage_count: { increment: 1 },
          last_used_at: new Date(),
        },
        include: {
          category: true,
          author: { select: { id: true, username: true, email: true } },
        },
      });
    } catch (error) {
      if ((error as Prisma.PrismaClientKnownRequestError).code === 'P2025') {
        return null;
      }
      throw error;
    }
  }
}
