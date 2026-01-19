const { PrismaClient } = require('./src/generated/prisma/client');
const prisma = new PrismaClient();

async function initCategories() {
  try {
    console.log('开始初始化Category数据...');

    // 定义要创建的默认分类
    const defaultCategories = [
      { name: 'SQL' },
      { name: 'NLP' },
      { name: '图像生成' },
      { name: '对话模型' },
      { name: '代码生成' },
      { name: '数据分析' }
    ];

    // 逐个创建分类
    for (const category of defaultCategories) {
      // 检查分类是否已存在
      const existingCategory = await prisma.category.findFirst({
        where: { name: category.name }
      });

      if (existingCategory) {
        console.log(`分类 "${category.name}" 已存在，ID: ${existingCategory.id}`);
      } else {
        const newCategory = await prisma.category.create({
          data: category
        });
        console.log(`分类 "${category.name}" 创建成功，ID: ${newCategory.id}`);
      }
    }

    console.log('Category数据初始化完成！');
  } catch (error) {
    console.error('初始化Category数据时发生错误:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// 执行初始化函数
initCategories();