import { create } from "zustand";
import toast from "react-hot-toast";
import type { Language } from "./useLanguageStore";
import { useLanguage } from "./useLanguageStore";
import { signupAPI, loginAPI, logoutAPI } from "../api/auth";

interface UserInfo {
  id?: number;
  userId: string;
  username: string;
  language: Language;
}

interface AuthState {
  user: UserInfo | null;
  status: "unauthenticated" | "loading" | "authenticated";
  error: string | null;

  signup: (
    userid: string,
    username: string,
    password: string,
    language: Language
  ) => Promise<void>;
  login: (userid: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
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
      // API 호출 - 언어는 대문자로 그대로 전송 (KR, EN, JP 등)
      const signupResponse = await signupAPI({
        user_id: userid,
        username: username,
        password: password,
        language: language, // 대문자로 그대로 전송
      });

      // 백엔드에서 받은 language가 있으면 사용, 없으면 회원가입 시 선택한 언어 사용
      const languageMapReverse: Record<string, Language> = {
        ko: "KR",
        en: "EN",
        zh: "CN",
        ja: "JP",
        vi: "VI",
        KR: "KR",
        EN: "EN",
        CN: "CN",
        JP: "JP",
        VI: "VI",
      };

      const finalLanguage = signupResponse.language
        ? languageMapReverse[signupResponse.language] || language
        : language;

      // 언어를 localStorage에 저장
      localStorage.setItem("userLanguage", finalLanguage);

      // 언어 스토어도 업데이트
      useLanguage.getState().setLanguage(finalLanguage);

      // 성공 처리
      set({
        status: "unauthenticated",
        error: null,
      });

      // 성공 토스트 표시
      toast.success("회원가입이 완료되었습니다!");
    } catch (err) {
      // API 에러 메시지 추출
      let errorMessage = "회원가입에 실패했습니다. 다시 시도해주세요.";

      if (err && typeof err === "object" && "response" in err) {
        const axiosError = err as {
          response?: { data?: { message?: string } };
          message?: string;
        };
        errorMessage =
          axiosError.response?.data?.message ||
          axiosError.message ||
          errorMessage;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      set({
        status: "unauthenticated",
        error: errorMessage,
      });
      throw new Error(errorMessage);
    }
  },

  login: async (userid: string, password: string) => {
    set({ status: "loading", error: null });

    try {
      // API 호출
      const loginResponse = await loginAPI({
        user_id: userid,
        password: password,
      });

      // 언어 추출 - 백엔드에서 받은 language를 우선 사용
      // 백엔드는 대문자(JP, KR, EN 등)로 보냄
      const languageMap: Record<string, Language> = {
        ko: "KR",
        en: "EN",
        zh: "CN",
        ja: "JP",
        vi: "VI",
        KR: "KR",
        EN: "EN",
        CN: "CN",
        JP: "JP",
        VI: "VI",
      };

      // 백엔드 응답의 language를 파싱
      let userLanguage: Language = "KR"; // 기본값

      if (loginResponse.language) {
        const backendLangStr = String(loginResponse.language).trim();
        const upperLang = backendLangStr.toUpperCase();

        // 대문자로 변환해서 매칭 시도 (JP, KR 등)
        if (languageMap[upperLang]) {
          userLanguage = languageMap[upperLang];
        }
        // 소문자로 변환해서 매칭 시도 (ja, ko 등)
        else if (languageMap[backendLangStr.toLowerCase()]) {
          userLanguage = languageMap[backendLangStr.toLowerCase()];
        }
        // 직접 Language 타입인지 확인 (KR, EN, JP, CN, VI)
        else if (["KR", "CN", "EN", "JP", "VI"].includes(upperLang)) {
          userLanguage = upperLang as Language;
        }

        // 디버깅용 로그 (개발 환경에서만)
        if (import.meta.env.DEV) {
          console.log("=== 로그인 언어 파싱 ===");
          console.log("백엔드 응답:", loginResponse);
          console.log("백엔드 language:", loginResponse.language);
          console.log("변환된 language:", userLanguage);
        }
      } else {
        if (import.meta.env.DEV) {
          console.warn(
            "백엔드 응답에 language 필드가 없습니다. 기본값 KR 사용"
          );
        }
      }

      // 사용자 정보 구성 (스웨거 API 문서 구조에 맞춤)
      const userData: UserInfo = {
        id: loginResponse.id,
        userId: loginResponse.userId || userid,
        username: loginResponse.username || userid,
        language: userLanguage,
      };

      // 언어를 localStorage에 저장하고 언어 스토어도 즉시 업데이트
      localStorage.setItem("userLanguage", userLanguage);
      useLanguage.getState().setLanguage(userLanguage);

      // 디버깅용 로그
      if (import.meta.env.DEV) {
        console.log("로그인 완료 - 설정된 언어:", userLanguage);
        console.log(
          "localStorage userLanguage:",
          localStorage.getItem("userLanguage")
        );
        console.log("언어 스토어 현재 값:", useLanguage.getState().language);
      }

      set({
        user: userData,
        status: "authenticated",
        error: null,
      });

      // 성공 토스트 표시
      toast.success("로그인에 성공했습니다!");
    } catch (err) {
      // API 에러 메시지 추출
      let errorMessage = "로그인에 실패했습니다. 다시 시도해주세요.";

      if (err && typeof err === "object" && "response" in err) {
        const axiosError = err as {
          response?: { data?: { message?: string } };
          message?: string;
        };
        errorMessage =
          axiosError.response?.data?.message ||
          axiosError.message ||
          errorMessage;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

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
        user: null,
        status: "unauthenticated",
        error: null,
      });

      // 로그아웃 토스트 표시
      toast.success("로그아웃되었습니다.");
    }
  },
}));
