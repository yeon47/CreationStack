import React from 'react';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

/* 권한 확인용으로 임의 작성한 페이지 입니다. */
export const ContentDetailPage = () => {
  const { contentId } = useParams();
  console.log('[상세 페이지] contentId:', contentId);
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    axios
      .get(`/api/content/${contentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => {
        setContent(res.data);
      })
      .catch(err => {
        console.error('콘텐츠 상세 조회 실패:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [contentId]);

  if (loading) return <div>로딩 중...</div>;
  if (!content) return <div>콘텐츠를 불러올 수 없습니다.</div>;

  console.log('content 정보', content);
  return (
    <div>
      <h1>{content.title}</h1>
      <img src={content.thumbnailUrl} alt={content.title} style={{ width: '100%', maxWidth: 600 }} />
      <p>크리에이터닉네임: {content.creatorNickname}</p>
      <p>조회수: {content.viewCount}</p>
      <p>좋아요 수: {content.likeCount}</p>
      <p>댓글 수: {content.commentCount}</p>
      <p>등록일: {new Date(content.createdAt).toLocaleDateString()}</p>
      <p>유형: {content.accessType === 'SUBSCRIBER' ? '구독 전용 콘텐츠' : '무료 콘텐츠'}</p>
      {content.categories && content.categories.length > 0 ? (
        <p>카테고리: {content.categories.map(c => c.name).join(', ')}</p>
      ) : (
        <p>카테고리: 없음</p>
      )}
      <hr />
      <p>{content.content}</p>
    </div>
  );
};
