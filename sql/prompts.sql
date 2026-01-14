CREATE TABLE prompts (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    title VARCHAR(255) NOT NULL COMMENT 'prompt 标题',
    description TEXT COMMENT 'prompt 描述',
    content TEXT NOT NULL COMMENT 'prompt 内容',
    tags VARCHAR(255) COMMENT '标签, 用逗号分隔',
    version INT DEFAULT 1 COMMENT 'prompt 版本号',
    status VARCHAR(50) DEFAULT 'active' COMMENT '状态: active/draft/deprecated/archived',
    author_id INT COMMENT '作者ID, 可关联用户表',
    category VARCHAR(100) COMMENT '分类: SQL/NLP/图像生成/对话模型等',
    usage_count INT DEFAULT 0 COMMENT '使用次数统计',
    last_used_at TIMESTAMP NULL COMMENT '最近使用时间',
    is_public TINYINT(1) DEFAULT 1 COMMENT '是否公开: 1=公开, 0=私有',
    source VARCHAR(255) COMMENT '来源说明, 例如系统生成/用户上传',
    remarks TEXT COMMENT '备注信息',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
);

INSERT INTO prompts
(title, description, content, tags, version, status, author_id, category, usage_count, last_used_at, is_public, source, remarks)
VALUES
('生成SQL语句', '根据需求生成SQL建表和插入语句', '请生成建表及插入语句...', 'sql,测试,prompt', 1, 'active', 101, 'SQL', 10, NOW(), 1, '系统生成', '用于开发测试'),
('文本情感分析', '分析文本情感的prompt', '请分析以下文本的情感倾向...', 'nlp,情感分析,测试', 1, 'active', 102, 'NLP', 25, NOW(), 1, '用户上传', ''),
('图像生成示例', '生成图片的prompt示例', '生成一张未来城市风格的图片...', 'ai,图像生成,prompt', 2, 'draft', 103, '图像生成', 5, NOW(), 0, '系统生成', '版本2测试'),
('对话模型训练', '用于训练聊天模型的prompt', '假设你是客服机器人，回答用户问题...', 'ai,chatbot,prompt', 1, 'active', 101, '对话模型', 40, NOW(), 1, '用户上传', '常用训练样例'),
('SQL优化建议', '用于SQL优化提示', '请给出查询优化建议...', 'sql,优化,提示', 3, 'deprecated', 104, 'SQL', 15, NOW(), 1, '系统生成', '历史版本');
