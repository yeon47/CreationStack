import { createRoot } from 'react-dom/client';
import './index.css';
import { LoginSection } from './pages/login/LoginSection';
import { MemberRegister } from './pages/register/MemberRegister';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// 홈 페이지 컴포넌트 (필요에 따라 생성)
function HomePage() {
  return (
    <div>
      <h1>Home Page</h1>
      <p>Welcome to the home page!</p>
    </div>
  );
}

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      {/* 홈 경로 */}
      <Route path="/" element={<HomePage />} />

      {/* 로그인 경로 */}
      <Route path="/api/auth/login" element={<LoginSection />} />

      {/* 회원가입 경로 */}
      <Route path="/api/users" element={<MemberRegister />} />

      {/* 404 처리 */}
      <Route path="*" element={<div>404 - Page Not Found</div>} />
    </Routes>
  </BrowserRouter>
);
