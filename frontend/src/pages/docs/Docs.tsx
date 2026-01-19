import React, { useState, useEffect } from 'react';
import { Layout, Card, Form, Input, Button, Table, Drawer, Upload, Tag, Modal, Toast, Empty, Spin } from '@douyinfe/semi-ui';
import { Search, Plus, Edit, Delete, UploadOutlined } from '@douyinfe/semi-icons';

// 定义文件类型枚举
type FileType = 'PDF' | 'Word' | 'Excel';

// 文件实体数据模型
export interface FileEntity {
  id: string;
  name: string;
  description: string;
  type: FileType;
  fileUrl: string;
  createdAt: string;
  updatedAt: string;
  openid: string;
}

// 文件表单数据类型
interface FileFormData {
  name: string;
  description: string;
  type: FileType;
  file: any;
}

const Docs: React.FC = () => {
  // 状态管理
  const [files, setFiles] = useState<FileEntity[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
  const [formData, setFormData] = useState<FileFormData>({
    name: '',
    description: '',
    type: 'PDF',
    file: null
  });
  const [editingFile, setEditingFile] = useState<FileEntity | null>(null);
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState<boolean>(false);
  const [fileToDelete, setFileToDelete] = useState<string | null>(null);

  // 模拟数据
  const mockFiles: FileEntity[] = [
    {
      id: '1',
      name: '项目计划文档',
      description: '2026年项目实施计划',
      type: 'PDF',
      fileUrl: 'https://example.com/file1.pdf',
      createdAt: '2026-01-01T10:00:00Z',
      updatedAt: '2026-01-01T10:00:00Z',
      openid: 'user123'
    },
    {
      id: '2',
      name: '月度财务报表',
      description: '2025年12月财务数据',
      type: 'Excel',
      fileUrl: 'https://example.com/file2.xlsx',
      createdAt: '2025-12-31T15:30:00Z',
      updatedAt: '2025-12-31T15:30:00Z',
      openid: 'user123'
    },
    {
      id: '3',
      name: '会议纪要',
      description: '产品评审会议记录',
      type: 'Word',
      fileUrl: 'https://example.com/file3.docx',
      createdAt: '2025-12-25T09:15:00Z',
      updatedAt: '2025-12-25T09:15:00Z',
      openid: 'user123'
    }
  ];

  // 页面加载时初始化数据
  useEffect(() => {
    fetchFiles();
  }, []);

  // 获取文件列表
  const fetchFiles = () => {
    setLoading(true);
    // 模拟API请求
    setTimeout(() => {
      setFiles(mockFiles);
      setLoading(false);
    }, 800);
  };

  // 搜索文件
  const handleSearch = () => {
    setLoading(true);
    // 模拟搜索逻辑
    setTimeout(() => {
      const filteredFiles = mockFiles.filter(file =>
        file.name.includes(searchKeyword)
      );
      setFiles(filteredFiles);
      setLoading(false);
    }, 800);
  };

  // 重置搜索
  const handleReset = () => {
    setSearchKeyword('');
    fetchFiles();
  };

  // 打开新增文件抽屉
  const handleAddFile = () => {
    setEditingFile(null);
    setFormData({
      name: '',
      description: '',
      type: 'PDF',
      file: null
    });
    setDrawerVisible(true);
  };

  // 打开编辑文件抽屉
  const handleEditFile = (file: FileEntity) => {
    setEditingFile(file);
    setFormData({
      name: file.name,
      description: file.description,
      type: file.type,
      file: null
    });
    setDrawerVisible(true);
  };

  // 打开删除确认对话框
  const handleDeleteFile = (id: string) => {
    setFileToDelete(id);
    setDeleteConfirmVisible(true);
  };

  // 确认删除文件
  const confirmDeleteFile = () => {
    if (!fileToDelete) return;

    setLoading(true);
    // 模拟删除API请求
    setTimeout(() => {
      const updatedFiles = files.filter(file => file.id !== fileToDelete);
      setFiles(updatedFiles);
      setDeleteConfirmVisible(false);
      setLoading(false);
      Toast.success('文件删除成功');
    }, 800);
  };

  // 提交文件表单
  const handleFormSubmit = () => {
    // 表单验证
    if (!formData.name.trim()) {
      Toast.warning('请输入文件名称');
      return;
    }

    if (!formData.file && !editingFile) {
      Toast.warning('请上传文件');
      return;
    }

    setLoading(true);
    // 模拟提交API请求
    setTimeout(() => {
      const newFile: FileEntity = {
        id: editingFile ? editingFile.id : `file-${Date.now()}`,
        name: formData.name,
        description: formData.description,
        type: formData.type,
        fileUrl: editingFile ? editingFile.fileUrl : 'https://example.com/uploaded-file.pdf',
        createdAt: editingFile ? editingFile.createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        openid: 'user123'
      };

      if (editingFile) {
        // 更新现有文件
        const updatedFiles = files.map(file =>
          file.id === editingFile.id ? newFile : file
        );
        setFiles(updatedFiles);
        Toast.success('文件更新成功');
      } else {
        // 添加新文件
        setFiles([...files, newFile]);
        Toast.success('文件添加成功');
      }

      setDrawerVisible(false);
      setLoading(false);
    }, 1500);
  };

  // 处理文件上传
  const handleFileUpload = (file: any) => {
    setFormData(prev => ({ ...prev, file }));
    return false; // 阻止自动上传，由表单提交时处理
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
            icon={<Edit />}
            type="link"
            size="small"
            onClick={() => handleEditFile(record)}
            style={{ marginRight: 8 }}
          >
            编辑
          </Button>
          <Button
            icon={<Delete />}
            type="link"
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

  // 渲染文件类型选择器
  const renderFileTypeSelect = () => {
    return (
      <div style={{ display: 'flex', gap: 12 }}>
        {(['PDF', 'Word', 'Excel'] as FileType[]).map(type => (
          <Button
            key={type}
            type={formData.type === type ? 'primary' : 'tertiary'}
            onClick={() => setFormData(prev => ({ ...prev, type }))}
          >
            {type}
          </Button>
        ))}
      </div>
    );
  };

  return (
    <Layout style={{ padding: 24, minHeight: '100vh' }}>
      <Card title="文件管理" style={{ marginBottom: 24 }}>
        {/* 查询区域 */}
        <Form layout="inline" style={{ marginBottom: 16 }}>
          <Form.Input
            field="name"
            value={searchKeyword}
            onChange={setSearchKeyword}
            placeholder="文件名称"
            style={{ width: 300, marginRight: 12 }}
            prefix={<Search />}
          />
          <Button type="primary" onClick={handleSearch} style={{ marginRight: 8 }}>
            查询
          </Button>
          <Button onClick={handleReset}>
            重置
          </Button>
        </Form>

        {/* 操作区 */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
          <Button
            icon={<Plus />}
            type="primary"
            onClick={handleAddFile}
          >
            新增文件
          </Button>
        </div>

        {/* 列表区 */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
            <Spin size="large" />
          </div>
        ) : files.length === 0 ? (
          <Empty
            title="暂无文件"
            description="点击'新增文件'按钮添加文件"
            style={{ padding: 60 }}
          />
        ) : (
          <Table
            columns={tableColumns}
            dataSource={files}
            rowKey="id"
            pagination={{ pageSize: 10 }}
            bordered
          />
        )}
      </Card>

      {/* 新增/编辑文件抽屉 */}
      <Drawer
        title={editingFile ? '编辑文件' : '新增文件'}
        placement="right"
        size="large"
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
            <Button onClick={() => setDrawerVisible(false)}>
              取消
            </Button>
            <Button type="primary" onClick={handleFormSubmit} loading={loading}>
              {editingFile ? '更新' : '提交'}
            </Button>
          </div>
        }
      >
        <Form layout="vertical" style={{ marginTop: 24 }}>
          <Form.Input
            field="name"
            label="文件名称"
            value={formData.name}
            onChange={(value) => setFormData(prev => ({ ...prev, name: value }))}
            placeholder="请输入文件名称"
            required
          />

          <Form.Textarea
            field="description"
            label="文件描述"
            value={formData.description}
            onChange={(value) => setFormData(prev => ({ ...prev, description: value }))}
            placeholder="请输入文件描述"
            rows={4}
          />

          <Form.Select
            field="type"
            label="文件类型"
            value={formData.type}
            onChange={(value) => setFormData(prev => ({ ...prev, type: value as FileType }))}
            required
          >
            <Form.Select.Option value="PDF">PDF</Form.Select.Option>
            <Form.Select.Option value="Word">Word</Form.Select.Option>
            <Form.Select.Option value="Excel">Excel</Form.Select.Option>
          </Form.Select>

          <Form.Slot field="file" label="文件上传">
            <Upload
              fileList={formData.file ? [formData.file] : []}
              beforeUpload={handleFileUpload}
              multiple={false}
              action="#"
            >
              <div style={{ padding: 24, border: '1px dashed #d9d9d9', borderRadius: 4, textAlign: 'center' }}>
                <UploadOutlined style={{ fontSize: 48, color: '#1890ff', marginBottom: 16 }} />
                <p>点击或拖拽文件到此处上传</p>
                <p style={{ color: '#999', marginTop: 8 }}>支持 PDF、Word、Excel 文件</p>
              </div>
            </Upload>
          </Form.Slot>
        </Form>
      </Drawer>

      {/* 删除确认对话框 */}
      <Modal
        title="确认删除"
        visible={deleteConfirmVisible}
        onOk={confirmDeleteFile}
        onCancel={() => setDeleteConfirmVisible(false)}
        okText="确认"
        cancelText="取消"
        confirmLoading={loading}
      >
        <p>确定要删除此文件吗？此操作不可恢复。</p>
      </Modal>
    </Layout>
  );
};

export default Docs;



