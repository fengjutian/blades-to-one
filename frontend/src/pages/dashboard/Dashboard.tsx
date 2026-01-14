import React, { useState } from 'react';
import styles from './dashboard.module.scss';
import LLMConfig from '@/pages/LLMConfig/LLMConfig';
import { Bot, Workflow, BrainCircuit, Drill, FilePenLine } from 'lucide-react';
import Chat from '@/pages/chat/Chat';
import WorkflowEle from '@/pages/workflow/Workflow';
import RAG from '@/pages/rag/RAG';
import Tools from '@/pages/tools/Tools';
import Prompts from '@/pages/prompts/Prompts';

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
      case 'tools':
        return <Tools />;
      case 'prompts':
        return <Prompts />;
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
        <div
          onClick={() => handleIconClick('tools')}
          className={`cursor-pointer ${selectedComponent === 'tools' ? styles.selectedIcon : ''} ${styles.iconbox}`}
        >
          <Drill />
        </div>

        <div
          onClick={() => handleIconClick('prompts')}
          className={`cursor-pointer ${selectedComponent === 'prompts' ? styles.selectedIcon : ''} ${styles.iconbox}`}
        >
          <FilePenLine />
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
