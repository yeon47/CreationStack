// src/api/user.js
import axios from 'axios';

export const getPublicCreatorProfile = async (nickname, accessToken) => {
  try {
    const response = await axios.get(`http://localhost:8080/api/user/public/${encodeURIComponent(nickname)}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response;
  } catch (error) {
    return error;
  }
};
