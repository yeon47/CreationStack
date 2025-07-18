import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import LikePostList from '../../components/LikePostList';
import styles from '../../styles/favoriteContent.module.css';
import { fetchLikedContents } from '../../api/LikeList';

export default function FavoriteContent() {
  const [currentPage, setCurrentPage] = useState(1);
  const [posts, setPosts] = useState([]);
  const postsPerPage = 10;

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchLikedContents();
        setPosts(data); // 응답이 배열이라면 그대로
      } catch (error) {
        console.error('좋아요한 콘텐츠 불러오기 실패:', error);
      }
    };

    loadData();
  }, []);

  const totalPages = Math.ceil(posts.length / postsPerPage);

  const handlePageChange = page => setCurrentPage(page);
  const handlePrevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const handleNextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);

  const renderPageNumbers = () =>
    Array.from({ length: totalPages }, (_, i) => (
      <button
        key={i + 1}
        onClick={() => handlePageChange(i + 1)}
        className={`${styles.pageNumber} ${i + 1 === currentPage ? styles.pageNumberActive : ''}`}>
        {i + 1}
      </button>
    ));

  const handleRefetch = async () => {
    try {
      const data = await fetchLikedContents();
      setPosts(data);
    } catch (error) {
      console.error('좋아요 리스트 새로고침 실패:', error);
    }
  };

  useEffect(() => {
    handleRefetch();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-semibold text-center text-gray-900 mb-12">좋아요한 콘텐츠 목록</h1>

        <div className="space-y-4 mb-8">
          <LikePostList currentPage={currentPage} posts={posts} onLikeToggle={handleRefetch} />;
        </div>

        <div className="flex justify-center items-center space-x-2">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-500 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed">
            <ChevronLeft size={16} />
            <span>Prev</span>
          </button>

          <div className="flex space-x-2">{renderPageNumbers()}</div>

          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-900 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed">
            <span>Next</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
