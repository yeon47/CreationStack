# 📁 프로젝트 폴더 구조 안내 (협업용)

본 프로젝트는 유지 보수성과 역할 분리를 고려하여 다음과 같은 폴더 구조를 사용합니다. 각 폴더는 특정한 책임을 가지며, 이에 대한 예시 코드도 함께 제공합니다.

## 📁 src/

프로젝트의 소스코드를 구성하는 최상위 폴더입니다.

### 📂 api/

> 서버 API 요청 관련 모듈을 작성합니다. Axios 인스턴스 및 fetch 요청 함수 등 포함.

**예시**

```js
import axios from "axios";

export const getUserInfo = async (userId) => {
  const response = await axios.get(`/api/users/${userId}`);
  return response.data;
};
```

---

### 📂 assets/

> 정적 파일(이미지, 폰트, svg 등)을 보관합니다.

**예시**

- 로고 파일 등 UI에 필요한 리소스를 이곳에 저장합니다.

---

### 📂 components/

> 공통 컴포넌트를 작성하는 곳입니다. 재사용 가능한 UI 구성요소들(Button, Modal 등).

**예시**

```jsx
export default function Button({ children, onClick }) {
  return <button onClick={onClick}>{children}</button>;
}
```

---

### 📂 layouts/

> 페이지 공통 레이아웃을 정의합니다 (Header, Footer 포함 구조 등).

**예시**

```jsx
export default function MainLayout({ children }) {
  return (
    <div>
      <header>Header</header>
      <main>{children}</main>
      <footer>Footer</footer>
    </div>
  );
}
```

---

### 📂 pages/

> 실제 라우팅되는 화면 페이지 컴포넌트입니다.

**예시**

```jsx
export default function Home() {
  return <div>Hello from Home</div>;
}
```

---

### 📂 routes/

> React Router로 페이지를 라우팅하는 설정이 들어갑니다.

**예시**

```jsx
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  );
}
```

---

### 📂 styles/

> 전역 스타일이나 공통 CSS, Tailwind 설정 등을 보관합니다.

**예시**

```css
body {
  margin: 0;
  font-family: sans-serif;
}
```

---

### 📂 utils/

> 유틸 함수, 공통 로직들을 모아두는 공간입니다.

**예시**

```js
export const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString();
};
```

---

### 📄 App.jsx

> 앱의 최상위 컴포넌트로, Routes를 포함한 기본 구조를 정의합니다.

---

### 📄 main.jsx

> 앱의 진입점(entry point)입니다. React DOM을 초기화하고 `App`을 렌더링합니다.

**예시**

```jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
```

---

### 📄 index.html

> 최종적으로 브라우저에 렌더링되는 HTML 문서입니다. 보통 `public` 폴더에 위치.

```html
<div id="root"></div>
<script type="module" src="/src/main.jsx"></script>
```

---
