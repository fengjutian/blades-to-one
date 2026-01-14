import React from 'react';
import { Table, Tag } from '@douyinfe/semi-ui';
import styles from './prompts.module.scss';

const Prompts: React.FC = () => {
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            width: 60,
        },
        {
            title: '标题',
            dataIndex: 'title',
            width: 200,
        },
        {
            title: '描述',
            dataIndex: 'description',
            width: 250,
        },
        {
            title: '分类',
            dataIndex: 'category',
            width: 120,
        },
        {
            title: '标签',
            dataIndex: 'tags',
            width: 180,
            render: (tags: string) => {
                return tags.split(',').map(tag => (
                    <Tag key={tag} color="blue" size="small">{tag}</Tag>
                ));
            },
        },
        {
            title: '版本',
            dataIndex: 'version',
            width: 80,
        },
        {
            title: '状态',
            dataIndex: 'status',
            width: 120,
            render: (status: string) => {
                const statusMap: Record<string, string> = {
                    active: 'green',
                    draft: 'yellow',
                    deprecated: 'red',
                    archived: 'grey',
                };
                return <Tag color={statusMap[status] || 'default'}>{status}</Tag>;
            },
        },
        {
            title: '作者ID',
            dataIndex: 'author_id',
            width: 100,
        },
        {
            title: '使用次数',
            dataIndex: 'usage_count',
            width: 100,
        },
        {
            title: '是否公开',
            dataIndex: 'is_public',
            width: 100,
            render: (isPublic: number) => {
                return isPublic === 1 ? <Tag color="green">公开</Tag> : <Tag color="red">私有</Tag>;
            },
        },
        {
            title: '来源',
            dataIndex: 'source',
            width: 120,
        },
        {
            title: '角色',
            dataIndex: 'role',
            width: 100,
        },
        {
            title: '创建时间',
            dataIndex: 'created_at',
            width: 180,
        },
        {
            title: '更新时间',
            dataIndex: 'updated_at',
            width: 180,
        },
    ];

    const data = [
        {
            key: '1',
            id: 1,
            title: '生成SQL语句',
            description: '根据需求生成SQL建表和插入语句',
            content: '请生成建表及插入语句...',
            tags: 'sql,测试,prompt',
            version: 1,
            status: 'active',
            author_id: 101,
            category: 'SQL',
            usage_count: 10,
            last_used_at: '2023-01-01 12:00:00',
            is_public: 1,
            source: '系统生成',
            remarks: '用于开发测试',
            role: 'developer',
            created_at: '2023-01-01 12:00:00',
            updated_at: '2023-01-01 12:00:00',
        },
        {
            key: '2',
            id: 2,
            title: '文本情感分析',
            description: '分析文本情感的prompt',
            content: '请分析以下文本的情感倾向...',
            tags: 'nlp,情感分析,测试',
            version: 1,
            status: 'active',
            author_id: 102,
            category: 'NLP',
            usage_count: 25,
            last_used_at: '2023-01-02 13:30:00',
            is_public: 1,
            source: '用户上传',
            remarks: '',
            role: 'user',
            created_at: '2023-01-02 13:30:00',
            updated_at: '2023-01-02 13:30:00',
        },
        {
            key: '3',
            id: 3,
            title: '图像生成示例',
            description: '生成图片的prompt示例',
            content: '生成一张未来城市风格的图片...',
            tags: 'ai,图像生成,prompt',
            version: 2,
            status: 'draft',
            author_id: 103,
            category: '图像生成',
            usage_count: 5,
            last_used_at: '2023-01-03 15:45:00',
            is_public: 0,
            source: '系统生成',
            remarks: '版本2测试',
            role: 'ai',
            created_at: '2023-01-03 15:45:00',
            updated_at: '2023-01-03 15:45:00',
        },
        {
            key: '4',
            id: 4,
            title: '对话模型训练',
            description: '用于训练聊天模型的prompt',
            content: '假设你是客服机器人，回答用户问题...',
            tags: 'ai,chatbot,prompt',
            version: 1,
            status: 'active',
            author_id: 101,
            category: '对话模型',
            usage_count: 40,
            last_used_at: '2023-01-04 09:15:00',
            is_public: 1,
            source: '用户上传',
            remarks: '常用训练样例',
            role: 'developer',
            created_at: '2023-01-04 09:15:00',
            updated_at: '2023-01-04 09:15:00',
        },
        {
            key: '5',
            id: 5,
            title: 'SQL优化建议',
            description: '用于SQL优化提示',
            content: '请给出查询优化建议...',
            tags: 'sql,优化,提示',
            version: 3,
            status: 'deprecated',
            author_id: 104,
            category: 'SQL',
            usage_count: 15,
            last_used_at: '2023-01-05 11:20:00',
            is_public: 1,
            source: '系统生成',
            remarks: '历史版本',
            role: 'admin',
            created_at: '2023-01-05 11:20:00',
            updated_at: '2023-01-05 11:20:00',
        },
    ];

    return (
      <div className={styles.promptsCtx}>
        <Table
          bordered={true}
          columns={columns}
          dataSource={data}
          pagination={{ pageSize: 10 }}
          scroll={{ x: 800 }}
        />
      </div>
    );
};

export default Prompts;
