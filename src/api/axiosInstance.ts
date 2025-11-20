import axios from "axios";

// API Base URL - 환경 변수에서 가져오거나 기본값 사용
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

// Axios 인스턴스 생성
export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터 - 토큰 추가 등
axiosInstance.interceptors.request.use(
  (config) => {
    // localStorage에서 토큰 가져와서 헤더에 추가
    const token = localStorage.getItem("aiTutorToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 - 에러 처리
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // 401 에러 시 로그아웃 처리 등
    if (error.response?.status === 401) {
      localStorage.removeItem("aiTutorToken");
      localStorage.removeItem("userLanguage");
      // 로그인 페이지로 리다이렉트는 컴포넌트에서 처리
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
