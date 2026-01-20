import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './dashboard.module.scss';
import LLMConfig from '@/pages/LLMConfig/LLMConfig';
import { Bot, Workflow, BrainCircuit, Drill, FilePenLine, Grid3x3, CircleUser } from 'lucide-react';
import Chat from '@/pages/chat/Chat';
import WorkflowEle from '@/pages/workflow/Workflow';
import RAG from '@/pages/rag/RAG';
import Tools from '@/pages/tools/Tools';
import Prompts from '@/pages/prompts/Prompts';
import Docs from '@/pages/docs/Docs';
import { useAuth } from '@/hooks/useAuth';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedComponent, setSelectedComponent] = useState('chat');
  const { logout } = useAuth();

  useEffect(() => {
    const path = location.pathname;
    if (path.startsWith('/dashboard/')) {
      const componentName = path.split('/dashboard/')[1] || 'chat';
      setSelectedComponent(componentName);
    }
  }, [location.pathname]);

  const handleIconClick = (componentName: string) => {
    setSelectedComponent(componentName);
    navigate(`/dashboard/${componentName}`);
  };

  const handleLogout = () => {
    logout();
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
      case 'docs':
        return <Docs />;
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

        <div
          onClick={() => handleIconClick('docs')}
          className={`cursor-pointer ${selectedComponent === 'docs' ? styles.selectedIcon : ''} ${styles.iconbox}`}
        >
          <Grid3x3 />
        </div>
      </div>
      <div className={styles.mainPage}>
        <div className={styles.mainHeader}>
          <CircleUser onClick={handleLogout} style={{ cursor: 'pointer' }} />
          <LLMConfig />
        </div>
        <div className={styles.mainContent}>{renderSelectedComponent()}</div>
      </div>
    </div>
  );
};

export default Dashboard;
