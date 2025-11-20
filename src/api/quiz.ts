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

// 퀴즈 리스트 항목
export interface QuizListItem {
  quiz_id: number[];
  createdAt: string;
  quizNum: number;
  level: string;
  quizType: QuizType;
}

// 퀴즈 리스트 조회 API
export const getQuizListAPI = async (
  lectureId: number
): Promise<QuizListItem[]> => {
  console.log("[퀴즈 리스트 조회 API] 요청 파라미터:", { lectureId });
  console.log("[퀴즈 리스트 조회 API] 요청 URL:", `/quiz/list/${lectureId}`);

  const response = await axiosInstance.get<QuizListItem[]>(
    `/quiz/list/${lectureId}`
  );

  console.log("[퀴즈 리스트 조회 API] 전체 응답 객체:", response);
  console.log("[퀴즈 리스트 조회 API] 응답 데이터 (response.data):", response.data);
  console.log("[퀴즈 리스트 조회 API] 응답 데이터 JSON:", JSON.stringify(response.data, null, 2));
  console.log("[퀴즈 리스트 조회 API] 퀴즈 개수:", response.data?.length || 0);
  
  // 각 퀴즈 항목 상세 출력
  if (response.data && Array.isArray(response.data)) {
    response.data.forEach((quiz, index) => {
      console.log(`[퀴즈 리스트 조회 API] 퀴즈 #${index + 1}:`, {
        quiz_id: quiz.quiz_id,
        createdAt: quiz.createdAt,
        quizNum: quiz.quizNum,
        level: quiz.level,
        quizType: quiz.quizType,
      });
    });
  }

  return response.data;
};

// 퀴즈 상세 조회 요청
export interface QuizDetailRequest {
  quizType: QuizType;
  quizId: number;
}

// 퀴즈 상세 항목 (문제) - API 응답 구조
export interface QuizDetailItem {
  quizId: number;
  lectureId: number;
  statement: string;
  answer?: string;
  anwser?: string; // 서버 응답에서 오타로 올 수 있음
  questionType?: string;
}

// 퀴즈 상세 조회 API (POST 방식)
export const getQuizDetailAPI = async (
  quizType: QuizType,
  quizId: number
): Promise<QuizDetailItem> => {
  const requestData: QuizDetailRequest = {
    quizType: quizType,
    quizId: quizId,
  };

  console.log("[퀴즈 상세 조회 API] 요청 파라미터:", { quizType, quizId });
  console.log("[퀴즈 상세 조회 API] Request Body:", JSON.stringify(requestData, null, 2));
  console.log("[퀴즈 상세 조회 API] 요청 URL:", `/quiz/detail`);

  const response = await axiosInstance.post<QuizDetailItem>(
    `/quiz/detail`,
    requestData
  );

  console.log("[퀴즈 상세 조회 API] 전체 응답 객체:", response);
  console.log("[퀴즈 상세 조회 API] 응답 데이터 (response.data):", response.data);
  console.log("[퀴즈 상세 조회 API] 응답 데이터 JSON:", JSON.stringify(response.data, null, 2));
  console.log("[퀴즈 상세 조회 API] 문제:", {
    quizId: response.data.quizId,
    lectureId: response.data.lectureId,
    statement: response.data.statement,
    answer: response.data.answer,
    questionType: response.data.questionType,
  });

  return response.data;
};

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

  // 퀴즈 생성은 시간이 오래 걸릴 수 있으므로 타임아웃 제거
  const response = await axiosInstance.post<CreateQuizResponse>(
    "/quiz/create",
    requestData,
    {
      timeout: 0, // 타임아웃 없음
    }
  );
  return response.data;
};

