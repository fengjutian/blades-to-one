import React, { useState } from 'react';
// import { useAuth } from '../../hooks/useAuth';
import styles from './dashboard.module.scss';
import LLMConfig from '@/pages/LLMConfig/LLMConfig';
import { Bot, Workflow  } from 'lucide-react';
import Chat from '@/pages/chat/Chat';
import WorkflowEle from '@/pages/workflow/Workflow';

const Dashboard: React.FC = () => {
  // 使用简单的字符串类型来表示当前选中的组件
  const [selectedComponent, setSelectedComponent] = useState('chat');

  const handleIconClick = (componentName: string) => {
    setSelectedComponent(componentName);
  };

  // 渲染当前选中的组件
  const renderSelectedComponent = () => {
    switch (selectedComponent) {
      case 'chat':
        return <Chat />;
      case 'workflow':
        return <WorkflowEle />;
      default:
        return <Chat />;
    }
  };

  return (
    <div className={styles.dashboard}>
      <div className={styles.operatorCard}>
        {/* 聊天机器人图标 */}
        <div
          onClick={() => handleIconClick('chat')}
          className={`cursor-pointer ${selectedComponent === 'chat' ? styles.selectedIcon : ''}`}
        >
          <Bot />
        </div>
        {/* 工作流图标 */}
        <div
          onClick={() => handleIconClick('workflow')}
          className={`cursor-pointer ${selectedComponent === 'workflow' ? styles.selectedIcon : ''}`}
        >
          <Workflow />
        </div>
      </div>
      <div className={styles.mainPage}>
        <div className={styles.mainHeader}>
          <LLMConfig />
        </div>
        <div className={styles.mainContent}>
          {renderSelectedComponent()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
