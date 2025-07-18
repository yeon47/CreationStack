import axios from 'axios';

const likeList = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  withCredentials: true,
});

likeList.interceptors.request.use(config => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 좋아요한 콘텐츠 목록 불러오기
export const fetchLikedContents = async () => {
  const response = await likeList.get('/api/users/me/likes');
  return response.data;
};

//좋아요 버튼 클릭
export const toggleLike = async contentId => {
  const response = await likeList.post(`/api/contents/${contentId}/like`);
  return response.data;
};

export default likeList;
