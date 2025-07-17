// components/LikePostList.jsx
import React from 'react';
import { Heart } from 'lucide-react';
import styles from '../styles/favoriteContent.module.css';

const LikePostList = ({ currentPage, posts }) => {
  const postsPerPage = 10;
  const startIndex = (currentPage - 1) * postsPerPage;
  const currentPosts = posts.slice(startIndex, startIndex + postsPerPage);

  return (
    <div className={styles.likePostList}>
      {currentPosts.map(post => (
        <div key={post.id} className={styles.postItem}>
          <div className={styles.postContent}>
            <h3 className={styles.postTitle}>{post.title}</h3>
            <div className={styles.postHeader}>
              <div className={styles.profileAvatar}>
                <img src={post.profileImage} alt={post.author} />
              </div>
              <div className={styles.postInfo}>
                <div className={styles.postAuthor}>{post.author}</div>
                <div className={styles.postDate}>{post.date}</div>
              </div>
            </div>
            <div className={styles.postCategoriesRow}>
              <div className={styles.postCategories}>
                {post.categories.map((category, index) => (
                  <span key={index} className={styles.postCategory}>
                    {category}
                  </span>
                ))}
              </div>

              <div
                className={styles.postLikes}
                onClick={() => {
                  toggleLike(post.id).then(() => {
                    if (onLikeToggle) onLikeToggle(); // refetch trigger
                  });
                }}>
                <Heart size={16} fill="#ef4444" color="#ef4444" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LikePostList;
