import React, { useState, useRef, useEffect } from "react";
import styles from "../styles/layout.module.css";
import logo from "../assets/img/logo.svg"
import { useNavigate, Link } from "react-router-dom"; // Link 임포트
import { searchUnified } from "../api/search";

export const NavbarCreator = () => {
  const [searchValue, setSearchValue] = useState('');
  const [activeMenu, setActiveMenu] = useState('홈');
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false); // 프로필 드롭다운 상태
  const navigate = useNavigate();
  const profileDropdownRef = useRef(null); // 프로필 드롭다운 ref
  const isLoggedIn = !!localStorage.getItem('accessToken'); // 로그인 상태 확인하는 변수

  // 프로필 드롭다운 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = event => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 로그아웃 기능 함수
  const handleLogout = async () => {
    setIsProfileDropdownOpen(false);
    const refreshToken = localStorage.getItem('refreshToken');

    if (!refreshToken) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      navigate('/login');
      return;
    }

    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      alert('로그아웃 되었습니다.');
      window.location.reload(); // 네비바 상태 업데이트를 위해 페이지 새로고침
    }
  };

  const handleSearchChange = e => {
    setSearchValue(e.target.value);
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (searchValue.trim()) {
      try {
        const searchResult = await searchUnified({ keyword: searchValue });
        console.log("검색 결과:", searchResult);
        navigate(`/search?keyword=${searchValue}`);
      } catch (error) {
        console.error("통합 검색 실패:", error);
      }
    }
  };

  const handleMenuClick = menu => {
    setActiveMenu(menu);
    // 메뉴 클릭 시 라우팅 로직 구현
    console.log('선택된 메뉴:', menu);
    // 실제 라우트 경로에 따라 navigate 호출
    if (menu === '홈') {
      navigate('/');
    } else if (menu === '크리에이터') {
      navigate('/creators'); // 예시 경로
    } else if (menu === '컨텐츠') {
      navigate('/contents'); // 예시 경로
    }
  };

  const handleCreateContent = () => {
    // 콘텐츠 작성 페이지로 이동
    console.log('콘텐츠 작성 버튼 클릭');
    navigate('/content-form');
  };

  const handleProfileClick = () => {
    // 프로필 드롭다운 토글
    setIsProfileDropdownOpen(prev => !prev);
  };

  const handleProfileMenuItemClick = path => {
    setIsProfileDropdownOpen(false); // 메뉴 클릭 시 드롭다운 닫기
    navigate(path);
  };

  const menuItems = ['홈', '크리에이터', '컨텐츠'];

  return (
    <nav className={styles.navbarCreator}>
      {/* 로고 섹션 */}
      <Link to="/" className={styles.logoSection}>
        <img
          className={styles.logoImg}
          alt="Logo"
          src={logo}
        />
      </Link>

      {/* 링크 메뉴바 */}
      <div className={styles.linkSection}>
        {menuItems.map(menu => (
          <button
            key={menu}
            className={`${styles.menuItem} ${activeMenu === menu ? styles.active : ''}`}
            onClick={() => handleMenuClick(menu)}>
            {menu}
          </button>
        ))}
      </div>

      {/* 검색창 */}
      <form className={styles.searchSection} onSubmit={handleSearchSubmit}>
        <div className={styles.searchBar}>
          <img
            className={styles.searchIcon}
            alt="Search icon"
            src="https://c.animaapp.com/md45uvjzPxvxqT/img/searchicon.svg"
          />
          <input
            type="text"
            className={styles.searchInput}
            placeholder="검색어를 입력하세요"
            value={searchValue}
            onChange={handleSearchChange}
          />
          {searchValue && (
            <button type="button" className={styles.clearButton} onClick={() => setSearchValue('')}>
              ×
            </button>
          )}
        </div>
      </form>

      {/* 우측 버튼들 */}
      <div className={styles.rightSection}>
        {isLoggedIn ? (
          // --- 로그인 상태일 때 보여줄 UI ---
          <>
            <button className={styles.createContentButton} onClick={handleCreateContent}>
              콘텐츠 작성
            </button>
            <div className={styles.profileButtonContainer} ref={profileDropdownRef}>
              <button className={styles.profileButton} onClick={handleProfileClick}>
                <img
                  className={styles.profileImage}
                  alt="Profile"
                  src="https://c.animaapp.com/md45uvjzPxvxqT/img/profilebutton-1.png"
                />
              </button>
              {isProfileDropdownOpen && (
                <div className={styles.profileDropdownMenu}>
                  <Link
                    to="/mypage-creator"
                    className={styles.profileDropdownMenuItem}
                    onClick={() => handleProfileMenuItemClick('/mypage-creator')}>
                    마이페이지
                  </Link>
                  <button className={styles.profileDropdownMenuItem} onClick={handleLogout}>
                    로그아웃
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          // --- 비로그인 상태일 때 보여줄 UI ---
          <>
            <Link to="/login" className={styles.authButton}>
              로그인
            </Link>
            <Link to="/register" className={styles.authButtonFilled}>
              회원가입
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavbarCreator;
