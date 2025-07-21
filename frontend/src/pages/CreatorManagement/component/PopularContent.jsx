import React, { useState, useEffect } from 'react';
import styles from '../../../pages/CreatorManagement/CreatorManagementPage.module.css'; // 페이지 CSS 임포트
import { getTopViewedContentsByCreator } from '../../../api/contentAPI'; // API 함수 임포트

export const PopularContent = ({ creatorId }) => { // creatorId를 prop으로 받음
  const [topContents, setTopContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopContents = async () => {
      if (!creatorId) { // creatorId가 없으면 API 호출하지 않음
        setLoading(false);
        setError(new Error("크리에이터 ID가 제공되지 않았습니다."));
        return;
      }
      try {
        setLoading(true);
        // API 호출하여 조회수 TOP 3 콘텐츠 가져오기
        const data = await getTopViewedContentsByCreator(creatorId);
        setTopContents(data);
      } catch (err) {
        setError(err);
        console.error("조회수 TOP 3 콘텐츠 로드 실패:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTopContents();
  }, [creatorId]); // creatorId가 변경될 때마다 다시 로드

  if (loading) {
    return <div className={styles.loadingMessage}>인기 콘텐츠를 불러오는 중...</div>;
  }

  if (error) {
    return <div className={styles.errorMessage}>인기 콘텐츠를 불러오는데 실패했습니다: {error.message}</div>;
  }

  return (
    <div className={styles.popularContent}> {/* 이 div가 누락되어 있었습니다. */}
      <div className={styles.overlapPopular}>
        <div className={styles.sectionTitle}>조회수 TOP 3 콘텐츠</div> {/* 이 제목도 누락되어 있었습니다. */}
        <div className={styles.contentList}>
          {topContents.length > 0 ? (
            topContents.map((content, index) => (
              <div key={content.contentId} className={styles.cardItem}>
                <div className={styles.overlapGroupContent}>
                  <div className={styles.rankBadge}>
                    <div className={styles.rankTextWrapper}>
                      <div className={styles.rankText}>{index + 1}</div> {/* 순위 표시 */}
                    </div>
                  </div>
                  <p className={styles.titleTextContent}>
                    {content.title}
                  </p>
                  <div className={styles.viewCountText}>조회수 {content.viewCount ? content.viewCount.toLocaleString() : 0}</div>
                </div>
              </div>
            ))
          ) : (
            <p className={styles.noItemsMessage}>표시할 인기 콘텐츠가 없습니다.</p>
          )}
        </div>
      </div>
    </div>
  );
};