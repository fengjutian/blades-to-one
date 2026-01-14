import { prisma } from '../../db';
import { Category } from '../../generated/prisma/client';

export interface CreateCategoryInput {
  name: string;
}

export interface UpdateCategoryInput {
  name?: string;
}

export class CategoryService {
  /**
   * 创建新分类
   */
  static async createCategory(input: CreateCategoryInput): Promise<Category> {
    return prisma.category.create({
      data: {
        name: input.name,
      },
    });
  }

  /**
   * 获取所有分类
   */
  static async getCategories(): Promise<Category[]> {
    return prisma.category.findMany({
      include: {
        prompts: false, // 默认不包含关联的prompts
      },
    });
  }

  /**
   * 根据ID获取分类
   */
  static async getCategoryById(id: number): Promise<Category | null> {
    return prisma.category.findUnique({
      where: { id },
      include: {
        prompts: true, // 获取分类时包含关联的prompts
      },
    });
  }

  /**
   * 更新分类
   */
  static async updateCategory(id: number, input: UpdateCategoryInput): Promise<Category | null> {
    return prisma.category.update({
      where: { id },
      data: input,
    });
  }

  /**
   * 删除分类
   */
  static async deleteCategory(id: number): Promise<Category | null> {
    return prisma.category.delete({
      where: { id },
    });
  }
}
