import React from 'react';
import styles from '../styles/commentItem.module.css';
import btnstyles from '../styles/commentBtn.module.css';

const CommentItem = ({
  comment,
  isReply,
  editingComment,
  editContent,
  onEditChange,
  onEditSubmit,
  onEditStart,
  onEditCancel,
  onLike,
  onDelete,
  showReplyForm,
  onReplyToggle,
  replyContent,
  onReplyChange,
  onReplySubmit,
  onReplyCancel,
  userId,
}) => {
  const isEditing = editingComment === comment.commentId;
  const isOwner = comment.userId === userId;
  const isLiked = comment.likedByUser;
  const likeCount = comment.likeCount || 0;

  // 아바타 색상 생성 함수
  const getAvatarColor = userId => {
    const colors = [
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
      'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    ];
    return colors[userId % colors.length];
  };

  return (
    <div className={`${styles.commentItem} ${isReply ? styles.reply : ''}`}>
      <div className={styles.avatar}>
        <div className={styles.avatarCircle} style={{ background: getAvatarColor(comment.userId) }}>
          {comment.username ? comment.username.charAt(0).toUpperCase() : '익'}
        </div>
      </div>

      <div className={styles.commentMain}>
        <div className={styles.commentHeader}>
          <span className={styles.username}>{comment.user?.nickname}</span>
          <span className={styles.userRole}>{comment.user?.job}</span>
          <span className={styles.date}>{new Date(comment.createdAt).toLocaleDateString()}</span>
        </div>

        <div className={styles.commentContent}>
          {isEditing ? (
            <div className={styles.editForm}>
              <textarea value={editContent} onChange={onEditChange} rows="3" className={styles.editTextarea} />
              <div className={styles.editActions}>
                <button onClick={() => onEditSubmit(comment.commentId)} className={btnstyles.btnSubmit}>
                  수정
                </button>
                <button onClick={onEditCancel} className={styles.cancelBtn}>
                  취소
                </button>
              </div>
            </div>
          ) : (
            <p className={`${styles.contentText} ${comment.isDeleted ? styles.deleted : ''}`}>
              {comment.isDeleted ? '삭제된 댓글입니다' : comment.contentText}
            </p>
          )}
        </div>

        <div className={styles.commentFooter}>
          <button
            onClick={() => onLike(comment.commentId)}
            className={`${styles.actionButton} ${isLiked ? styles.liked : ''}`}>
            <span className={styles.heartIcon}>{isLiked ? '❤️' : '🤍'}</span>
            <span className={styles.count}>{likeCount}</span>
          </button>

          {!isReply && (
            <button
              onClick={() => onReplyToggle(showReplyForm === comment.commentId ? null : comment.commentId)}
              className={styles.actionButton}>
              답글
            </button>
          )}

          {isOwner && (
            <>
              <button onClick={() => onEditStart(comment)} className={styles.actionButton}>
                수정
              </button>

              <button onClick={() => onDelete(comment.commentId)} className={`${styles.actionButton} ${styles.delete}`}>
                삭제
              </button>
            </>
          )}
        </div>

        {/* 답글 작성 폼 */}
        {showReplyForm === comment.commentId && (
          <div className={styles.replyForm}>
            <h3 className={styles.replyTitle}>답글 작성</h3>
            <textarea
              value={replyContent || ''}
              onChange={e => onReplyChange(comment.commentId, e.target.value)}
              placeholder="답글을 입력하세요..."
              rows="2"
              className={styles.replyTextarea}
            />
            <div className={styles.replyActions}>
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
