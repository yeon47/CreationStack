import React from 'react';
import styles from './ContentHeader.module.css';

const ContentHeader = ({ title, categories, createdAt }) => {
  return (
    <div className={styles.headerWrapper}>
      <h1 className={styles.title}>{title}</h1>
      <div className={styles.categories}>
        {categories?.map((cat, idx) => (
          <span key={idx} className={styles.category}>
            {cat.name}
          </span>
        ))}
      </div>
      <div className={styles.date}>{new Date(createdAt).toLocaleDateString()}</div>
    </div>
  );
};

export default ContentHeader;
