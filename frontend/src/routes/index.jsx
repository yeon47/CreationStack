import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import MainLayout from '../layouts/mainLayout';
import ReplyTestPage from '../pages/ContentDetail/ReplyTestPage';
import FavoriteContent from '../pages/MyPage/FavoriteContent';

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/reply-test" element={<ReplyTestPage />} />
        <Route path="/favorites" element={<FavoriteContent />} />
      </Route>

      {/* 로그인/회원가입 같이 레이아웃 제외할 페이지는 별도 Route로 */}
      {/* <Route path="/login" element={<Login />} /> */}
    </Routes>
  );
}
