import React, { useState, useEffect } from 'react'; // useEffect, useState 임포트 추가
import {DashBoardSection}  from './component/DashBoardSection'
import {PopularContent} from './component/PopularContent';
import {MyContent} from './component/MyContent';
import styles from './CreatorManagementPage.module.css'; // 페이지 전체 스타일

const CreatorManagementPage = () => {
  return (
    <div className={styles.creatorManagementPageContainer}>
      <DashBoardSection />
      <PopularContent /> 
      <MyContent/>
    </div>
  );
};

export default CreatorManagementPage;
