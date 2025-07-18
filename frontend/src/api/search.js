import axios from "axios";
axios.defaults.withCredentials = true;

export const searchCreator = async (page, keyword = "") => {
  try {
    const response = await axios.get(`/api/creators`, {
      params: {
        keyword, // ✅ SearchDto 필드
        page, // ✅ Pageable용
      },
    });

    return response.data;
  } catch (error) {
    return error;
  }
};

export const searchContent = async (page, keyword = "") => {
  try {
    const response = await axios.get("/api/contents", {
      params: {
        keyword,
        page,
      },
    });

    return response.data;
  } catch (error) {
    return error;
  }
};

export const searchUnified = async ({
  keyword = "",
  categories = [],
  accessType,
  searchMode,
  creatorId,
  sort = "createdAt",
} = {}) => {
  try {
    const params = {
      keyword,
      sort,
    };

    if (categories.length > 0) {
      categories.forEach((id, idx) => {
        params[`categories[${idx}]`] = id;
      });
      // 또는 axios가 배열로 자동 변환하게 하려면 그냥 `params.categories = categories`
      params.categories = categories;
    }

    if (accessType) params.accessType = accessType;
    if (searchMode) params.searchMode = searchMode;
    if (creatorId) params.creatorId = creatorId;

    const response = await axios.get("/api/contents/search", {
      params,
    });

    return response.data;
  } catch (error) {
    console.error(error);
    return error;
  }
};
