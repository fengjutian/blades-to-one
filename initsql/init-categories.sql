-- 初始化Category数据
INSERT INTO categories (name, created_at, updated_at) VALUES
('SQL', NOW(), NOW()),
('NLP', NOW(), NOW()),
('图像生成', NOW(), NOW()),
('对话模型', NOW(), NOW()),
('代码生成', NOW(), NOW()),
('数据分析', NOW(), NOW())
ON DUPLICATE KEY UPDATE name=name; -- 如果已存在，则不做任何更改