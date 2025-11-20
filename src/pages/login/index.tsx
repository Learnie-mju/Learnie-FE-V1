import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../store/useAuthStore";
import { useLanguage } from "../../store/useLanguageStore";
import LoginIntro from "./components/LoginIntro";
import LoginForm from "./components/LoginForm";

const LoginPage = () => {
  const { status } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();

  // 로그인된 상태면 홈으로 redirect
  useEffect(() => {
    if (status === "authenticated") {
      navigate("/home", { replace: true });
    }
  }, [status, navigate]);

  // 로그인된 상태면 아무것도 렌더링하지 않음
  if (status === "authenticated") {
    return null;
  }

  return (
    <div className="w-full h-screen bg-black-90 flex flex-col md:flex-row overflow-hidden">
      <LoginIntro key={language} />
      <LoginForm />
    </div>
  );
};

export default LoginPage;
