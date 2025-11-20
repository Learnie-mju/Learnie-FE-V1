import axiosInstance from "./axiosInstance";
import type { Language } from "../store/useLanguageStore";

// 회원가입 API
export interface SignupRequest {
  userid: string;
  username: string;
  password: string;
  language: Language;
}

export interface SignupResponse {
  success: boolean;
  message?: string;
}

export const signupAPI = async (data: SignupRequest): Promise<SignupResponse> => {
  const response = await axiosInstance.post<SignupResponse>("/auth/signup", data);
  return response.data;
};

// 로그인 API
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  name: string;
  email: string;
  aiTutorToken: string;
  language: Language;
}

export const loginAPI = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await axiosInstance.post<LoginResponse>("/auth/login", data);
  return response.data;
};

// 로그아웃 API
export const logoutAPI = async (): Promise<void> => {
  await axiosInstance.post("/auth/logout");
};

