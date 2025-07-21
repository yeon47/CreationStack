import React from 'react';
import {DashBoardSection}  from './component/DashBoardSection'
import {PopularContent} from './component/PopularContent';
import {MyContent} from './component/MyContent';
import styles from './CreatorManagementPage.module.css'; // 페이지 전체 스타일

const CreatorManagementPage = () => {
  // 테스트용 하드 코딩
const creatorId = 2; // 예시 ID
  return (
    <div className={styles.creatorManagementPageContainer}>
      <DashBoardSection creatorId={creatorId} />
      <PopularContent creatorId={creatorId} /> 
      <MyContent creatorId={creatorId} />
    </div>
  );
};

export default CreatorManagementPage;
