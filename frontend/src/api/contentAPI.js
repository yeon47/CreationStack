// src/api/contentApi.js

// 콘텐츠 생성 요청 api 함수
export async function createContent(formData, creatorId) {
  try {
    const response = await fetch(`/api/content?creatorId=${creatorId}`, {
      method: 'POST',
      body: formData,
      // FormData 사용 시 Content-Type 헤더는 브라우저가 자동으로 설정하므로 명시하지 않습니다.
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message || response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('콘텐츠 생성 API 호출 실패:', error);
    throw error; // 호출자에게 에러를 다시 던집니다.
  }
}


// 특정 크리에이터의 콘텐츠 목록을 조회하는 API 호출 함수
export async function getContentsByCreator(creatorId) {
  try {
    const response = await fetch(`/api/content/creator/${creatorId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message || response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`크리에이터 ID ${creatorId}의 콘텐츠 목록 조회 실패:`, error);
    throw error;
  }
}
