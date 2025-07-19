import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';

import { LoginSection } from '../pages/Login/LoginSection';
import { MemberRegister } from '../pages/Register/MemberRegister';

import PaymentMethodManagementPage from '../pages/Payment/PaymentMethodManagementPage';
import ContentFormPage from '../pages/ContentForm/ContentFormPage';
import { MyCreatorPage } from '../pages/MyPage/MyCreatorPage';
import { MyUserPage } from '../pages/MyPage/MyUserPage';
import { SubscriptionManage } from '../pages/ManageSubscriptionPage/SubscriptionManage';
import { UserMainPage } from '../pages/MainPage/UserMainPage/UserMainPage';

import MainLayout from '../layouts/mainLayout';
import ReplyTestPage from '../pages/ContentDetail/ReplyTestPage';
import FavoriteContent from '../pages/FavoriteContent/FavoriteContent';
import { CreatorMainPage } from '../pages/MainPage/CreatorMainPage/CreatorMainPage';
//import CreatorManagementPage from '../pages/CreatorManagement/CreatorManagementPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* 홈 경로 */}
        <Route path="/" element={<Home />} />

        <Route path="/payments" element={<PaymentMethodManagementPage />} />
        <Route path="/reply-test" element={<ReplyTestPage />} />
        <Route path="/favorites" element={<FavoriteContent />} />
        {/* <Route path="/creator-management" element={<CreatorManagementPage />} /> */}
        <Route path="/content-form" element={<ContentFormPage />} />
        <Route path="/mypage-creator" element={<MyCreatorPage />} /> {/* 크리에이터 마이페이지 */}
        <Route path="/mypage-user" element={<MyUserPage />} /> {/* 사용자 마이페이지 */}
        <Route path="/subscription-manage" element={<SubscriptionManage />} />
        <Route path="/user-main" element={<UserMainPage />} />
        <Route path="/creator-main/:creatorNickname" element={<CreatorMainPage />} />
      </Route>

      <Route path="/login" element={<LoginSection />} />
      <Route path="/register" element={<MemberRegister />} />

      {/* 404 처리 */}
      <Route path="*" element={<div>404 - Page Not Found</div>} />
    </Routes>
  );
}
