// src/api/contentApi.js
import axios from 'axios';

// 콘텐츠 생성 요청 api 함수
export async function createContent(formData, creatorId) {
  try {
    const response = await axios.post(`/api/content?creatorId=${creatorId}`, formData, {
      headers: {
        // FormData 사용 시 Content-Type은 axios가 자동 설정
      },
    });
    return response.data;
  } catch (error) {
    console.error('콘텐츠 생성 API 호출 실패:', error);
    // axios error 객체는 response, request, message 등을 가짐
    throw error.response?.data || error;
  }
}

// 특정 크리에이터의 콘텐츠 목록을 조회하는 API 호출 함수
export async function getContentsByCreator(creatorId) {
  try {
    const response = await axios.get(`/api/content/creator/${creatorId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error(`크리에이터 ID ${creatorId}의 콘텐츠 목록 조회 실패:`, error);
    throw error.response?.data || error;
  }
}

// 콘텐츠 접근 권한 확인
export const checkContentAccess = async (contentId) => {
  const token = localStorage.getItem('accessToken');
  return axios.get(`/api/content/${contentId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
