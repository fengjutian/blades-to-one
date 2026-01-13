import React from 'react';
import styles from './rag.module.scss';
const RAG: React.FC = () => {
  return (
    <div>
      <div className={styles.ragHeader}>RAG</div>
      <div className={styles.ragContent}></div>
    </div>
  );
};

export default RAG;
