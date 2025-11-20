import { create } from "zustand";
import type { Language } from "./useLanguageStore";
import { signupAPI, loginAPI, logoutAPI } from "../api/auth";

interface Session {
  name: string;
  email: string;
  aiTutorToken: string;
  language?: Language;
}

interface AuthState {
  session: Session | null;
  status: "unauthenticated" | "loading" | "authenticated";
  error: string | null;

  signup: (
    userid: string,
    username: string,
    password: string,
    language: Language
  ) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  session: null,
  status: "unauthenticated",
  error: null,

  signup: async (
    userid: string,
    username: string,
    password: string,
    language: Language
  ) => {
    set({ status: "loading", error: null });

    try {
      // API 호출 (환경 변수 VITE_API_BASE_URL이 설정되어 있으면 실제 API 호출)
      if (import.meta.env.VITE_API_BASE_URL) {
        await signupAPI({ userid, username, password, language });
      }

      // 언어를 localStorage에 저장
      localStorage.setItem("userLanguage", language);

      // 성공 처리
      set({
        status: "unauthenticated",
        error: null,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "회원가입 실패";
      set({
        status: "unauthenticated",
        error: errorMessage,
      });
      throw err;
    }
  },

  login: async (email: string, password: string) => {
    set({ status: "loading", error: null });

    try {
      let loginData;

      // API 호출 (환경 변수 VITE_API_BASE_URL이 설정되어 있으면 실제 API 호출)
      if (import.meta.env.VITE_API_BASE_URL) {
        loginData = await loginAPI({ email, password });
      } else {
        // Mock 데이터 (개발 환경)
        const userLanguage = localStorage.getItem("userLanguage") || "ko";
        loginData = {
          name: "최원빈 교수님",
          email: email,
          aiTutorToken: "mock-ai-token-123",
          language: userLanguage as Language,
        };
      }

      // 토큰과 언어를 localStorage에 저장
      localStorage.setItem("aiTutorToken", loginData.aiTutorToken);
      localStorage.setItem("userLanguage", loginData.language);

      set({
        session: loginData,
        status: "authenticated",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "로그인 실패";
      set({
        status: "unauthenticated",
        error: errorMessage,
      });
    }
  },

  logout: async () => {
    try {
      // API 호출 (환경 변수 VITE_API_BASE_URL이 설정되어 있으면 실제 API 호출)
      if (import.meta.env.VITE_API_BASE_URL) {
        await logoutAPI();
      }
    } catch (err) {
      // 로그아웃 API 실패해도 클라이언트에서는 로그아웃 처리
      console.error("Logout API error:", err);
    } finally {
      // localStorage 정리
      localStorage.removeItem("aiTutorToken");
      localStorage.removeItem("userLanguage");

      set({
        session: null,
        status: "unauthenticated",
        error: null,
      });
    }
  },
}));
