import React, { useState, useEffect } from 'react';
import { ContentCardList } from '../../../components/ContentCard/ContentCardList'; 
import { getContentsByCreator } from '../../../api/contentAPI'; 
import styles from '../../../pages/CreatorManagement/CreatorManagementPage.module.css'; // 페이지 CSS 임포트

export const MyContent = () => {
  const [myContents, setMyContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 임시 creatorId (실제로는 로그인된 사용자 정보에서 가져와야 함)
  const creatorId = 2; // 예시 ID

  useEffect(() => {
    const fetchMyContents = async () => {
      try {
        setLoading(true);
        const data = await getContentsByCreator(creatorId);
        setMyContents(data);
      } catch (err) {
        setError(err);
        console.error("내 콘텐츠 로드 실패:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyContents();
  }, [creatorId]); // creatorId가 변경될 때마다 다시 로드

  if (loading) {
    return <div className={styles.loadingMessage}>내 콘텐츠를 불러오는 중...</div>;
  }

  if (error) {
    return <div className={styles.errorMessage}>내 콘텐츠를 불러오는데 실패했습니다: {error.message}</div>;
  }

  return (
    <div className={styles.myContentManagementSection}>
      <h1 className={styles.myContentTitle}>내 콘텐츠 관리</h1>
      <ContentCardList contents={myContents} />
    </div>
  );
};
