import React from 'react';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

// 컴포넌트 임포트
import ContentHeader from '../../components/ContentDetail/ContentHeader/ContentHeader';
import AuthorInfoCard from '../../components/ContentDetail/AuthorInfoCard/AuthorInfoCard';
import ContentBody from '../../components/ContentDetail/ContentBody/ContentBody';
import FileDownloadList from '../../components/ContentDetail/FileDownloadList/FileDownloadList';
import LikeCommentBar from '../../components/ContentDetail/LikeCommentBar/LikeCommentBar';
import RelatedContentList from '../../components/ContentDetail/RelatedContentList/RelatedContentList';
import ReplyList from './ReplyList';
import styles from './ContentDetailPage.module.css';
import { toggleContentLike } from '../../api/contentAPI';

/* 권한 확인용으로 임의 작성한 페이지 입니다. */
export const ContentDetailPage = () => {
  const { contentId } = useParams();
  console.log('[상세 페이지] contentId:', contentId);
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [likeCount, setLikeCount] = useState(content?.likeCount || 0);
  const [isLiked, setIsLiked] = useState(null);

  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    axios
      .get(`/api/content/${contentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => {
        const data = res.data;
        setContent(data);
        setLikeCount(data.likeCount || 0);

        if (data.liked !== undefined) {
          setIsLiked(data.liked);
        } else {
          setIsLiked(false);
        }
      })
      .catch(err => {
        console.error('콘텐츠 상세 조회 실패:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [contentId]);

  // 좋아요 클릭 시 호출
  const handleLikeClick = async () => {
    try {
      await toggleContentLike(contentId);
      const response = await axios.get(`/api/content/${contentId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      });

      const updated = response.data;

      setLikeCount(updated.likeCount);
      setIsLiked(updated.isLiked ?? updated.liked);
    } catch (error) {
      console.error('좋아요 처리 실패:', error);
    }
  };

  if (loading) return <div>로딩 중...</div>;
  if (!content) return <div>콘텐츠를 불러올 수 없습니다.</div>;

  console.log('content 정보', content);

  return (
    <div className={styles.pageWrapper}>
      <ContentHeader title={content.title} categories={content.categories} createdAt={content.createdAt} />
      <AuthorInfoCard
        nickname={content.creatorNickname}
        job={content.creatorJob}
        profileImageUrl={content.creatorProfileUrl}
      />
      <ContentBody thumbnailUrl={content.thumbnailUrl} description={content.content} />
      <FileDownloadList files={content.fileUrls} />

      <LikeCommentBar
        likeCount={likeCount}
        commentCount={content.commentCount}
        isLiked={isLiked}
        onLikeClick={handleLikeClick}
      />

      <ReplyList contentId={contentId} />
      <RelatedContentList creatorId={content.creatorId} />
    </div>
  );
};
