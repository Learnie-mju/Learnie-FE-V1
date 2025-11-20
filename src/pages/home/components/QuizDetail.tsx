import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useLanguage, translations } from "../../../store/useLanguageStore";
import Sidebar from "./Sidebar";

// 임시 퀴즈 상세 데이터
const mockQuizDetails = [
  {
    id: 1,
    problem: "다음 중 React의 주요 특징은 무엇인가요?",
    answer: "컴포넌트 기반 아키텍처",
    questionType: "객관식",
  },
  {
    id: 2,
    problem: "useState 훅의 역할은 무엇인가요?",
    answer: "함수형 컴포넌트에서 상태를 관리합니다",
    questionType: "주관식",
  },
];

const QuizDetail = () => {
  const { id: _id } = useParams<{ id: string }>(); // 라우팅에 필요
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = translations[language].home;
  
  const [selectedQuizzes, setSelectedQuizzes] = useState<number[]>([]);
  const [visibleAnswers, setVisibleAnswers] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState<"summary" | "quiz" | "plan">("quiz");

  const handleToggleQuiz = (quizId: number) => {
    setSelectedQuizzes((prev) =>
      prev.includes(quizId)
        ? prev.filter((id) => id !== quizId)
        : [...prev, quizId]
    );
  };

  const handleToggleAnswer = (quizId: number) => {
    setVisibleAnswers((prev) =>
      prev.includes(quizId)
        ? prev.filter((id) => id !== quizId)
        : [...prev, quizId]
    );
  };

  const handleGeneratePDF = () => {
    if (selectedQuizzes.length === 0) {
      alert("선택된 퀴즈가 없습니다.");
      return;
    }
    // TODO: PDF 생성 로직
    console.log("PDF 생성:", selectedQuizzes);
  };

  return (
    <div className="flex h-screen bg-white overflow-hidden relative">
      <Sidebar />
      
      {/* 메인 콘텐츠 */}
      <div className="flex-1 flex flex-col overflow-hidden bg-white relative">
        {/* 메인 콘텐츠 영역 */}
        <main className="flex-1 p-8 overflow-auto bg-white">
          <div className="flex gap-8 h-full">
            {/* 왼쪽: 스크립트 전문 */}
            <div className="flex-1 border-r border-gray-200 pr-8">
              <div className="flex items-center gap-4 mb-6">
                <button
                  onClick={() => navigate("/home")}
                  className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                >
                  <svg
                    className="w-5 h-5 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <h2 className="text-xl font-Pretendard font-semibold text-gray-900">
                  스크립트 전문
                </h2>
              </div>
              
              <div className="mb-4">
                <h3 className="text-lg font-Pretendard font-semibold text-gray-900 mb-2">
                  수업 제목
                </h3>
              </div>
              
              <div className="space-y-4 text-gray-700 font-Pretendard leading-relaxed">
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
                <p>
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
                <p>
                  Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                </p>
              </div>
            </div>

            {/* 오른쪽: 퀴즈 상세 */}
            <div className="flex-1 pl-8">
          {/* 탭 버튼들 */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setActiveTab("summary")}
              className={`px-6 py-3 rounded border text-base font-Pretendard transition-colors ${
                activeTab === "summary"
                  ? "border-primary text-primary bg-primary/5"
                  : "border-gray-300 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {t.content.summary}
            </button>
            <button
              onClick={() => setActiveTab("quiz")}
              className={`px-6 py-3 rounded border text-base font-Pretendard transition-colors ${
                activeTab === "quiz"
                  ? "border-primary text-primary bg-primary/5"
                  : "border-gray-300 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {t.content.quiz}
            </button>
            <button
              onClick={() => setActiveTab("plan")}
              className={`px-6 py-3 rounded border text-base font-Pretendard transition-colors ${
                activeTab === "plan"
                  ? "border-primary text-primary bg-primary/5"
                  : "border-gray-300 text-gray-600 hover:bg-gray-50"
              }`}
            >
              계획
            </button>
          </div>

          {/* 탭 컨텐츠 */}
          {activeTab === "summary" && (
            <div>
              <h2 className="text-xl font-Pretendard font-semibold text-gray-900 mb-4">
                {t.content.summary}
              </h2>
              <div className="text-gray-700 font-Pretendard leading-relaxed">
                <p>{t.content.summaryContent}</p>
                <p className="mt-4">
                  강의의 주요 내용을 요약한 내용이 여기에 표시됩니다. 핵심 개념과 중요한 포인트를 빠르게 파악할 수 있습니다.
                </p>
              </div>
            </div>
          )}

          {activeTab === "quiz" && (
            <div>
              {/* 퀴즈 생성 완료 제목 */}
              <h2 className="text-2xl font-Pretendard font-semibold text-gray-900 mb-6">
                {t.content.quizGenerationComplete}
              </h2>

              {/* 퀴즈 목록 테이블 */}
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-6">
                <table className="w-full border-collapse">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-Pretendard font-semibold text-gray-700 uppercase w-16 border-b border-gray-200">
                        {t.content.select}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-Pretendard font-semibold text-gray-700 uppercase border-b border-gray-200">
                        {t.content.problem}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-Pretendard font-semibold text-gray-700 uppercase border-b border-gray-200">
                        {t.content.answer}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-Pretendard font-semibold text-gray-700 uppercase border-b border-gray-200">
                        {t.content.questionType}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockQuizDetails.map((quiz, index) => (
                      <tr 
                        key={quiz.id} 
                        className={`hover:bg-gray-50 ${
                          index !== mockQuizDetails.length - 1 ? "border-b border-gray-200" : ""
                        }`}
                      >
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={selectedQuizzes.includes(quiz.id)}
                            onChange={() => handleToggleQuiz(quiz.id)}
                            className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                          />
                        </td>
                        <td className="px-4 py-3 text-sm font-Pretendard text-gray-900">
                          {quiz.problem}
                        </td>
                        <td className="px-4 py-3">
                          {visibleAnswers.includes(quiz.id) ? (
                            <div className="flex flex-col gap-2">
                              <div className="text-sm font-Pretendard text-gray-700">
                                {quiz.answer}
                              </div>
                              <button
                                onClick={() => handleToggleAnswer(quiz.id)}
                                className="text-xs text-gray-500 hover:text-gray-700 font-Pretendard self-start"
                              >
                                {t.content.hideAnswer}
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleToggleAnswer(quiz.id)}
                              className="px-3 py-1.5 text-sm font-Pretendard text-primary border border-primary rounded hover:bg-primary/5 transition-colors"
                            >
                              {t.content.showAnswer}
                            </button>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm font-Pretendard text-gray-700">
                          {quiz.questionType}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* PDF 생성 버튼 */}
              <div className="flex justify-end">
                <button
                  onClick={handleGeneratePDF}
                  className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-Pretendard font-semibold"
                >
                  {t.content.generatePDF}
                </button>
              </div>
            </div>
          )}

          {activeTab === "plan" && (
            <div>
              <h2 className="text-xl font-Pretendard font-semibold text-gray-900 mb-4">
                계획
              </h2>
              <div className="text-gray-700 font-Pretendard leading-relaxed">
                <p>학습 계획이 여기에 표시됩니다.</p>
              </div>
            </div>
          )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default QuizDetail;

