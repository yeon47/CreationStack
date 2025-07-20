import React, { useState, useRef, useEffect } from "react";
import styles from "../styles/layout.module.css";
import logo from "../assets/img/logo.svg"
import { useNavigate, Link } from "react-router-dom"; // Link 임포트

export const NavbarCreator = () => {
  const [searchValue, setSearchValue] = useState("");
  const [activeMenu, setActiveMenu] = useState("홈");
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false); // 프로필 드롭다운 상태
  const navigate = useNavigate();

  const profileDropdownRef = useRef(null); // 프로필 드롭다운 ref

  // 프로필 드롭다운 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchValue.trim()) {
      // 검색 로직 구현
      console.log("검색어:", searchValue);
    }
  };

  const handleMenuClick = (menu) => {
    setActiveMenu(menu);
    // 메뉴 클릭 시 라우팅 로직 구현
    console.log("선택된 메뉴:", menu);
    // 실제 라우트 경로에 따라 navigate 호출
    if (menu === "홈") {
      navigate("/");
    } else if (menu === "크리에이터") {
      navigate("/creators"); // 예시 경로
    } else if (menu === "컨텐츠") {
      navigate("/contents"); // 예시 경로
    }
  };

  const handleCreateContent = () => {
    // 콘텐츠 작성 페이지로 이동
    console.log("콘텐츠 작성 버튼 클릭");
    navigate("/content-form");
  };

  const handleProfileClick = () => {
    // 프로필 드롭다운 토글
    setIsProfileDropdownOpen(prev => !prev);
  };

  const handleProfileMenuItemClick = (path) => {
    setIsProfileDropdownOpen(false); // 메뉴 클릭 시 드롭다운 닫기
    navigate(path);
  };

  const menuItems = ["홈", "크리에이터", "컨텐츠"];

  return (
    <nav className={styles.navbarCreator}>
      {/* 로고 섹션 */}
      <div className={styles.logoSection}>
        <img
          className={styles.logoImg}
          alt="Logo"
          src={logo}
        />
      </div>

      {/* 링크 메뉴바 */}
      <div className={styles.linkSection}>
        {menuItems.map((menu) => (
          <button
            key={menu}
            className={`${styles.menuItem} ${
              activeMenu === menu ? styles.active : ""
            }`}
            onClick={() => handleMenuClick(menu)}
          >
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
            <button
              type="button"
              className={styles.clearButton}
              onClick={() => setSearchValue("")}
            >
              ×
            </button>
          )}
        </div>
      </form>

      {/* 우측 버튼들 */}
      <div className={styles.rightSection}>
        <button
          className={styles.createContentButton}
          onClick={handleCreateContent}
        >
          콘텐츠 작성
        </button>

        <div className={styles.profileButtonContainer} ref={profileDropdownRef}> {/* 드롭다운 컨테이너 */}
          <button
            className={styles.profileButton}
            onClick={handleProfileClick}
          >
            <img
              className={styles.profileImage}
              alt="Profile"
              src="https://c.animaapp.com/md45uvjzPxvxqT/img/profilebutton-1.png"
            />
          </button>

          {isProfileDropdownOpen && (
            <div className={styles.profileDropdownMenu}>
              {/* 마이페이지 링크 */}
              <Link
                to="/mypage-creator" // 마이페이지 경로 (크리에이터,유저 구별 로직 추후 필요)
                className={styles.profileDropdownMenuItem}
                onClick={() => handleProfileMenuItemClick("/mypage-creator")}
              >
                마이페이지
              </Link>
              {/* 로그아웃 링크 (실제 로그아웃 로직은 별도 구현 필요) */}
              <Link
                to="/logout" // 로그아웃 처리 경로 (예시)
                className={styles.profileDropdownMenuItem}
                onClick={() => handleProfileMenuItemClick("/logout")}
              >
                로그아웃
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavbarCreator;
