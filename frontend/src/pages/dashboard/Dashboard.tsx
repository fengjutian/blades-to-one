import React, { useState } from 'react';
import styles from './dashboard.module.scss';
import LLMConfig from '@/pages/LLMConfig/LLMConfig';
import { Bot, Workflow, BrainCircuit } from 'lucide-react';
import Chat from '@/pages/chat/Chat';
import WorkflowEle from '@/pages/workflow/Workflow';
import RAG from '@/pages/rag/RAG';

const Dashboard: React.FC = () => {
  const [selectedComponent, setSelectedComponent] = useState('chat');

  const handleIconClick = (componentName: string) => {
    setSelectedComponent(componentName);
  };

  const renderSelectedComponent = () => {
    switch (selectedComponent) {
      case 'chat':
        return <Chat />;
      case 'rag':
        return <RAG />;
      case 'workflow':
        return <WorkflowEle />;
      default:
        return <Chat />;
    }
  };

  return (
    <div className={styles.dashboard}>
      <div className={styles.operatorCard}>
        <div
          onClick={() => handleIconClick('chat')}
          className={`cursor-pointer ${selectedComponent === 'chat' ? styles.selectedIcon : ''} ${styles.iconbox}`}
        >
          <Bot />
        </div>
        <div
          onClick={() => handleIconClick('rag')}
          className={`cursor-pointer ${selectedComponent === 'rag' ? styles.selectedIcon : ''} ${styles.iconbox}`}
        >
          <BrainCircuit />
        </div>
        <div
          onClick={() => handleIconClick('workflow')}
          className={`cursor-pointer ${selectedComponent === 'workflow' ? styles.selectedIcon : ''} ${styles.iconbox}`}
        >
          <Workflow />
        </div>
      </div>
      <div className={styles.mainPage}>
        <div className={styles.mainHeader}>
          <LLMConfig />
        </div>
        <div className={styles.mainContent}>{renderSelectedComponent()}</div>
      </div>
    </div>
  );
};

export default Dashboard;
