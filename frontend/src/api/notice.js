// src/api/notice.js
import axios from 'axios';

const noticeApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
});

// 인터셉터: 토큰 자동 주입
noticeApi.interceptors.request.use(config => {
  const accessToken = localStorage.getItem('accessToken');
  console.log(config.headers);
  console.log('📦 [INTERCEPTOR] token:', accessToken);

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
    console.log('📦 [INTERCEPTOR] 최종 헤더:', config.headers);
  }

  return config;
});

// 이모지 리액션 토글
export const toggleReaction = async (noticeId, emoji) => {
  return await noticeApi.post(
    `/api/notices/${noticeId}/reactions`,
    {},
    {
      params: { emoji },
    }
  );
};
// 이모지 리액션 전체 조회
export const getReactions = async noticeId => {
  return await noticeApi.get(`/api/notices/${noticeId}/reactions`);
};

// 크리에이터 공지 조회
export const getNotices = async creatorId => {
  console.log(creatorId);
  return await noticeApi.get(`/api/creators/${creatorId}/notices`);
};

/// 크리에이터 작성
export const saveNotice = async (creatorId, notice) => {
  return await noticeApi.post(`/api/creators/${creatorId}/notices`, {
    title: notice.title,
    content: notice.content,
    thumbnailUrl: notice.thumbnailUrl,
    creatorId: creatorId,
  });
};

// 크리에이터 수정
export const updateNotice = async (creatorId, noticeId, notice) => {
  return await noticeApi.put(`/api/creators/${creatorId}/notices/${noticeId}`, {
    title: notice.title,
    content: notice.content,
    thumbnailUrl: notice.thumbnailUrl,
  });
};

// 크리에이터 삭제
export const deleteNotice = async (creatorId, noticeId, notice) => {
  return await noticeApi.delete(`/api/creators/${creatorId}/notices/${noticeId}`);
};
