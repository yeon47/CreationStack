import React, { useState, useEffect } from 'react';
import styles from './mypage.module.css';
import { Link } from 'react-router-dom';
import { getMyProfile } from '../../api/user'; // 프로필 정보 API 호출 함수

export const MyPage = () => {
  // ✅ 1. 사용자 정보를 저장할 state (초기값 null)
  const [user, setUser] = useState(null);

  // ✅ 2. 컴포넌트 마운트 시 사용자 정보 API 호출
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getMyProfile();
        setUser(response.data.data); // state에 사용자 정보 저장
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        // 에러 발생 시 로그인 페이지로 보내는 등의 처리 가능
      }
    };
    fetchUserData();
  }, []); // 빈 배열을 전달하여 한 번만 실행

  // ✅ 3. 데이터 로딩 중일 때 로딩 화면 표시
  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.myCreatorPage}>
      <div className={styles.teamSectionWrapper}>
        <div className={styles.teamSection}>
          <div className={styles.mypageSection}>
            <div className={styles.dashboardSection}>
              <div className={styles.profileInfoGroup}>
                {/* ✅ 4. API로 가져온 실제 데이터 표시 */}
                <img
                  className={styles.profileImage}
                  alt="Profile"
                  src={user.profileImageUrl || 'https://c.animaapp.com/md5nv2zm9suaL3/img/profileimage.png'}
                />
                <div className={styles.userInformation}>
                  <div className={`${styles.baseTextStyles} ${styles.nicknameText}`}>{user.nickname}</div>
                  <div className={`${styles.baseTextStyles} ${styles.jobText}`}>{user.jobName || ''}</div>
                  <a className={`${styles.baseTextStyles} ${styles.emailText}`} href={`mailto:${user.email}`}>
                    {user.email}
                  </a>
                  <p className={`${styles.baseTextStyles} ${styles.bioText}`}>{user.bio}</p>
                </div>
              </div>

              <Link to="/profile/edit" className={styles.profileEditButton}>
                <div className={`${styles.baseTextStyles} ${styles.div}`}>프로필 수정</div>
              </Link>
            </div>

            <div className={styles.menuListSection}>
              {/* ✅ 5. 역할(role)에 따라 메뉴를 조건부로 렌더링 */}
              {user.role === 'CREATOR' ? (
                <Link to={`/creator-main/${user.nickname}`} className={styles.labelWrapper}>
                  <div className={`${styles.baseTextStyles} ${styles.label2}`}>내 프로필 보기</div>
                </Link>
              ) : (
                <Link to="/user-main" className={styles.labelWrapper}>
                  <div className={`${styles.baseTextStyles} ${styles.label2}`}>내 프로필 보기</div>
                </Link>
              )}

              {user.role === 'CREATOR' && (
                <Link to="/creator-management" className={styles.labelWrapper}>
                  <div className={`${styles.baseTextStyles} ${styles.label2}`}>크리에이터 관리 페이지</div>
                </Link>
              )}

              {/* 공통 메뉴 */}
              <Link to="/subscription-manage" className={styles.labelWrapper}>
                <div className={`${styles.baseTextStyles} ${styles.label2}`}>구독 관리</div>
              </Link>
              <Link to="/favorites" className={styles.labelWrapper}>
                <div className={`${styles.baseTextStyles} ${styles.label2}`}>좋아요한 컨텐츠 목록</div>
              </Link>
              <Link to="/payments" className={styles.labelWrapper}>
                <div className={`${styles.baseTextStyles} ${styles.label2}`}>결제수단 관리</div>
              </Link>
              <Link to="/unregister" className={styles.labelWrapper}>
                <div className={`${styles.baseTextStyles} ${styles.label2}`}>회원 탈퇴</div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
