import { createRoot } from 'react-dom/client';
import './index.css';
import AppRoutes from './routes/index.jsx'; 
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
    <AppRoutes />
  </BrowserRouter>
);
