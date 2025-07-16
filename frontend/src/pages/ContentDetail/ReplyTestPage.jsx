// src/pages/ReplyTestPage.jsx
import React from 'react';
import ReplyList from './ReplyList';

const ReplyTestPage = () => {
  const testContentId = 1; // 테스트용 콘텐츠 ID

  return (
    <div style={{ padding: '2rem' }}>
      <h2>🧪 댓글 테스트 페이지</h2>
      <ReplyList contentId={testContentId} />
    </div>
  );
};

export default ReplyTestPage;
