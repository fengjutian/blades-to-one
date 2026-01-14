// 使用JavaScript创建测试数据，避免TypeScript模块循环依赖问题
const { PrismaClient } = require('../src/generated/prisma/client');
const bcrypt = require('bcryptjs');

// 创建Prisma客户端实例
const prisma = new PrismaClient();

async function generateTestData() {
  try {
    console.log('开始生成测试数据...');

    // 1. 检查并创建测试用户
    let testUser = await prisma.user.findUnique({
      where: {
        username: 'test'
      }
    });

    if (!testUser) {
      console.log('创建测试用户...');
      const hashedPassword = await bcrypt.hash('test123', 10);
      testUser = await prisma.user.create({
        data: {
          username: 'test',
          password: hashedPassword,
          email: 'test@example.com'
        }
      });
      console.log('测试用户创建成功:', testUser.username);
    } else {
      console.log('测试用户已存在:', testUser.username);
    }

    // 2. 创建测试prompts
    console.log('创建测试prompts...');
    const promptsData = [
      {
        title: 'SQL查询优化',
        description: '用于优化复杂SQL查询的prompt',
        content: '请优化以下SQL查询，使其性能更好：\nSELECT * FROM orders o JOIN customers c ON o.customer_id = c.id WHERE o.order_date > "2023-01-01" AND c.country = "China"',
        tags: 'SQL,优化,查询',
        version: 1,
        status: 'active',
        author_id: testUser.id,
        category: 'SQL',
        usage_count: 15,
        last_used_at: new Date('2023-12-15T10:30:00Z'),
        is_public: true,
        source: '用户上传',
        remarks: '这是一个常用的SQL优化prompt',
        role: 'developer'
      },
      {
        title: '用户故事生成',
        description: '根据需求生成用户故事的prompt',
        content: '请为一个在线购物平台生成10个用户故事，涵盖注册、浏览商品、购买、支付和售后等流程',
        tags: 'NLP,用户故事,产品',
        version: 2,
        status: 'active',
        author_id: testUser.id,
        category: 'NLP',
        usage_count: 8,
        last_used_at: new Date('2023-12-20T14:45:00Z'),
        is_public: true,
        source: '系统生成',
        remarks: '第二版，增加了更多场景',
        role: 'product_manager'
      },
      {
        title: '图像描述生成',
        description: '生成图像描述的prompt',
        content: '请详细描述以下图像内容，包括场景、人物、物体、颜色和氛围等：\n[图像URL]',
        tags: '图像生成,描述,视觉',
        version: 1,
        status: 'draft',
        author_id: testUser.id,
        category: '图像生成',
        usage_count: 0,
        is_public: false,
        source: '用户上传',
        remarks: '草稿，需要完善',
        role: 'designer'
      },
      {
        title: '代码注释生成',
        description: '为代码生成详细注释的prompt',
        content: '请为以下JavaScript函数生成详细的JSDoc注释：\nfunction calculateTotalPrice(items) {\n  return items.reduce((total, item) => total + item.price * item.quantity, 0);\n}',
        tags: '代码,注释,JavaScript',
        version: 1,
        status: 'active',
        author_id: testUser.id,
        category: 'NLP',
        usage_count: 12,
        last_used_at: new Date('2023-12-25T09:15:00Z'),
        is_public: true,
        source: '系统生成',
        remarks: '非常实用的代码注释工具',
        role: 'developer'
      },
      {
        title: '会议议程生成',
        description: '生成会议议程的prompt',
        content: '请为一个技术团队的每周站会生成会议议程，包括时间分配和讨论要点',
        tags: '会议,组织,管理',
        version: 1,
        status: 'active',
        author_id: testUser.id,
        category: '对话模型',
        usage_count: 5,
        last_used_at: new Date('2023-12-28T16:20:00Z'),
        is_public: true,
        source: '用户上传',
        remarks: '提高会议效率的好工具',
        role: 'manager'
      }
    ];

    // 批量创建prompts
    const createdPrompts = await prisma.prompts.createMany({
      data: promptsData,
      skipDuplicates: true // 跳过重复项
    });

    console.log(`成功创建了 ${createdPrompts.count} 个测试prompts`);
    console.log('所有测试数据生成完成！');

  } catch (error) {
    console.error('生成测试数据失败:', error);
  } finally {
    // 断开数据库连接
    await prisma.$disconnect();
  }
}

// 执行函数
generateTestData();

