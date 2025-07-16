import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";

import ContentFormPage from "../pages/ContentForm/ContentFormPage";
import { MyCreatorPage } from "../pages/MyCreatorPage/MyCreatorPage";
import { SubscriptionManage } from "../pages/ManageSubscriptionPage/SubscriptionManage";

import MainLayout from "../layouts/mainLayout";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />

        <Route path="/content-form" element={<ContentFormPage />} />
        <Route path="/mypage-creator" element={<MyCreatorPage />} />
        <Route path="/subscription-manage" element={<SubscriptionManage />} />

      </Route>

      {/* 로그인/회원가입 같이 레이아웃 제외할 페이지는 별도 Route로 */}
      {/* <Route path="/login" element={<Login />} /> */}

    </Routes>
  );
}
