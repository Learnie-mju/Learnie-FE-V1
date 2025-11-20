import { useState } from "react";
import { useAuth } from "../store/useAuthStore";

const LoginCTA = () => {
  const { login, status, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submitLogin = async () => {
    await login(email, password);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <input
        type="email"
        placeholder="이메일"
        className="px-4 py-2 rounded bg-black-70 text-white"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="비밀번호"
        className="px-4 py-2 rounded bg-black-70 text-white"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={submitLogin}
        className="bg-primary px-6 py-3 rounded-lg font-semibold text-white"
      >
        {status === "loading" ? "로그인 중..." : "로그인"}
      </button>

      {error && <p className="text-red-400 text-sm">{error}</p>}
    </div>
  );
};

export default LoginCTA;
