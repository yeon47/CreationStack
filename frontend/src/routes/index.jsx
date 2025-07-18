import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';

import { LoginSection } from '../pages/login/LoginSection';
import { MemberRegister } from '../pages/register/MemberRegister';

import PaymentMethodManagementPage from '../pages/Payment/PaymentMethodManagementPage';
import ContentFormPage from '../pages/ContentForm/ContentFormPage';
import { MyCreatorPage } from '../pages/MyCreatorPage/MyCreatorPage';
import { SubscriptionManage } from '../pages/ManageSubscriptionPage/SubscriptionManage';
import { UserMainPage } from '../pages/MainPage/UserMainPage/UserMainPage';
import MainLayout from '../layouts/mainLayout';
import ReplyTestPage from '../pages/ContentDetail/ReplyTestPage';

import { CreatorMainPage } from '../pages/MainPage/CreatorMainPage/CreatorMainPage';

import LikeContentPage from '../pages/ContentDetail/LikeContentPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* 홈 경로 */}
        <Route path="/" element={<Home />} />

        <Route path="/payments" element={<PaymentMethodManagementPage />} />
        <Route path="/reply-test" element={<ReplyTestPage />} />
        <Route path="/favorites" element={<LikeContentPage />} />
        <Route path="/content-form" element={<ContentFormPage />} />
        <Route path="/mypage-creator" element={<MyCreatorPage />} />
        <Route path="/subscription-manage" element={<SubscriptionManage />} />
        <Route path="/user-main" element={<UserMainPage />} />
        <Route path="/creator-main/:creatorNickname" element={<CreatorMainPage />} />
      </Route>

      {/* 로그인/회원가입 같이 레이아웃 제외할 페이지는 별도 Route로 */}
      {/* <Route path="/login" element={<Login />} /> */}

      {/* 로그인 경로 */}
      <Route path="/api/auth/login" element={<LoginSection />} />
      {/* 회원가입 경로 */}
      <Route path="/api/users" element={<MemberRegister />} />

      {/* 404 처리 */}
      <Route path="*" element={<div>404 - Page Not Found</div>} />
    </Routes>
  );
}
