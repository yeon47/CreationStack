import React, { useState } from "react";
import styles from "../styles/layout.module.css";

export const NavbarCreator = () => {
  const [searchValue, setSearchValue] = useState("");
  const [activeMenu, setActiveMenu] = useState("홈");

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
  };

  const handleCreateContent = () => {
    // 콘텐츠 작성 페이지로 이동
    console.log("콘텐츠 작성 버튼 클릭");
  };

  const handleProfileClick = () => {
    // 프로필 메뉴 토글 또는 프로필 페이지로 이동
    console.log("프로필 버튼 클릭");
  };

  const menuItems = ["홈", "크리에이터", "컨텐츠"];

  return (
    <nav className={styles.navbarCreator}>
      {/* 로고 섹션 */}
      <div className={styles.logoSection}>
        <img
          className={styles.logoImg}
          alt="Logo"
          src="https://c.animaapp.com/md45uvjzPxvxqT/img/mask-group-2.svg"
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
      </div>
    </nav>
  );
};