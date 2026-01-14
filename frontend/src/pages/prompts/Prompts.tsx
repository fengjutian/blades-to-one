import React, { useState, useEffect, useMemo } from 'react';
import { Table, Tag } from '@douyinfe/semi-ui';
import styles from './prompts.module.scss';
import { IconDelete, IconEdit  } from '@douyinfe/semi-icons';

const Prompts: React.FC = () => {
  const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
        width: 60, // 固定宽度，内容长度固定
    },
    {
        title: '标题',
        dataIndex: 'title',
        minWidth: 150, // 设置最小宽度，内容较长时可伸展
        maxWidth: 300, // 设置最大宽度，避免过度占用空间
    },
    {
        title: '描述',
        dataIndex: 'description',
        minWidth: 200,
        maxWidth: 400,
    },
    {
        title: '分类',
        dataIndex: 'category',
        width: 120, // 固定宽度，分类名称长度有限
    },
    {
        title: '标签',
        dataIndex: 'tags',
        minWidth: 150,
        maxWidth: 300,
        render: (tags: string) => {
            return tags.split(',').map(tag => (
                <Tag key={tag} color="blue" size="small">{tag}</Tag>
            ));
        },
    },
    {
        title: '版本',
        dataIndex: 'version',
        width: 80, // 固定宽度，版本号长度有限
    },
    {
        title: '状态',
        dataIndex: 'status',
        width: 100, // 固定宽度，状态值有限
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
        width: 80, // 固定宽度，ID长度有限
    },
    {
        title: '使用次数',
        dataIndex: 'usage_count',
        width: 100, // 固定宽度，使用次数长度有限
    },
    {
        title: '是否公开',
        dataIndex: 'is_public',
        width: 100, // 固定宽度，内容固定为"公开"或"私有"
        render: (isPublic: number) => {
            return isPublic === 1 ? <Tag color="green">公开</Tag> : <Tag color="red">私有</Tag>;
        },
    },
    {
        title: '来源',
        dataIndex: 'source',
        width: 120, // 固定宽度，来源信息长度有限
    },
    {
        title: '角色',
        dataIndex: 'role',
        width: 100, // 固定宽度，角色名称长度有限
    },
    {
        title: '创建时间',
        dataIndex: 'created_at',
        width: 180, // 固定宽度，时间格式统一
    },
    {
        title: '更新时间',
        dataIndex: 'updated_at',
        width: 180
    },
    {
      title: '操作列',
      dataIndex: 'operate',
      fixed: 'right',
      width: 100,
      resize: false,
      render: () => {
          return (
            <div>
              <IconEdit />
              <IconDelete />
            </div>
          );
      },
    },
  ];

  const [dataSource, setDataSource] = useState([]);

  const scroll = useMemo(() => ({
    x: 1200,
    y: 'calc(100vh - 200px)'
  }), []);

  const generateMockData = () => {
    const data = [];
    const categories = ['SQL', 'NLP', '图像生成', '对话模型', '代码生成', '数据分析'];
    const statuses = ['active', 'draft', 'deprecated', 'archived'];
    const sources = ['系统生成', '用户上传', '第三方导入'];
    const roles = ['developer', 'user', 'ai', 'admin'];

    for (let i = 1; i <= 50; i++) {
      // 生成随机标签
      const tagCount = Math.floor(Math.random() * 3) + 1;
      const tagsArray = [];
      for (let j = 0; j < tagCount; j++) {
        const randomTag = Math.random() > 0.5 ? 'ai' : '测试';
        tagsArray.push(randomTag + j);
      }

      data.push({
        key: '' + i,
        id: i,
        title: `Prompt示例${i}`,
        description: `这是第${i}个prompt的描述信息，用于测试分页功能。`,
        content: '请生成相关内容...',
        tags: tagsArray.join(','),
        version: Math.floor(Math.random() * 3) + 1,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        author_id: 100 + Math.floor(Math.random() * 10),
        category: categories[Math.floor(Math.random() * categories.length)],
        usage_count: Math.floor(Math.random() * 50),
        last_used_at: `2023-01-${(Math.floor(Math.random() * 30) + 1).toString().padStart(2, '0')} 12:00:00`,
        is_public: Math.random() > 0.5 ? 1 : 0,
        source: sources[Math.floor(Math.random() * sources.length)],
        remarks: Math.random() > 0.5 ? '测试备注' : '',
        role: roles[Math.floor(Math.random() * roles.length)],
        created_at: `2023-01-${(Math.floor(Math.random() * 30) + 1).toString().padStart(2, '0')} 12:00:00`,
        updated_at: `2023-01-${(Math.floor(Math.random() * 30) + 1).toString().padStart(2, '0')} 12:00:00`,
      });
    }
    return data;
  };

  useEffect(() => {
    const data = generateMockData();
    setDataSource(data);
  }, []);

  const paginationConfig = useMemo(() => ({
    pageSize: 10,
    showSizeChanger: true,
    pageSizeOptions: ['10', '20', '50', '100'],
    showTotal: (total, range) => `${range[0]}-${range[1]} 条，共 ${total} 条`,
    showQuickJumper: true,
  }), []);

  return (
    <div className={styles.promptsCtx} style={{ width: '100%', height: '100%' }}>
      <Table
        bordered={true}
        columns={columns}
        dataSource={dataSource}
        pagination={paginationConfig}
        scroll={scroll}
      />
    </div>
  );
};

export default Prompts;
