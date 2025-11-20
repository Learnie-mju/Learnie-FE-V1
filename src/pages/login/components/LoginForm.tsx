import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../store/useAuthStore";

const LoginForm = () => {
  const { login, status, error } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      return;
    }
    await login(email, password);
  };

  const isLoading = status === "loading";

  return (
    <div className="flex flex-col justify-center items-center bg-gray-50 w-full md:w-1/3 border-l border-gray-200">
      <div className="w-full max-w-sm px-8 py-12">
        <h2 className="text-gray-900 font-Pretendard font-semibold text-2xl md:text-3xl mb-10 text-center">
          LectureLens 시작하기
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="sr-only">
              이메일
            </label>
            <input
              id="email"
              type="email"
              placeholder="이메일을 입력하세요"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className="px-5 py-4 rounded-lg bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              required
              aria-required="true"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="sr-only">
              비밀번호
            </label>
            <input
              id="password"
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              className="px-5 py-4 rounded-lg bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              required
              aria-required="true"
            />
          </div>

          {error && (
            <div
              className="text-red-600 text-sm text-center py-2 px-4 bg-red-50 rounded-lg border border-red-200"
              role="alert"
              aria-live="polite"
            >
              {error}
            </div>
          )}

          <div className="flex gap-3 mt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-primary hover:bg-primary/90 text-white font-semibold px-6 py-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20 hover:shadow-primary/30"
            >
              {isLoading ? "로그인 중..." : "로그인"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/signup")}
              disabled={isLoading}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-6 py-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              회원가입
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
