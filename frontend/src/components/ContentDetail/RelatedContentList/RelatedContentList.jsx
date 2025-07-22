import React from 'react';
import styles from './RelatedContentList.module.css';

const RelatedContentList = ({ creatorId }) => {
  return (
    <div className={styles.wrapper}>
      <h3>크리에이터의 다른 콘텐츠</h3>
      <div className={styles.placeholder}>※ 추천 콘텐츠는 추후 연결 예정</div>
    </div>
  );
};

export default RelatedContentList;
