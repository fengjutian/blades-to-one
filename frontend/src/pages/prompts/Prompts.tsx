import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Table, Tag, Space, SideSheet, Button, Form, Select, Row, Col, Toast  } from '@douyinfe/semi-ui';
import styles from './prompts.module.scss';
import { IconDelete, IconEdit  } from '@douyinfe/semi-icons';

const Prompts: React.FC = () => {
  const [sideSheetVisible, setSideSheetVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [sideSheetSize, setSideSheetSize] = useState<'small' | 'medium' | 'large'>('large');
  const [dataSource, setDataSource] = useState([]);

  const formRef = useRef<any>(null);

  const openSideSheet = (record: any) => {
    setSelectedRecord(record);
    setSideSheetVisible(true);
  };

  const closeSideSheet = () => {
    setSideSheetVisible(false);
    setSelectedRecord(null);
    // 重置表单ref
    formRef.current = null;
  };

  // 保存按钮的点击事件处理
  const handleSaveClick = () => {
    if (formRef.current) {
      handleSave();
    } else {
      console.error('表单API未初始化');
    }
  };

  // 保存Prompt的处理函数
  const handleSave = async () => {
    try {
      const formApi = formRef.current;
      if (!formApi) {
        throw new Error('表单API未初始化');
      }

      // 获取表单值
      const values = formApi.getValues();

      // 准备请求数据
      const promptData = {
        title: values.title,
        content: values.content,
        description: values.description,
        tags: values.tags,
        version: parseInt(values.version, 10) || 1,
        status: values.status,
        author_id: values.author_id || 100, // 默认用户ID
        // 使用category字段的值，在演示环境中直接使用字符串作为ID
        categoryId: values.category ? values.category : 1,
        // 设置默认的is_public值，因为表单中没有这个字段
        is_public: selectedRecord?.is_public || 0,
        source: values.source,
        remarks: values.remarks,
        role: values.role
      };

      let response;
      if (selectedRecord && selectedRecord.id) {
        // 更新操作
        response = await fetch(`/api/prompts/${selectedRecord.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(promptData),
        });
      } else {
        // 创建操作
        response = await fetch('/api/prompts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(promptData),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '保存失败');
      }

      const savedPrompt = await response.json();

      // 更新数据源
      if (selectedRecord && selectedRecord.id) {
        // 更新现有记录
        setDataSource(prev => prev.map(item =>
          item.id === selectedRecord.id ? savedPrompt : item
        ));
        Toast.success('Prompt更新成功');
      } else {
        // 添加新记录
        setDataSource(prev => [...prev, savedPrompt]);
        Toast.success('Prompt创建成功');
      }

      // 关闭侧边栏
      closeSideSheet();
    } catch (error) {
      console.error('保存失败:', error);
      Toast.error(error instanceof Error ? error.message : '保存失败，请重试');
    }
  };

  const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
        width: 60, // 固定宽度，内容长度固定
    },
    {
        title: '标题',
        dataIndex: 'title',
        width: 100, // 设置最大宽度，避免过度占用空间
    },
    {
        title: '描述',
        dataIndex: 'description',
        width: 200,
    },
    {
        title: '分类',
        dataIndex: 'category',
        width: 120, // 固定宽度，分类名称长度有限
    },
    {
        title: '标签',
        dataIndex: 'tags',
        width: 100,
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
        width: 80, // 固定宽度，来源信息长度有限
    },
    {
        title: '角色',
        dataIndex: 'role',
        width: 80, // 固定宽度，角色名称长度有限
    },
    {
        title: '创建时间',
        dataIndex: 'created_at',
        width: 120, // 固定宽度，时间格式统一
    },
    {
        title: '更新时间',
        dataIndex: 'updated_at',
        width: 120
    },
    {
      title: '操作列',
      dataIndex: 'operate',
      fixed: 'right',
      width: 80,
      resize: false,
      render: (_: any, record: any) => {
          return (
            <div>
              <Space>
                <IconEdit onClick={() => openSideSheet(record)} style={{ cursor: 'pointer' }} />
                <IconDelete />
              </Space>
            </div>
          );
      },
    },
  ];

  const generateMockData = () => {
    const data = [];
    const categories = ['SQL', 'NLP', '图像生成', '对话模型', '代码生成', '数据分析'];
    const statuses = ['active', 'draft', 'deprecated', 'archived'];
    const sources = ['系统生成', '用户上传', '第三方导入'];
    const roles = ['developer', 'user', 'ai', 'admin'];

    for (let i = 1; i <= 50; i++) {
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

  // 定义scroll变量
  const scroll = useMemo(() => ({
    x: 1200,
    y: 'calc(100vh - 240px)'
  }), []);

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
      <Button className="w-30 mb-2" onClick={() => openSideSheet({ id: 0, title: '', description: '', category: '', tags: '', version: 1, status: 'draft', author_id: 100, usage_count: 0, is_public: 0, source: '', role: 'user' })}>新建提示词</Button>
      <Table
        bordered={true}
        columns={columns}
        dataSource={dataSource}
        pagination={paginationConfig}
        scroll={scroll}
      />

      <SideSheet
        title={selectedRecord && selectedRecord.id ? "编辑Prompt" : "新建Prompt"}
        visible={sideSheetVisible}
        onCancel={closeSideSheet}
        size={sideSheetSize}
      >
        {selectedRecord && (
          <Form
            layout='horizontal'
            onValueChange={values => console.log(values)}
            // 使用initValues而不是initialValues
            initValues={selectedRecord}
            // 使用ref获取表单API
            ref={formRef}
          >
            {/* 移除未使用的values参数 */}
            {({ formState }) => {
              return (
                <>
                  {/* 表单内容 */}

                  <div className="grid w-full">
                    <Row>
                      <Col span={12}>
                        <Form.Input field="title" label="标题" style={{ width: '100%' }} placeholder="请输入标题" />
                      </Col>
                      <Col span={12}>
                        <Form.Input field="description" label="描述" style={{ width: '100%' }} placeholder="请输入描述" />
                      </Col>
                    </Row>
                    <Row>
                      <Col span={12}>
                        <Form.Select field="category" label="分类" style={{ width: '100%' }}>
                          <Select.Option value="SQL">SQL</Select.Option>
                          <Select.Option value="NLP">NLP</Select.Option>
                          <Select.Option value="图像生成">图像生成</Select.Option>
                          <Select.Option value="对话模型">对话模型</Select.Option>
                          <Select.Option value="代码生成">代码生成</Select.Option>
                          <Select.Option value="数据分析">数据分析</Select.Option>
                        </Form.Select>
                      </Col>
                      <Col span={12}>
                        <Form.Input field="tags" label="标签" style={{ width: '100%' }} placeholder="请输入标签，逗号分隔" />
                      </Col>
                    </Row>
                    <Row>
                      <Col span={12}>
                        <Form.Select field="status" label="状态" style={{ width: '100%' }}>
                          <Select.Option value="active">活跃</Select.Option>
                          <Select.Option value="draft">草稿</Select.Option>
                          <Select.Option value="deprecated">已废弃</Select.Option>
                          <Select.Option value="archived">已归档</Select.Option>
                        </Form.Select>
                      </Col>
                      <Col span={12}>
                        <Form.Input field="version" label="版本" style={{ width: '100%' }} />
                      </Col>
                    </Row>
                    <Row>
                      <Col span={12}>
                        <Form.Select field="source" label="来源" style={{ width: '100%' }}>
                          <Select.Option value="系统生成">系统生成</Select.Option>
                          <Select.Option value="用户上传">用户上传</Select.Option>
                          <Select.Option value="第三方导入">第三方导入</Select.Option>
                        </Form.Select>
                      </Col>
                      <Col span={12}>
                        <Form.Select field="role" label="角色" style={{ width: '100%' }}>
                          <Select.Option value="developer">开发者</Select.Option>
                          <Select.Option value="user">普通用户</Select.Option>
                          <Select.Option value="ai">AI助手</Select.Option>
                          <Select.Option value="admin">管理员</Select.Option>
                        </Form.Select>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={24}>
                        <Form.TextArea field="content"  showClear label="内容" style={{ width: '100%' }} placeholder="请输入Prompt内容" rows={5} />
                      </Col>
                    </Row>
                    <Row>
                      <Col span={24}>
                        <Form.TextArea field="remarks" showClear label="备注" style={{ width: '100%' }} placeholder="请输入备注信息" rows={3} />
                      </Col>
                    </Row>

                    <div style={{ marginTop: 24 }}>
                      <code>{JSON.stringify(formState, null, 2)}</code>
                    </div>
                    <div style={{ marginTop: 20, display: 'flex', justifyContent: 'flex-end' }}>
                      <Space>
                        <Button onClick={closeSideSheet}>取消</Button>
                        <Button type="primary" onClick={handleSaveClick}>保存</Button>
                      </Space>
                    </div>
                  </div>
                </>
              );
            }}
          </Form>
        )}
      </SideSheet>
    </div>
  );
};

export default Prompts;
