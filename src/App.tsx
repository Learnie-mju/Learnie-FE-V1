// src/App.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/login';
import SignupPage from './pages/signup';
import HomePage from './pages/home';
// Next의 (routes)/home/page.tsx 이런 구조를 그대로 import한다고 가정

function App() {
  return (
    <Routes>
      {/* 루트로 들어오면 /home으로 리다이렉트 */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* /home */}
      <Route path="/home" element={<HomePage />} />

      {/* /login */}
      <Route path="/login" element={<LoginPage />} />

      {/* /signup */}
      <Route path="/signup" element={<SignupPage />} />

      {/* notes 관련 (folderId는 동적 파라미터) */}
      {/* <Route path="/notes/:folderId/confirm" element={<ConfirmPage />} />
      <Route
        path="/notes/:folderId/create-practice"
        element={<CreatePracticePage />}
      />
      <Route path="/notes/:folderId/result/summary" element={<SummaryPage />} />



      {/* 혹시 없던 주소 들어왔을 때 기본적으로 home으로 보냄 */}
      {/* <Route path="*" element={<Navigate to="/home" replace />} /> */}
    </Routes>
  );
}

export default App;
