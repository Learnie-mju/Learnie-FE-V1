import { create } from "zustand";
import type { Language } from "./useLanguageStore";

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
    _userid: string,
    _username: string,
    _password: string,
    language: Language
  ) => {
    set({ status: "loading", error: null });

    try {
      // 🔥 실제 백엔드가 주는 signup API를 여기에 매핑
      // const res = await axios.post("/auth/signup", { userid: _userid, username: _username, password: _password, language });

      // 🧪 Mock 데이터 (백엔드가 있다고 가정)
      // 언어를 localStorage에 저장
      localStorage.setItem("userLanguage", language);

      // 임시로 성공 처리
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
      // 🔥 실제 백엔드가 주는 login API를 여기에 매핑
      // const res = await axios.post("/auth/login", { email, password });
      // const userLanguage = res.data.language || "ko";

      // 🧪 Mock 데이터 (백엔드가 있다고 가정)
      // localStorage에서 사용자 언어 불러오기 (실제로는 서버에서 받아옴)
      // password는 실제 API 호출 시 사용됩니다
      void password;
      const userLanguage = localStorage.getItem("userLanguage") || "ko";

      const res = {
        data: {
          name: "최원빈 교수님",
          email: email,
          aiTutorToken: "mock-ai-token-123",
          language: userLanguage as Language,
        },
      };

      // 사용자 언어를 localStorage에 저장하고 언어 스토어 업데이트
      localStorage.setItem("userLanguage", userLanguage);

      set({
        session: res.data,
        status: "authenticated",
      });
    } catch {
      set({
        status: "unauthenticated",
        error: "로그인 실패",
      });
    }
  },

  logout: () => {
    set({
      session: null,
      status: "unauthenticated",
      error: null,
    });
  },
}));
