import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage, translations } from "../../../store/useLanguageStore";

const SignupForm = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const t = translations[language].signup;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (
      !name.trim() ||
      !email.trim() ||
      !password.trim() ||
      !confirmPassword.trim()
    ) {
      setError(t.errors.allFieldsRequired);
      return;
    }

    if (password !== confirmPassword) {
      setError(t.errors.passwordMismatch);
      return;
    }

    if (password.length < 8) {
      setError(t.errors.passwordTooShort);
      return;
    }

    setIsLoading(true);
    try {
      // TODO: 실제 회원가입 API 호출
      // await signup(name, email, password);

      // 임시로 성공 처리
      setTimeout(() => {
        setIsLoading(false);
        navigate("/login");
      }, 1000);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : t.errors.signupFailed;
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center bg-gray-50 w-full md:w-1/3 border-l border-gray-200">
      <div className="w-full max-w-sm px-8 py-12">
        <h2 className="text-gray-900 font-Pretendard font-semibold text-2xl md:text-3xl mb-10 text-center">
          {t.title}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="sr-only">
              {t.name}
            </label>
            <input
              id="name"
              type="text"
              placeholder={t.namePlaceholder}
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
              className="px-5 py-4 rounded-lg bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              required
              aria-required="true"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="sr-only">
              {t.email}
            </label>
            <input
              id="email"
              type="email"
              placeholder={t.emailPlaceholder}
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
              {t.password}
            </label>
            <input
              id="password"
              type="password"
              placeholder={t.passwordPlaceholder}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              className="px-5 py-4 rounded-lg bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              required
              aria-required="true"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="confirmPassword" className="sr-only">
              {t.confirmPassword}
            </label>
            <input
              id="confirmPassword"
              type="password"
              placeholder={t.confirmPasswordPlaceholder}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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

          <button
            type="submit"
            disabled={isLoading}
            className="bg-primary hover:bg-primary/90 text-white font-semibold px-6 py-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4 shadow-lg shadow-primary/20 hover:shadow-primary/30"
          >
            {isLoading ? t.signupLoading : t.signupButton}
          </button>

          <div className="text-center mt-4">
            <p className="text-gray-600 text-sm mb-2">{t.loginLink}</p>
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-primary hover:text-primary/80 font-medium transition-colors"
            >
              {t.loginButton}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupForm;
