import { Routes, Route } from 'react-router-dom';

import { LoginSection } from '../pages/Login/LoginSection';
import { MemberRegister } from '../pages/Register/MemberRegister';
import AuthCallback from '../pages/Register/KakaoRegisterCallback';

import { ProfileEdit } from '../pages/ProfileSettings/ProfileEdit';

import PaymentMethodManagementPage from '../pages/Payment/PaymentMethodManagementPage';
import PaymentPage from '../pages/Payment/PaymentPage';
import PaymentSuccessPage from '../pages/Payment/PaymentSuccessPage';
import ContentFormPage from '../pages/ContentForm/ContentFormPage';
import { MyCreatorPage } from '../pages/MyPage/MyCreatorPage';
import { MyUserPage } from '../pages/MyPage/MyUserPage';
import { SubscriptionManage } from '../pages/ManageSubscriptionPage/SubscriptionManage';
import { UserMainPage } from '../pages/MainPage/UserMainPage/UserMainPage';
import MainLayout from '../layouts/mainLayout';
import ReplyTestPage from '../pages/ContentDetail/ReplyTestPage';
import FavoriteContent from '../pages/FavoriteContent/FavoriteContentPage';
import { CreatorMainPage } from '../pages/MainPage/CreatorMainPage/CreatorMainPage';
import CreatorManagementPage from '../pages/CreatorManagement/CreatorManagementPage';
import CreatorNoticePage from '../pages/CreatorNoticePage/CreatorNoticePage';

import { CreatorSearchPage } from '../pages/CreatorSearchPage/CreatorSearchPage';
import { ContentSearchPage } from '../pages/ContentSearchPage/ContentSearchPage';
import { UnifiedSearchPage } from '../pages/UnifiedSearchPage/UnifiedSearchPage';

import { ContentDetailPage } from '../pages/ContentDetail/ContentDetailPage';
import { Home } from '../pages/Home/Home';

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* 홈 경로 */}
        <Route path="/" element={<Home />} />
        <Route path="/payments" element={<PaymentMethodManagementPage />} />
        <Route path="/payments/summary" element={<PaymentPage />} />
        <Route path="/payments/success" element={<PaymentSuccessPage />} />
        <Route path="/reply-test" element={<ReplyTestPage />} />
        <Route path="/favorites" element={<FavoriteContent />} />
        <Route path="/creator-management" element={<CreatorManagementPage />} />
        <Route path="/content-form" element={<ContentFormPage />} />
        <Route path="/mypage-creator" element={<MyCreatorPage />} /> {/* 크리에이터 마이페이지 */}
        <Route path="/mypage-user" element={<MyUserPage />} /> {/* 사용자 마이페이지 */}
        <Route path="/subscription-manage" element={<SubscriptionManage />} />
        <Route path="/user-main" element={<UserMainPage />} />
        <Route path="/creator-main/:creatorNickname" element={<CreatorMainPage />} />
        <Route path="/creators" element={<CreatorSearchPage />} />
        <Route path="/contents" element={<ContentSearchPage />} />
        <Route path="/search" element={<UnifiedSearchPage />} />
        <Route path="/contents/:contentId" element={<ContentDetailPage />} />
        <Route path="/payments/summary/:creatorNickname" element={<PaymentPage />} />
        <Route path="/profile/edit" element={<ProfileEdit />} />
        <Route path="/creator/notice/:nickname" element={<CreatorNoticePage />} />
      </Route>

      <Route path="/login" element={<LoginSection />} />
      <Route path="/register" element={<MemberRegister />} />
      <Route path="/auth/callback" element={<AuthCallback />} />

      {/* 404 처리 */}
      <Route path="*" element={<div>404 - Page Not Found</div>} />
    </Routes>
  );
}
