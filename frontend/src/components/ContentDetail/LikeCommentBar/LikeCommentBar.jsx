import React from 'react';
import styles from './LikeCommentBar.module.css';

const LikeCommentBar = ({ likeCount, commentCount }) => {
  return (
    <div className={styles.bar}>
      <span>❤️ 좋아요 {likeCount}</span>
      <span>💬 댓글 {commentCount}</span>
    </div>
  );
};

export default LikeCommentBar;
