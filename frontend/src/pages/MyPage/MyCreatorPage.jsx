import React, { useState, useRef, useEffect } from 'react';
import styles from './mypage.module.css'; // CSS Modules 임포트
import { Link } from 'react-router-dom'; // Link 컴포넌트 임포트

export const MyCreatorPage = () => {
  return (
    <div className={styles.myCreatorPage} data-model-id="189:1450">
      <div className={styles.teamSectionWrapper}>
        <div className={styles.teamSection}>
          <div className={styles.mypageSection}>
            <div className={styles.dashboardSection}>
              {/* 프로필 이미지와 사용자 정보를 묶는 새로운 div 추가 */}
              <div className={styles.profileInfoGroup}>
                <img
                  className={styles.profileImage}
                  alt="Profile image"
                  src="https://c.animaapp.com/md5nv2zm9suaL3/img/profileimage.png"
                />

                <div className={styles.userInformation}>
                  {/* baseTextStyles와 nicknameText를 함께 적용 */}
                  <div className={`${styles.baseTextStyles} ${styles.nicknameText}`}>개발퀸</div>

                  {/* baseTextStyles와 jobText를 함께 적용 */}
                  <div className={`${styles.baseTextStyles} ${styles.jobText}`}>frontend Developer</div>

                  <a
                    // baseTextStyles와 emailText를 함께 적용
                    className={`${styles.baseTextStyles} ${styles.emailText}`}
                    href="mailto:creation1234@gmail.com"
                    rel="noopener noreferrer"
                    target="_blank">
                    creation1234@gmail.com
                  </a>

                  {/* baseTextStyles와 bioText를 함께 적용 */}
                  <p className={`${styles.baseTextStyles} ${styles.bioText}`}>
                    클린 코드와 테스트 주도 개발을 사랑하는 개발자. 실무에서 바로 쓸 수 있는 팁을 전합니다
                  </p>
                </div>
              </div>

              <div className={styles.profileEditButton}>
                {/* baseTextStyles와 div를 함께 적용 */}
                <div className={`${styles.baseTextStyles} ${styles.div}`}>프로필 수정</div>
              </div>
            </div>

            <div className={styles.menuListSection}>
              {/* 각 메뉴 아이템을 Link 컴포넌트로 변경하여 페이지 이동 기능 추가 */}
              <Link to="/creator-main/:creatorNickname" className={styles.labelWrapper}>
                {/* baseTextStyles와 label2를 함께 적용 */}
                <div className={`${styles.baseTextStyles} ${styles.label2}`}>내 프로필 보기</div>
              </Link>

              <Link to="/creator-management" className={styles.labelWrapper}>
                {/* baseTextStyles와 label2를 함께 적용 */}
                <div className={`${styles.baseTextStyles} ${styles.label2}`}>크리에이터 관리 페이지</div>
              </Link>

              <Link to="/subscription-manage" className={styles.labelWrapper}>
                {/* baseTextStyles와 label2를 함께 적용 */}
                <div className={`${styles.baseTextStyles} ${styles.label2}`}>구독 관리</div>
              </Link>

              <Link to="/favorites" className={styles.labelWrapper}>
                {/* baseTextStyles와 label2를 함께 적용 */}
                <div className={`${styles.baseTextStyles} ${styles.label2}`}>좋아요한 컨텐츠 목록</div>
              </Link>

              <Link to="/payments" className={styles.labelWrapper}>
                {/* baseTextStyles와 label2를 함께 적용 */}
                <div className={`${styles.baseTextStyles} ${styles.label2}`}>결제수단 관리</div>
              </Link>

              <Link to="/unregister" className={styles.labelWrapper}>
                {/* baseTextStyles와 label2를 함께 적용 */}
                <div className={`${styles.baseTextStyles} ${styles.label2}`}>회원 탈퇴</div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
