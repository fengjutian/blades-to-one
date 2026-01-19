import React, { useState, useEffect, useMemo } from 'react';
import { Table, Tag, Space, SideSheet, Button, Form, Select, Row, Col, Toast, Popconfirm  } from '@douyinfe/semi-ui';
import styles from './prompts.module.scss';
import { IconDelete, IconEdit  } from '@douyinfe/semi-icons';
import { useAuth } from '../../hooks/useAuth';
import { BASE_URL } from '@/config/base';

const Prompts: React.FC = () => {
  const [sideSheetVisible, setSideSheetVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [sideSheetSize, setSideSheetSize] = useState<'small' | 'medium' | 'large'>('large');
  const [dataSource, setDataSource] = useState([]);
  const [formValues, setFormValues] = useState<any>({});
  const [categories, setCategories] = useState<any[]>([]);

  // 使用认证Hook获取token
  const { token } = useAuth();

  // 获取Category列表
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/prompts/categories');
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        } else {
          console.error('获取Category列表失败:', response.status);
        }
      } catch (error) {
        console.error('获取Category列表时发生错误:', error);
      }
    };

    fetchCategories();
  }, []);

  // 获取Prompt列表
  useEffect(() => {
    if (!token) return;

    const fetchPrompts = async () => {
      try {
        const response = await fetch(`${BASE_URL}/prompts`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setDataSource(data.prompts || []);
        } else {
          console.error('获取Prompt列表失败:', response.status);
        }
      } catch (error) {
        console.error('获取Prompt列表时发生错误:', error);
      }
    };

    fetchPrompts();
  }, [token]);

  const openSideSheet = (record: any) => {
    setSelectedRecord(record);
    setFormValues(record); // 初始化表单值
    setSideSheetVisible(true);
  };

  const closeSideSheet = () => {
    setSideSheetVisible(false);
    setSelectedRecord(null);
    setFormValues({}); // 清空表单值
  };

  // 删除Prompt的处理函数
  const onConfirm = async (record: any) => {
    try {
      const response = await fetch(`${BASE_URL}/prompts/${record.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        // 更新数据源，移除删除的记录
        setDataSource(prev => prev.filter(item => item.id !== record.id));
        Toast.success('Prompt删除成功');
      } else {
        console.error('删除Prompt失败:', response.status);
        Toast.error('删除Prompt失败');
      }
    } catch (error) {
      console.error('删除Prompt时发生错误:', error);
      Toast.error('删除Prompt时发生错误');
    }
  };

  // 取消删除的处理函数
  const onCancel = () => {
    // 可以在这里添加取消删除的逻辑，如果需要的话
    console.log('取消删除操作');
  };

  const handleSaveClick = () => {
    handleSave();
  };

  // 保存Prompt的处理函数
  const handleSave = async () => {
    try {
      // 获取表单值
      const values = formValues || {};
      console.log('表单值:', values);

      // 检查values是否包含必要的字段
      if (!values) {
        Toast.error('表单数据无效，请填写表单');
        return;
      }

      // 准备请求数据，为所有字段提供默认值
      const promptData: any = {
        title: values.title || '',
        content: values.content || '',
        description: values.description || '',
        tags: values.tags || '',
        version: parseInt(values.version, 10) || 1,
        status: values.status || 'draft',
        // 移除硬编码的author_id，这个应该由后端从认证信息中获取
        // 使用category字段的值，如果没有选择则不传递categoryId
        ...(values.category && { categoryId: values.category }),
        // 设置默认的is_public值，因为表单中没有这个字段
        is_public: selectedRecord?.is_public || 0,
        source: values.source || '',
        remarks: values.remarks || '',
        role: values.role || 'user'
      };

      console.log('请求数据:', promptData);

      // 验证必填字段
      if (!promptData.title || !promptData.content) {
        console.log('验证失败，title或content为空:', { title: promptData.title, content: promptData.content });
        Toast.error('标题和内容是必填字段');
        return;
      }

      // 设置请求头，包含认证token
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      let response;
      if (selectedRecord && selectedRecord.id) {
        // 更新操作
        response = await fetch(`/prompts/${selectedRecord.id}`, {
          method: 'PUT',
          headers: headers,
          body: JSON.stringify(promptData),
        });
      } else {
        // 创建操作
        response = await fetch('/prompts', {
          method: 'POST',
          headers: headers,
          body: JSON.stringify(promptData),
        });
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
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
        width: 150,
        render: (tags: string) => {
            return tags ? (
                <>
                    {tags.split(',').map((tag, index) => (
                        <Tag key={index} color="blue" size="small" style={{ marginRight: 4 }}>
                            {tag}
                        </Tag>
                    ))}
                </>
            ) : null;
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
        width: 80,
        render: (status: string) => {
            let color = 'green';
            if (status === 'draft') color = 'orange';
            if (status === 'deprecated') color = 'gray';
            if (status === 'archived') color = 'red';
            return <Tag color={color}>{status}</Tag>;
        },
    },
    {
        title: '作者',
        dataIndex: 'author_id',
        width: 100,
    },
    {
        title: '使用次数',
        dataIndex: 'usage_count',
        width: 80,
    },
    {
        title: '最后使用时间',
        dataIndex: 'last_used_at',
        width: 120
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
                <Popconfirm
                  title="确定是否要删除此提示词？"
                  content="此删除操作将不可逆"
                  position='left'
                  onConfirm={() => onConfirm(record)}
                  onCancel={onCancel}
                >
                  <IconDelete />
                </Popconfirm>
              </Space>
            </div>
          );
      },
    },
  ];

  // 定义scroll变量
  const scroll = useMemo(() => ({
    x: 1200,
    y: 'calc(100vh - 240px)'
  }), []);

  const paginationConfig = useMemo(() => ({
    pageSize: 10,
    showSizeChanger: true,
    pageSizeOptions: ['10', '20', '50', '100'],
    showTotal: (total, range) => `${range[0]}-${range[1]} 条，共 ${total} 条`,
    showQuickJumper: true,
  }), []);

  return (
    <div className={styles.promptsCtx} style={{ width: '100%', height: '100%' }}>
      <Button className="w-30 mb-2" onClick={() => openSideSheet({ id: 0, title: '', description: '', category: '', tags: '', version: 1, status: 'draft', usage_count: 0, is_public: 0, source: '', role: 'user' })}>新建提示词</Button>
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
            onValueChange={(values) => {
              // 直接使用values参数更新formValues
              console.log('Form值变化:', values);
              setFormValues(values);
            }}
            // 使用initValues而不是initialValues
            initValues={selectedRecord}
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
                          {/* 动态生成Category选项 */}
                          {categories.map(category => (
                            <Select.Option key={category.id} value={category.id}>
                              {category.name}
                            </Select.Option>
                          ))}
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






