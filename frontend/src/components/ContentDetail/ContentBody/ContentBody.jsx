import React from 'react';
import styles from './ContentBody.module.css';

const ContentBody = ({ thumbnailUrl, description }) => {
  return (
    <div className={styles.bodyWrapper}>
      {thumbnailUrl && <img src={thumbnailUrl} alt="thumbnail" className={styles.thumbnail} />}
      <p className={styles.description}>{description}</p>
    </div>
  );
};

export default ContentBody;
