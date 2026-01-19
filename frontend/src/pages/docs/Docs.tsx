import React, { useState, useEffect } from 'react';
import { Table, Tag, Button, Popconfirm, Toast, SideSheet, Form, Input, Select, Row, Col } from '@douyinfe/semi-ui';
import styles from './docs.module.scss';
import { IconDelete, IconEdit, IconPlus } from '@douyinfe/semi-icons';
import { useAuth } from '../../hooks/useAuth';
import { BASE_URL } from '../../lib/api';

// 定义文档类型
type FileType = 'PDF' | 'Word' | 'Excel' | 'PPT' | 'Text' | 'Image';

// 定义文档实体
type FileEntity = {
  id: number;
  name: string;
  description: string;
  type: FileType;
  createdAt: string;
  updatedAt: string;
  authorId: number;
  filePath?: string;
  fileSize?: number;
  isPublic: boolean;
  status: string;
};

const Docs: React.FC = () => {
  const [dataSource, setDataSource] = useState<FileEntity[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [sideSheetVisible, setSideSheetVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<FileEntity | null>(null);
  const [formValues, setFormValues] = useState<any>({});
  const { token, user } = useAuth();

  // 获取文档列表
  const fetchDocs = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/docs`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setDataSource(data);
      } else {
        console.error('获取文档列表失败:', response.status);
        Toast.error('获取文档列表失败');
      }
    } catch (error) {
      console.error('获取文档列表时发生错误:', error);
      Toast.error('获取文档列表时发生错误');
    } finally {
      setLoading(false);
    }
  };

  // 组件挂载时获取文档列表
  useEffect(() => {
    if (token) {
      fetchDocs();
    }
  }, [token]);

  // 打开侧边栏
  const handleEditFile = (record: FileEntity) => {
    setSelectedRecord(record);
    setFormValues(record);
    setSideSheetVisible(true);
  };

  // 关闭侧边栏
  const closeSideSheet = () => {
    setSideSheetVisible(false);
    setSelectedRecord(null);
    setFormValues({});
  };

  // 删除文档
  const handleDeleteFile = async (id: number) => {
    try {
      const response = await fetch(`${BASE_URL}/docs/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        setDataSource(prev => prev.filter(item => item.id !== id));
        Toast.success('文档删除成功');
      } else {
        console.error('删除文档失败:', response.status);
        Toast.error('删除文档失败');
      }
    } catch (error) {
      console.error('删除文档时发生错误:', error);
      Toast.error('删除文档时发生错误');
    }
  };

  // 表格列配置
  const tableColumns = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      render: (text: string) => <a href="#">{text}</a>
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      width: 300,
      ellipsis: true
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type: FileType) => {
        const color = type === 'PDF' ? 'blue' : type === 'Word' ? 'green' : 'orange';
        return <Tag color={color}>{type}</Tag>;
      }
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      render: (time: string) => new Date(time).toLocaleString()
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_: any, record: FileEntity) => (
        <>
          <Button
            icon={<IconEdit />}
            type="tertiary"
            size="small"
            onClick={() => handleEditFile(record)}
            style={{ marginRight: 8 }}
          >
            编辑
          </Button>
          <Button
            icon={<IconDelete />}
            type="tertiary"
            size="small"
            onClick={() => handleDeleteFile(record.id)}
            danger
          >
            删除
          </Button>
        </>
      )
    }
  ];

  // 保存文档
  const handleSave = async () => {
    try {
      const values = formValues || {};

      // 验证必填字段
      if (!values.name || !values.type) {
        Toast.error('名称和类型是必填字段');
        return;
      }

      const data = {
        name: values.name,
        description: values.description,
        type: values.type,
        isPublic: values.isPublic || true,
        status: values.status || 'active'
      };

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };

      let response;
      if (selectedRecord && selectedRecord.id) {
        // 更新文档
        response = await fetch(`${BASE_URL}/docs/${selectedRecord.id}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify(data)
        });
      } else {
        // 创建文档
        response = await fetch(`${BASE_URL}/docs`, {
          method: 'POST',
          headers,
          body: JSON.stringify(data)
        });
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || '保存失败');
      }

      const savedDoc = await response.json();

      if (selectedRecord && selectedRecord.id) {
        setDataSource(prev => prev.map(item => item.id === selectedRecord.id ? savedDoc : item));
        Toast.success('文档更新成功');
      } else {
        setDataSource(prev => [...prev, savedDoc]);
        Toast.success('文档创建成功');
      }

      closeSideSheet();
    } catch (error) {
      console.error('保存文档失败:', error);
      Toast.error(error instanceof Error ? error.message : '保存文档失败');
    }
  };

  // 新建文档
  const handleCreate = () => {
    setSelectedRecord(null);
    setFormValues({});
    setSideSheetVisible(true);
  };

  return (
    <div className={styles.docsCtx} style={{ width: '100%', height: '100%' }}>
      <Button
        icon={<IconPlus />}
        type="primary"
        onClick={handleCreate}
        style={{ marginBottom: 20 }}
      >
        新建文档
      </Button>

      <Table
        bordered={true}
        columns={tableColumns}
        dataSource={dataSource}
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50', '100'],
          showTotal: true,
          showQuickJumper: true
        }}
        scroll={{ x: 1000 }}
      />

      <SideSheet
        title={selectedRecord ? "编辑文档" : "新建文档"}
        visible={sideSheetVisible}
        onCancel={closeSideSheet}
        size="large"
      >
        <Form
          layout="horizontal"
          onValueChange={(values) => setFormValues(values)}
          initValues={selectedRecord}
        >
          {({ formState }) => (
            <>
              <div className="grid w-full">
                <Row>
                  <Col span={12}>
                    <Form.Input field="name" label="名称" style={{ width: '100%' }} placeholder="请输入文档名称" />
                  </Col>
                  <Col span={12}>
                    <Form.Select field="type" label="类型" style={{ width: '100%' }}>
                      <Select.Option value="PDF">PDF</Select.Option>
                      <Select.Option value="Word">Word</Select.Option>
                      <Select.Option value="Excel">Excel</Select.Option>
                      <Select.Option value="PPT">PPT</Select.Option>
                      <Select.Option value="Text">Text</Select.Option>
                      <Select.Option value="Image">Image</Select.Option>
                    </Form.Select>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <Form.TextArea field="description" label="描述" style={{ width: '100%' }} placeholder="请输入文档描述" rows={4} />
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <Form.Select field="status" label="状态" style={{ width: '100%' }}>
                      <Select.Option value="active">活跃</Select.Option>
                      <Select.Option value="inactive">停用</Select.Option>
                      <Select.Option value="archived">归档</Select.Option>
                    </Form.Select>
                  </Col>
                  <Col span={12}>
                    <Form.Switch field="isPublic" label="是否公开" />
                  </Col>
                </Row>

                <div style={{ marginTop: 20, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button onClick={closeSideSheet} style={{ marginRight: 8 }}>取消</Button>
                  <Button type="primary" onClick={handleSave}>保存</Button>
                </div>
              </div>
            </>
          )}
        </Form>
      </SideSheet>
    </div>
  );
};

export default Docs;