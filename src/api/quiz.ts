import axiosInstance from "./axiosInstance";

// 퀴즈 유형 타입
export type QuizType = "multiple" | "ox" | "short";

// 퀴즈 생성 요청
export interface CreateQuizRequest {
  lecture_id: number;
  quizType: QuizType;
  quizNum: number;
  level: string;
}

// 퀴즈 생성 응답
export interface CreateQuizResponse {
  // API 응답이 빈 객체일 수 있음
  [key: string]: unknown;
}

// 퀴즈 생성 API
export const createQuizAPI = async (
  lectureId: number,
  quizType: QuizType,
  quizNum: number,
  level: string
): Promise<CreateQuizResponse> => {
  const requestData: CreateQuizRequest = {
    lecture_id: lectureId,
    quizType: quizType,
    quizNum: quizNum,
    level: level,
  };

  console.log("[퀴즈 생성 API] Request Body:", JSON.stringify(requestData, null, 2));
  console.log("[퀴즈 생성 API] 요청 파라미터:", {
    lectureId,
    quizType,
    quizNum,
    level,
  });

  const response = await axiosInstance.post<CreateQuizResponse>(
    "/quiz/create",
    requestData
  );
  return response.data;
};

