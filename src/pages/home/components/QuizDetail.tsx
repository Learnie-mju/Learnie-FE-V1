import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useLanguage, translations } from "../../../store/useLanguageStore";
import {
  getQuizDetailAPI,
  type QuizDetailItem,
  type QuizType,
} from "../../../api/quiz";
import { type LectureUploadResponse } from "../../../api/lecture";
import Sidebar from "./Sidebar";
import toast from "react-hot-toast";

const QuizDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { language } = useLanguage();
  const t = translations[language].home;

  // location.state에서 전달된 데이터 가져오기
  const quizIds = location.state?.quizIds as number[] | undefined;
  const quizType = location.state?.quizType as QuizType | undefined;
  const lectureData = location.state?.lectureData as
    | LectureUploadResponse
    | undefined;

  const [quizDetails, setQuizDetails] = useState<QuizDetailItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedQuizzes, setSelectedQuizzes] = useState<number[]>([]);
  const [visibleAnswers, setVisibleAnswers] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState<"summary" | "quiz" | "review">(
    "quiz"
  );

  // 퀴즈 상세 조회 - 각 quiz_id로 API 호출 (quiz 탭일 때만)
  useEffect(() => {
    const fetchQuizDetails = async () => {
      // quiz 탭이 아닐 때는 요청하지 않음
      if (activeTab !== "quiz") {
        return;
      }

      if (!quizIds || !Array.isArray(quizIds) || quizIds.length === 0) {
        toast.error("퀴즈 ID가 없습니다.");
        navigate("/home");
        return;
      }

      if (!quizType) {
        toast.error("퀴즈 유형이 없습니다.");
        navigate("/home");
        return;
      }

      setIsLoading(true);
      try {
        console.log("[QuizDetail] 퀴즈 상세 조회 시작:", {
          quizIds,
          quizType,
        });

        // 각 quiz_id로 API 호출
        const detailsPromises = quizIds.map((quizId) =>
          getQuizDetailAPI(quizType, quizId)
        );

        const details = await Promise.all(detailsPromises);
        console.log("[QuizDetail] 받은 퀴즈 상세 데이터:", details);
        console.log("[QuizDetail] 퀴즈 상세 데이터 타입:", typeof details);
        console.log(
          "[QuizDetail] 퀴즈 상세 데이터 배열 여부:",
          Array.isArray(details)
        );
        console.log("[QuizDetail] 퀴즈 상세 데이터 길이:", details.length);

        // 각 퀴즈 항목 상세 로그
        details.forEach((detail, idx) => {
          console.log(`[QuizDetail] 퀴즈 #${idx + 1}:`, {
            quizId: detail?.quizId,
            lectureId: detail?.lectureId,
            statement: detail?.statement,
            answer: detail?.answer,
            questionType: detail?.questionType,
            전체데이터: detail,
          });
        });

        setQuizDetails(details);
      } catch (error) {
        console.error("[QuizDetail] 퀴즈 상세 조회 실패:", error);
        toast.error("퀴즈 상세 정보를 불러오는데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuizDetails();
  }, [quizIds, quizType, navigate, activeTab]);

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

  return (
    <div className="flex h-screen bg-white overflow-hidden relative">
      <Sidebar />

      {/* 메인 콘텐츠 */}
      <div className="flex-1 flex flex-col overflow-hidden bg-white relative">
        {/* 메인 콘텐츠 영역 */}
        <main className="flex-1 p-8 overflow-auto bg-white">
          <div className="flex gap-8 h-full">
            {/* 왼쪽: Translation */}
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
                  Translation
                </h2>
              </div>

              <div className="mb-4">
                <h3 className="text-lg font-Pretendard font-semibold text-gray-900 mb-2">
                  {lectureData?.title || "수업 제목"}
                </h3>
              </div>

              <div className="space-y-4 text-gray-700 font-Pretendard leading-relaxed whitespace-pre-wrap">
                {lectureData?.content ? (
                  <div className="leading-relaxed">{lectureData.content}</div>
                ) : (
                  <>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua.
                    </p>
                    <p>
                      Ut enim ad minim veniam, quis nostrud exercitation ullamco
                      laboris nisi ut aliquip ex ea commodo consequat.
                    </p>
                    <p>
                      Duis aute irure dolor in reprehenderit in voluptate velit
                      esse cillum dolore eu fugiat nulla pariatur.
                    </p>
                  </>
                )}
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
                  onClick={() => setActiveTab("review")}
                  className={`px-6 py-3 rounded border text-base font-Pretendard transition-colors ${
                    activeTab === "review"
                      ? "border-primary text-primary bg-primary/5"
                      : "border-gray-300 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {t.content.advanced}
                </button>
              </div>

              {/* 탭 컨텐츠 */}
              {activeTab === "summary" && (
                <div>
                  <h2 className="text-xl font-Pretendard font-semibold text-gray-900 mb-4">
                    {t.content.summary}
                  </h2>
                  <div className="text-gray-700 font-Pretendard leading-relaxed whitespace-pre-wrap">
                    {lectureData?.summary ? (
                      <div className="leading-relaxed">
                        {lectureData.summary}
                      </div>
                    ) : (
                      <>
                        <p>{t.content.summaryContent}</p>
                        <p className="mt-4">
                          강의의 주요 내용을 요약한 내용이 여기에 표시됩니다.
                          핵심 개념과 중요한 포인트를 빠르게 파악할 수 있습니다.
                        </p>
                      </>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "quiz" && (
                <div>
                  {/* 퀴즈 생성 완료 제목 */}
                  <h2 className="text-2xl font-Pretendard font-semibold text-gray-900 mb-6">
                    {t.content.quizGenerationComplete}
                  </h2>

                  {/* 로딩 상태 */}
                  {isLoading ? (
                    <div className="p-8 text-center text-gray-500 font-Pretendard">
                      퀴즈를 불러오는 중...
                    </div>
                  ) : quizDetails.length === 0 ? (
                    <div className="p-8 text-center text-gray-500 font-Pretendard">
                      퀴즈 문제가 없습니다.
                    </div>
                  ) : (
                    /* 퀴즈 목록 테이블 */
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
                          {quizDetails.map((quiz, index) => {
                            const quizId = quiz?.quizId || index;
                            const problem = quiz?.statement || "";
                            // answer 속성을 명시적으로 확인 (서버 응답 구조에 맞춤, anwser 오타도 처리)
                            const answer = quiz?.answer || quiz?.anwser || "";
                            const questionType =
                              quiz?.questionType || quizType || "";

                            return (
                              <tr
                                key={quizId}
                                className={`hover:bg-gray-50 ${
                                  index !== quizDetails.length - 1
                                    ? "border-b border-gray-200"
                                    : ""
                                }`}
                              >
                                <td className="px-4 py-3">
                                  <input
                                    type="checkbox"
                                    checked={selectedQuizzes.includes(quizId)}
                                    onChange={() => handleToggleQuiz(quizId)}
                                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                                  />
                                </td>
                                <td className="px-4 py-3 text-sm font-Pretendard text-gray-900">
                                  {problem || "-"}
                                </td>
                                <td className="px-4 py-3">
                                  {visibleAnswers.includes(quizId) ? (
                                    <div className="flex flex-col gap-2">
                                      <div
                                        className={`text-sm font-Pretendard font-semibold ${
                                          answer === "O" || answer === "o"
                                            ? "text-green-600"
                                            : answer === "X" || answer === "x"
                                            ? "text-red-600"
                                            : "text-gray-700"
                                        }`}
                                      >
                                        {answer || "-"}
                                      </div>
                                      <button
                                        onClick={() =>
                                          handleToggleAnswer(quizId)
                                        }
                                        className="text-xs text-gray-500 hover:text-gray-700 font-Pretendard self-start"
                                      >
                                        {t.content.hideAnswer}
                                      </button>
                                    </div>
                                  ) : (
                                    <button
                                      onClick={() => handleToggleAnswer(quizId)}
                                      className="px-3 py-1.5 text-sm font-Pretendard text-primary border border-primary rounded hover:bg-primary/5 transition-colors"
                                    >
                                      {t.content.showAnswer}
                                    </button>
                                  )}
                                </td>
                                <td className="px-4 py-3 text-sm font-Pretendard text-gray-700">
                                  {questionType || "-"}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "review" && (
                <div>
                  <h2 className="text-xl font-Pretendard font-semibold text-gray-900 mb-4">
                    {t.content.advanced}
                  </h2>
                  <div className="text-gray-700 font-Pretendard leading-relaxed whitespace-pre-wrap">
                    {lectureData ? (
                      <div className="leading-relaxed">
                        <p className="text-gray-500 italic">
                          {t.content.review.createInDetailPage}
                        </p>
                      </div>
                    ) : (
                      <p>{t.content.advancedContent}</p>
                    )}
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
