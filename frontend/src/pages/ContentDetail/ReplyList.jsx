import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CommentItem from '../../components/CommentItem';
import styles from '../../styles/ReplyList.module.css';
import btnstyles from '../../styles/commentBtn.module.css';

const ReplyList = ({ contentId }) => {
  const [comments, setComments] = useState([]);
  const [showReplyForm, setShowReplyForm] = useState(null);
  const [editingComment, setEditingComment] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [newComment, setNewComment] = useState('');
  const [replyContents, setReplyContents] = useState({});
  const [loading, setLoading] = useState(false);
  const userId = Number(localStorage.getItem('userId'));

  const getAuthHeaders = () => {
    const token = localStorage.getItem('accessToken');
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    };
  };

  const fetchComments = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/contents/${contentId}/comments`, getAuthHeaders());
      setComments(res.data);
    } catch (err) {
      alert('댓글 불러오기 실패');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (contentId) fetchComments();
  }, [contentId]);

  const handleNewComment = async () => {
    if (!newComment.trim() || !userId) return alert('로그인이 필요합니다.');
    try {
      await axios.post(
        `/api/contents/${contentId}/comments`,
        {
          contentText: newComment,
          contentId,
          parentCommentId: null,
          userId,
        },
        getAuthHeaders()
      );
      setNewComment('');
      fetchComments();
    } catch {
      alert('댓글 등록 실패');
    }
  };

  const handleReplyChange = (parentId, value) => {
    setReplyContents(prev => ({ ...prev, [parentId]: value }));
  };

  // 답글 등록
  const handleReplySubmit = async parentId => {
    const content = replyContents[parentId];
    if (!content?.trim()) return alert('답글 입력');
    try {
      await axios.post(
        `/api/contents/${contentId}/comments`,
        {
          contentText: content,
          contentId,
          parentCommentId: parentId,
          userId,
        },
        getAuthHeaders()
      );
      setReplyContents(prev => {
        const copy = { ...prev };
        delete copy[parentId];
        return copy;
      });
      setShowReplyForm(null);
      fetchComments();
    } catch {
      alert('답글 실패');
    }
  };

  const handleEditSubmit = async commentId => {
    if (!editContent.trim()) return;

    const confirmEdit = window.confirm('댓글을 수정하시겠습니까?');
    if (!confirmEdit) return;

    try {
      await axios.put(
        `/api/contents/${contentId}/comments/${commentId}`,
        {
          contentText: editContent,
        },
        getAuthHeaders()
      );
      setEditingComment(null);
      setEditContent('');
      fetchComments();
    } catch {
      alert('수정 실패');
    }
  };

  const handleLike = async commentId => {
    try {
      const { headers } = getAuthHeaders();
      const params = { userId };

      // 서버에 좋아요/좋아요 취소 요청
      await axios.post(
        `/api/contents/${contentId}/comments/${commentId}/like`,
        {},
        {
          headers,
          params,
        }
      );

      // 로컬 상태 업데이트 (서버 응답을 기다리지 않고 즉시 UI 업데이트)
      setComments(prevComments =>
        prevComments.map(comment => {
          if (comment.commentId === commentId) {
            const isCurrentlyLiked = comment.likedByUser;
            return {
              ...comment,
              likedByUser: !isCurrentlyLiked,
              likeCount: isCurrentlyLiked ? (comment.likeCount || 1) - 1 : (comment.likeCount || 0) + 1,
            };
          }
          return comment;
        })
      );

      // 서버 데이터와 동기화 (선택적)
      // fetchComments();
    } catch (error) {
      alert('좋아요 처리 실패');
      console.error(error);
      // 오류 발생 시 서버에서 최신 데이터 다시 가져오기
      fetchComments();
    }
  };

  const handleDelete = async commentId => {
    if (!window.confirm('삭제할까요?')) return;
    try {
      const res = await axios.delete(
        `/api/contents/${contentId}/comments/${commentId}?userId=${userId}`,
        getAuthHeaders()
      );
      fetchComments();
    } catch (err) {
      alert('삭제 실패');
    }
  };

  const totalCommentCount = comments.filter(c => !c.parentCommentId).length;

  if (loading) return <div className={styles.loading}>댓글을 불러오는 중...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.commentHeader}>
        <h2>댓글 {totalCommentCount}</h2>
      </div>

      <div className={styles.newComment}>
        <h3>댓글 작성</h3>
        <textarea
          value={newComment}
          onChange={e => setNewComment(e.target.value)}
          placeholder="댓글을 입력하세요..."
          rows="4"
        />
        <div className={styles.newCommentActions}>
          <button onClick={handleNewComment} className={btnstyles.btnSubmit}>
            댓글 작성
          </button>
        </div>
      </div>

      <div className={styles.commentList}>
        {/*댓글목록*/}
        {comments
          .filter(c => !c.parentCommentId)
          .map(comment => (
            <div key={`comment-${comment.commentId}`} className={styles.commentItem}>
              <CommentItem
                comment={comment}
                isReply={false}
                editingComment={editingComment}
                editContent={editContent}
                onEditChange={e => setEditContent(e.target.value)}
                onEditSubmit={handleEditSubmit}
                onEditStart={comment => {
                  setEditingComment(comment.commentId);
                  setEditContent(comment.contentText);
                }}
                onEditCancel={() => {
                  setEditingComment(null);
                  setEditContent('');
                }}
                onLike={handleLike}
                onDelete={handleDelete}
                showReplyForm={showReplyForm}
                onReplyToggle={setShowReplyForm}
                replyContent={replyContents[comment.commentId]}
                onReplyChange={handleReplyChange}
                onReplySubmit={handleReplySubmit}
                onReplyCancel={id => {
                  setShowReplyForm(null);
                  setReplyContents(prev => {
                    const copy = { ...prev };
                    delete copy[id];
                    return copy;
                  });
                }}
                userId={userId}
              />
              {/*답글목록*/}
              {comments
                .filter(reply => reply.parentCommentId === comment.commentId)
                .map(reply => (
                  <div key={`reply-${reply.commentId}`} className={styles.replies}>
                    <CommentItem
                      comment={reply}
                      isReply={true}
                      editingComment={editingComment}
                      editContent={editContent}
                      onEditChange={e => setEditContent(e.target.value)}
                      onEditSubmit={handleEditSubmit}
                      onEditStart={comment => {
                        setEditingComment(comment.commentId);
                        setEditContent(comment.contentText);
                      }}
                      onEditCancel={() => {
                        setEditingComment(null);
                        setEditContent('');
                      }}
                      onLike={handleLike}
                      onDelete={handleDelete}
                      showReplyForm={showReplyForm}
                      onReplyToggle={setShowReplyForm}
                      replyContent={replyContents[reply.commentId]}
                      onReplyChange={handleReplyChange}
                      onReplySubmit={handleReplySubmit}
                      onReplyCancel={id => {
                        setShowReplyForm(null);
                        setReplyContents(prev => {
                          const copy = { ...prev };
                          delete copy[id];
                          return copy;
                        });
                      }}
                      userId={userId}
                    />
                  </div>
                ))}
            </div>
          ))}
      </div>
    </div>
  );
};

export default ReplyList;
