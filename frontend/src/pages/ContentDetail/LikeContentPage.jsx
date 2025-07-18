import React, { useEffect, useState } from 'react';
import FavoriteContentItem from '../../components/Comment/LikeContentItem';
import styles from '../../styles/comment/likeContentPage.module.css';

const FavoriteContentPage = () => {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const postsPerPage = 5;

  useEffect(() => {
    fetchFavoritePosts();
  }, []);

  const fetchFavoritePosts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/favorite-posts');
      if (!response.ok) throw new Error('API 호출 실패');
      const data = await response.json();
      setPosts(data.posts || data);
    } catch (error) {
      console.error(error);
      setPosts([]); // API 실패 시 빈 배열
    } finally {
      setLoading(false);
    }
  };

  const handleUnlike = async postId => {
    try {
      const response = await fetch(`/api/posts/${postId}/unlike`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('좋아요 취소 실패');
      setPosts(prev => prev.filter(p => p.id !== postId));
    } catch (err) {
      console.error(err);
      alert('좋아요 취소 실패');
    }
  };

  const indexOfLast = currentPage * postsPerPage;
  const indexOfFirst = indexOfLast - postsPerPage;
  const currentPosts = posts.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(posts.length / postsPerPage);

  const getPageNumbers = () => {
    const pages = [];
    const max = 5;
    if (totalPages <= max) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else if (currentPage <= 3) {
      pages.push(1, 2, 3, '...', totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
    }
    return pages;
  };

  return (
    <div className={styles.favoriteContentPage}>
      <div className={styles.container}>
        <h1 className={styles.title}>좋아요한 컨텐츠 목록</h1>

        {loading ? (
          <p className={styles.state}>데이터를 불러오는 중...</p>
        ) : posts.length === 0 ? (
          <p className={styles.state}>좋아요한 컨텐츠가 없습니다.</p>
        ) : (
          <>
            <div className={styles.list}>
              {currentPosts.map(post => (
                <FavoriteContentItem key={post.id} post={post} onUnlike={handleUnlike} />
              ))}
            </div>

            <div className={styles.pagination}>
              <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
                &lt; Prev
              </button>
              {getPageNumbers().map((num, idx) => (
                <button
                  key={idx}
                  disabled={num === '...'}
                  className={`${styles.pageBtn} ${num === currentPage ? styles.active : ''}`}
                  onClick={() => typeof num === 'number' && setCurrentPage(num)}>
                  {num}
                </button>
              ))}
              <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
                Next &gt;
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FavoriteContentPage;
