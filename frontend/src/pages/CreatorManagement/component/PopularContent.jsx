import React from 'react';
import styles from '../../../pages/CreatorManagement/CreatorManagementPage.module.css'; // 페이지 CSS 임포트

export const PopularContent = () => {
  return (
    <div className={styles.popularContent}>
      <div className={styles.overlapPopular}> {/* 클래스 이름 변경하여 충돌 방지 */}
        <div className={styles.sectionTitle}>조회수 TOP 3 콘텐츠</div>

        <div className={styles.contentList}>
          {/* 첫 번째 카드 아이템 */}
          <div className={styles.cardItem}>
            <div className={styles.overlapGroupContent}>
              <div className={styles.rankBadge}>
                <div className={styles.rankTextWrapper}>
                  <div className={styles.rankText}>1</div>
                </div>
              </div>
              <p className={styles.titleTextContent}>
                클린 코드 작성법: 실무에서 바로 쓰는 10가지 팁
              </p>
              <div className={styles.viewCountText}>조회수 45,230</div>
            </div>
          </div>

          {/* 두 번째 카드 아이템 */}
          <div className={styles.cardItem}>
            <div className={styles.overlapGroupContent}>
              <div className={styles.rankBadge}>
                <div className={styles.rankTextWrapper}>
                  <div className={styles.rankText}>2</div>
                </div>
              </div>
              <p className={styles.titleTextContent}>
                클린 코드 작성법: 실무에서 바로 쓰는 10가지 팁
              </p>
              <div className={styles.viewCountText}>조회수 45,230</div>
            </div>
          </div>

          {/* 세 번째 카드 아이템 */}
          <div className={styles.cardItem}>
            <div className={styles.overlapGroupContent}>
              <div className={styles.rankBadge}>
                <div className={styles.rankTextWrapper}>
                  <div className={styles.rankText}>3</div>
                </div>
              </div>
              <p className={styles.titleTextContent}>
                클린 코드 작성법: 실무에서 바로 쓰는 10가지 팁
              </p>
              <div className={styles.viewCountText}>조회수 45,230</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
