import { useLanguage } from "../../store/useLanguageStore";
import LoginIntro from "./components/LoginIntro";
import LoginForm from "./components/LoginForm";

const LoginPage = () => {
  const { language } = useLanguage();

  // TODO: UI 작업 완료 후 활성화
  // const { status } = useAuth();
  // const navigate = useNavigate();

  // TODO: UI 작업 완료 후 활성화
  // 로그인된 상태면 홈으로 redirect
  // useEffect(() => {
  //   if (status === "authenticated") {
  //     navigate("/home", { replace: true });
  //   }
  // }, [status, navigate]);

  // 로그인된 상태면 아무것도 렌더링하지 않음
  // if (status === "authenticated") {
  //   return null;
  // }

  return (
    <div className="w-full h-screen bg-white flex flex-col md:flex-row overflow-hidden">
      <LoginIntro key={language} />
      <LoginForm />
    </div>
  );
};

export default LoginPage;
