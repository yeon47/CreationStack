import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import MainLayout from '../layouts/mainLayout';
import PaymentMethodManagementPage from '../pages/Payment/PaymentMethodManagementPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/payments" element={<PaymentMethodManagementPage />} />
      </Route>

      {/* 로그인/회원가입 같이 레이아웃 제외할 페이지는 별도 Route로 */}
      {/* <Route path="/login" element={<Login />} /> */}
    </Routes>
  );
}
