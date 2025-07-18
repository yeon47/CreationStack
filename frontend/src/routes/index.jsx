import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';

import { LoginSection } from '../pages/Login/LoginSection';
import { MemberRegister } from '../pages/Register/MemberRegister';

import PaymentMethodManagementPage from '../pages/Payment/PaymentMethodManagementPage';
import ContentFormPage from '../pages/ContentForm/ContentFormPage';
import { MyCreatorPage } from '../pages/MyCreatorPage/MyCreatorPage';
import { SubscriptionManage } from '../pages/ManageSubscriptionPage/SubscriptionManage';
import { UserMainPage } from '../pages/MainPage/UserMainPage/UserMainPage';

import MainLayout from '../layouts/mainLayout';
import ReplyTestPage from '../pages/ContentDetail/ReplyTestPage';
import FavoriteContent from '../pages/MyPage/FavoriteContent';
import { CreatorMainPage } from '../pages/MainPage/CreatorMainPage/CreatorMainPage';

import { CreatorSearchPage } from "../pages/CreatorSearchPage/CreatorSearchPage";
import { ContentSearchPage } from "../pages/ContentSearchPage/ContentSearchPage";
import { UnifiedSearchPage } from "../pages/UnifiedSearchPage/UnifiedSearchPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* 홈 경로 */}
        <Route path="/" element={<Home />} />

        <Route path="/payments" element={<PaymentMethodManagementPage />} />
        <Route path="/reply-test" element={<ReplyTestPage />} />
        <Route path="/favorites" element={<FavoriteContent />} />
        <Route path="/content-form" element={<ContentFormPage />} />
        <Route path="/mypage-creator" element={<MyCreatorPage />} />
        <Route path="/subscription-manage" element={<SubscriptionManage />} />
        <Route path="/user-main" element={<UserMainPage />} />
        <Route path="/creator-main/:creatorNickname" element={<CreatorMainPage />} />
        <Route path="/creators" element={<CreatorSearchPage />} />
        <Route path="/contents" element={<ContentSearchPage />} />
        <Route path="/search" element={<UnifiedSearchPage />} />
      </Route>

      <Route path="/login" element={<LoginSection />} />
      <Route path="/register" element={<MemberRegister />} />

      {/* 404 처리 */}
      <Route path="*" element={<div>404 - Page Not Found</div>} />
    </Routes>
  );
}
