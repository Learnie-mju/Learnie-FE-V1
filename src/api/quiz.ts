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
  sequence: number;
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
        sequence: quiz.sequence,
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

// 퀴즈 상세 항목 (문제) - 기본 API 응답 구조
export interface QuizDetailItem {
  quizId: number;
  lectureId: number;
  statement?: string; // OX 타입에서 사용
  question?: string; // 단답형/객관식에서 사용
  answer?: string;
  anwser?: string; // 서버 응답에서 오타로 올 수 있음
  questionType?: string;
  // 단답형/객관식 추가 필드
  quizNum?: number;
  level?: string;
  createAt?: string;
  sequence?: number;
  // 객관식의 경우 선택지가 있을 수 있음
  choices?: string[];
  options?: string[];
  correctAnswer?: number | string;
  // 객관식 개별 옵션 필드
  optionA?: string;
  optionB?: string;
  optionC?: string;
  optionD?: string;
  optionE?: string;
  correct?: string; // A, B, C, D, E 중 하나
  // 기타 필드 허용
  [key: string]: unknown;
}

// 퀴즈 타입별 응답 인터페이스
export interface OXQuizDetailItem extends QuizDetailItem {
  answer?: "O" | "X" | "o" | "x";
}

export interface ShortAnswerQuizDetailItem extends QuizDetailItem {
  answer?: string;
}

export interface MultipleChoiceQuizDetailItem extends QuizDetailItem {
  answer?: string;
  choices?: string[];
  options?: string[];
  correctAnswer?: number | string;
  // 객관식 개별 옵션 필드
  optionA?: string;
  optionB?: string;
  optionC?: string;
  optionD?: string;
  optionE?: string;
  correct?: string; // A, B, C, D, E 중 하나
}

// 퀴즈 상세 조회 API (POST 방식) - 타입별 분기 처리
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

  // 퀴즈 타입에 따라 다른 처리
  let response;
  try {
    response = await axiosInstance.post<QuizDetailItem>(
      `/quiz/detail`,
      requestData
    );

    console.log("[퀴즈 상세 조회 API] 전체 응답 객체:", response);
    console.log("[퀴즈 상세 조회 API] 응답 데이터 (response.data):", response.data);
    console.log("[퀴즈 상세 조회 API] 응답 데이터 JSON:", JSON.stringify(response.data, null, 2));
    
    // 응답 데이터의 모든 속성 출력
    console.log("[퀴즈 상세 조회 API] ===== 응답 데이터 상세 (타입:", quizType, ") =====");
    console.log("[퀴즈 상세 조회 API] quizId:", response.data.quizId);
    console.log("[퀴즈 상세 조회 API] lectureId:", response.data.lectureId);
    console.log("[퀴즈 상세 조회 API] statement:", response.data.statement);
    console.log("[퀴즈 상세 조회 API] question:", response.data.question);
    console.log("[퀴즈 상세 조회 API] answer:", response.data.answer);
    console.log("[퀴즈 상세 조회 API] anwser (오타):", response.data.anwser);
    console.log("[퀴즈 상세 조회 API] questionType:", response.data.questionType);
    
    // 타입별 추가 필드 출력
    if (quizType === "short") {
      console.log("[퀴즈 상세 조회 API] quizNum:", response.data.quizNum);
      console.log("[퀴즈 상세 조회 API] level:", response.data.level);
      console.log("[퀴즈 상세 조회 API] createAt:", response.data.createAt);
      console.log("[퀴즈 상세 조회 API] sequence:", response.data.sequence);
    }
    
    if (quizType === "multiple") {
      console.log("[퀴즈 상세 조회 API] optionA:", response.data.optionA);
      console.log("[퀴즈 상세 조회 API] optionB:", response.data.optionB);
      console.log("[퀴즈 상세 조회 API] optionC:", response.data.optionC);
      console.log("[퀴즈 상세 조회 API] optionD:", response.data.optionD);
      console.log("[퀴즈 상세 조회 API] optionE:", response.data.optionE);
      console.log("[퀴즈 상세 조회 API] correct:", response.data.correct);
      console.log("[퀴즈 상세 조회 API] choices:", response.data.choices);
      console.log("[퀴즈 상세 조회 API] options:", response.data.options);
      console.log("[퀴즈 상세 조회 API] correctAnswer:", response.data.correctAnswer);
    }
    
    console.log("[퀴즈 상세 조회 API] 전체 데이터 객체:", {
      quizId: response.data.quizId,
      lectureId: response.data.lectureId,
      statement: response.data.statement,
      question: response.data.question,
      answer: response.data.answer,
      anwser: response.data.anwser,
      questionType: response.data.questionType,
      quizNum: response.data.quizNum,
      level: response.data.level,
      createAt: response.data.createAt,
      sequence: response.data.sequence,
      choices: response.data.choices,
      options: response.data.options,
      correctAnswer: response.data.correctAnswer,
      optionA: response.data.optionA,
      optionB: response.data.optionB,
      optionC: response.data.optionC,
      optionD: response.data.optionD,
      optionE: response.data.optionE,
      correct: response.data.correct,
    });
    console.log("[퀴즈 상세 조회 API] 응답 데이터의 모든 키:", Object.keys(response.data));
    console.log("[퀴즈 상세 조회 API] ============================");

    return response.data;
  } catch (error: any) {
    console.error("[퀴즈 상세 조회 API] 에러 발생 (타입:", quizType, "):", error);
    console.error("[퀴즈 상세 조회 API] 에러 응답:", error?.response?.data);
    console.error("[퀴즈 상세 조회 API] 에러 상태:", error?.response?.status);
    throw error;
  }
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

