// src/api/user.js
import axios from 'axios';

export const getPublicCreatorProfile = async (nickname) => {
  return axios.get(`/api/user/public/${encodeURIComponent(nickname)}`);
};
