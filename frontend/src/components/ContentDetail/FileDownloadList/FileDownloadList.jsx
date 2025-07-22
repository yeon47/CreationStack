import React from 'react';
import styles from './FileDownloadList.module.css';

const FileDownloadList = ({ files }) => {
  if (!files || files.length === 0) return null;

  return (
    <div className={styles.wrapper}>
      <h3>첨부 파일</h3>
      <ul className={styles.list}>
        {files.map((file, idx) => (
          <li key={idx}>
            <a href={file.url} download className={styles.link}>
              {file.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FileDownloadList;
