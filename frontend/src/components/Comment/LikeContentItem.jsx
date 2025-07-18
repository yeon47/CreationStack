import React from 'react';
import styles from '../../styles/comment/likeContentItem.module.css';

const FavoriteContentItem = ({ post, onUnlike }) => {
  const formattedDate = new Date(post.createdAt.replace(' ', 'T')).toLocaleDateString('ko-KR');

  return (
    <div className={styles.item}>
      <div className={styles.left}>
        <div className={styles.profile}>
          {post.profileImage ? (
            <img src={post.profileImage} alt="프로필" />
          ) : (
            <div className={styles.placeholder}>{post.nickname?.[0] || '?'}</div>
          )}
        </div>
        <div>
          <div className={styles.meta}>
            <span className={styles.nickname}>{post.nickname}</span>
            <span className={styles.job}>{post.job}</span>
            <span className={styles.date}>{formattedDate}</span>
          </div>
          <h3 className={styles.title}>{post.title}</h3>
          <div className={styles.tags}>
            {post.job && <span className={styles.tag}>{post.job}</span>}
            {post.category && <span className={styles.tag}>{post.category}</span>}
          </div>
        </div>
      </div>
      <button className={styles.heart} onClick={() => onUnlike(post.id)} title="좋아요 취소">
        ❤️
      </button>
    </div>
  );
};

export default FavoriteContentItem;
