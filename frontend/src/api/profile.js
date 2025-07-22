// src/api/profile.js
import axios from 'axios';

export const getPublicCreatorProfile = async (nickname, accessToken) => {
  try {
    console.log(nickname);
    const response = await axios.get(`http://localhost:8080/api/user/public/${encodeURIComponent(nickname)}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log(response.data);
    return response;
  } catch (error) {
    return error;
  }
};

export const getPublicUserProfile = async nickname => {
  try {
    const token = localStorage.getItem('accessToken');
    const headers = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    const response = await axios.get(`/api/user/public/${encodeURIComponent(nickname)}`, { headers });
    console.log(response);
    return response.data;
  } catch (error) {
    console.error('공개 프로필 조회 실패:', error);
    throw error;
  }
};
