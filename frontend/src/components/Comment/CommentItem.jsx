import React from 'react';
import styles from '../../styles/comment/commentItem.module.css';
import btnstyles from '../../styles/comment/commentBtn.module.css';

const CommentItem = ({
  comment,
  isReply,
  editingTargetId,
  editContent,
  onEditChange,
  onEditSubmit,
  onEditStart,
  onEditCancel,
  onLike,
  onDelete,
  replyTargetId,
  onReplyToggle,
  replyContent,
  onReplyChange,
  onReplySubmit,
  onReplyCancel,
  userId,
}) => {
  const isEditing = editingTargetId === `comment-${comment.commentId}`;
  const isOwner = comment.userId === userId;
  const isLiked = comment.likedByUser;
  const likeCount = comment.likeCount || 0;

  return (
    <div className={`${styles.commentItem} ${isReply ? styles.reply : ''}`}>
      <div className={styles.avatar}>
        <div className={styles.avatarCircle}>{comment.nickname ? comment.nickname[0].toUpperCase() : '익'}</div>
      </div>

      <div className={styles.commentMain}>
        <div className={styles.commentHeader}>
          <span className={styles.username}>{comment.nickname}</span>
          <span className={styles.userRole}>{comment.job}</span>
          <span className={styles.date}>
            {' '}
            {comment.createdAt ? new Date(comment.createdAt.replace(' ', 'T')).toLocaleString('ko-KR') : ''}
          </span>
        </div>

        {isEditing ? (
          <div className={styles.editForm}>
            <textarea value={editContent} onChange={onEditChange} rows="4" className={styles.editTextarea} />
            <div className={styles.editActions}>
              <button onClick={() => onEditSubmit(comment.commentId)} className={btnstyles.btnSubmit}>
                수정
              </button>
              <button onClick={() => onEditCancel(comment.commentId)} className={styles.cancelBtn}>
                취소
              </button>
            </div>
          </div>
        ) : (
          <div className={styles.commentContent}>
            <p className={`${styles.contentText} ${comment.isDeleted ? styles.deleted : ''}`}>
              {comment.isDeleted ? '삭제된 댓글입니다' : comment.contentText}
            </p>
          </div>
        )}

        <div className={styles.commentFooter}>
          <button
            onClick={() => onLike(comment.commentId)}
            className={`${styles.actionButton} ${isLiked ? styles.liked : ''}`}>
            {isLiked ? '❤️' : '🤍'} {likeCount}
          </button>
          {!isReply && (
            <button onClick={() => onReplyToggle(comment.commentId)} className={styles.actionButton}>
              답글
            </button>
          )}
          {isOwner && !comment.isDeleted && (
            <>
              <button onClick={() => onEditStart(comment)} className={styles.actionButton}>
                수정
              </button>
              <button onClick={() => onDelete(comment.commentId)} className={styles.actionButton}>
                삭제
              </button>
            </>
          )}
        </div>

        {replyTargetId === `reply-${comment.commentId}` && (
          <div className={styles.replyForm}>
            <textarea
              value={replyContent || ''}
              onChange={e => onReplyChange(comment.commentId, e.target.value)}
              placeholder="답글을 입력하세요..."
              rows="4"
              className={styles.editTextarea}
            />
            <div className={styles.editActions}>
              <button onClick={() => onReplySubmit(comment.commentId)} className={btnstyles.btnSubmit}>
                답글 작성
              </button>
              <button onClick={() => onReplyCancel(comment.commentId)} className={styles.cancelBtn}>
                취소
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentItem;
