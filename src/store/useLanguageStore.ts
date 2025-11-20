import { create } from "zustand";

export type Language = "ko" | "en" | "zh";

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
}

export const useLanguage = create<LanguageState>((set) => ({
  language: "ko",
  setLanguage: (lang) => set({ language: lang }),
}));

// 언어별 텍스트 정의
export const translations = {
  ko: {
    intro: [
      "수업때 녹화한 강의 영상을 업로드 해보세요!",
      "1단계 : 학생들에게 제공할 문제 유형을 선택해보세요",
      "2단계 : 생성될 문제를 확인하고 수정해보세요",
      "3단계 : 마지막으로 생성된 코드를 학습자에게 전달해보세요!",
      "이제 LectureLen과 함께 질문을 생성하러 가볼까요?",
    ],
    title: "LectureLen",
  },
  en: {
    intro: [
      "Upload your recorded lecture videos from class!",
      "Step 1: Select the type of problem to provide to students",
      "Step 2: Check and modify the generated problems",
      "Step 3: Finally, deliver the generated code to learners!",
      "Shall we now generate questions with LectureLen?",
    ],
    title: "LectureLen",
  },
  zh: {
    intro: [
      "请上传您在课堂上录制的讲座视频！",
      "第1步：选择要提供给学生的问题类型",
      "第2步：检查并修改生成的问题",
      "第3步：最后，将生成的代码传递给学习者！",
      "现在让我们与LectureLen一起生成问题吧？",
    ],
    title: "LectureLen",
  },
};

