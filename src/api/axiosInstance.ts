import axios from "axios";

// API Base URL - 환경 변수에서 가져오거나 기본값 사용
// 로컬 개발: HTTP 사용 (http://api.learnie-orbit.cloud)
// 프로덕션: Vercel 환경 변수에 VITE_API_BASE_URL=https://api.learnie-orbit.cloud 설정
const getDefaultApiUrl = () => {
  // 개발 환경에서는 HTTP 사용
  if (import.meta.env.DEV) {
    return "http://api.learnie-orbit.cloud";
  }
  // 프로덕션 환경에서는 HTTPS 사용
  return "https://api.learnie-orbit.cloud";
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || getDefaultApiUrl();

// 디버깅용 (프로덕션에서도 확인 가능)
if (import.meta.env.PROD) {
  console.log("API_BASE_URL:", API_BASE_URL);
  console.log("VITE_API_BASE_URL env:", import.meta.env.VITE_API_BASE_URL);
}

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

    // FormData인 경우 Content-Type 헤더를 제거하여 axios가 자동으로 boundary 포함하여 설정하도록 함
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
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
      localStorage.removeItem("userInfo");
      // 로그인 페이지로 리다이렉트는 컴포넌트에서 처리
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
