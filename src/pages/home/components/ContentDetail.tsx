import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLanguage, translations } from "../../../store/useLanguageStore";
import { useAuth } from "../../../store/useAuthStore";
import QuizSkeleton from "./QuizSkeleton";
import Sidebar from "./Sidebar";
import UserMenu from "./UserMenu";

const LANGUAGE_OPTIONS = [
  { code: "KR" as const, label: "한국어" },
  { code: "CN" as const, label: "中文" },
  { code: "EN" as const, label: "English" },
  { code: "JP" as const, label: "日本語" },
  { code: "VI" as const, label: "Tiếng Việt" },
] as const;

// 임시 퀴즈 데이터
const mockQuizzes = [
  {
    id: 1,
    number: 1,
    questionCount: 10,
    difficulty: "중급",
    createdAt: "2024-01-15",
  },
  {
    id: 2,
    number: 2,
    questionCount: 15,
    difficulty: "고급",
    createdAt: "2024-01-16",
  },
];

const ContentDetail = () => {
  const { contentId } = useParams<{ contentId: string }>();
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();
  const { user } = useAuth();
  const t = translations[language].home;

  // 로그인된 경우 사용자 정보의 언어를 우선 사용
  useEffect(() => {
    if (user?.language) {
      setLanguage(user.language);
    }
  }, [user, setLanguage]);

  const [activeTab, setActiveTab] = useState<"summary" | "quiz" | "advanced">(
    "summary"
  );

  // 퀴즈 생성 설정 상태
  const [showQuizCreateForm, setShowQuizCreateForm] = useState(false);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [difficulty, setDifficulty] = useState<
    "high" | "medium" | "low" | null
  >(null);
  const [questionType, setQuestionType] = useState<
    "shortAnswer" | "trueFalse" | "multipleChoice" | null
  >(null);

  // 계획 생성 설정 상태
  const [showPlanCreateForm, setShowPlanCreateForm] = useState(false);
  const [goalDays, setGoalDays] = useState<number>(1);
  const [dailyHours, setDailyHours] = useState<number>(1);

  return (
    <div className="flex h-screen bg-white overflow-hidden relative">
      <Sidebar />

      {/* 메인 콘텐츠 */}
      <div className="flex-1 flex flex-col overflow-hidden bg-white relative">
        {/* 헤더 */}
        <header className="bg-white px-8 py-4 flex items-center justify-between border-b border-gray-200">
          {/* 뒤로가기 버튼 */}
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

          <div className="flex items-center gap-4">
            {/* 언어 선택 버튼 */}
            <div className="flex gap-2">
              {LANGUAGE_OPTIONS.map((option) => (
                <button
                  key={option.code}
                  onClick={() => setLanguage(option.code)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    language === option.code
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            
            {/* 마이페이지 메뉴 */}
            <UserMenu />
          </div>
        </header>

        {/* 메인 콘텐츠 영역 */}
        <main className="flex-1 p-8 overflow-auto bg-white">
          <div className="flex gap-8 h-full">
            {/* 왼쪽: 번역본 섹션 */}
            <div className="flex-1 border-r border-gray-200 pr-8">
              <h2 className="text-xl font-Pretendard font-semibold text-gray-900 mb-6">
                {t.content.translation}
              </h2>
              <div className="space-y-4 text-gray-700 font-Pretendard">
                <p className="leading-relaxed">
                  강의 녹음본의 번역본이 여기에 표시됩니다. 원본 강의 내용을
                  모국어로 번역한 텍스트를 확인할 수 있습니다.
                </p>
                <p className="leading-relaxed">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
                <p className="leading-relaxed">
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat.
                </p>
              </div>
            </div>

            {/* 오른쪽: 탭 컨텐츠 섹션 */}
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
                  onClick={() => setActiveTab("advanced")}
                  className={`px-6 py-3 rounded border text-base font-Pretendard transition-colors ${
                    activeTab === "advanced"
                      ? "border-primary text-primary bg-primary/5"
                      : "border-gray-300 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {t.content.advanced}
                </button>
              </div>

              {/* 탭 컨텐츠 */}
              <div className="mt-6">
                {activeTab === "summary" && (
                  <div>
                    <h2 className="text-xl font-Pretendard font-semibold text-gray-900 mb-4">
                      {t.content.summary}
                    </h2>
                    <div className="text-gray-700 font-Pretendard leading-relaxed">
                      <p>{t.content.summaryContent}</p>
                      <p className="mt-4">
                        강의의 주요 내용을 요약한 내용이 여기에 표시됩니다. 핵심
                        개념과 중요한 포인트를 빠르게 파악할 수 있습니다.
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === "quiz" && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-Pretendard font-semibold text-gray-900">
                        {t.content.quiz}
                      </h2>
                      <button
                        onClick={() =>
                          setShowQuizCreateForm(!showQuizCreateForm)
                        }
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-Pretendard text-sm"
                      >
                        {t.content.createQuiz}
                      </button>
                    </div>

                    {/* 퀴즈 생성 설정 폼 */}
                    {showQuizCreateForm && (
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
                        <h3 className="text-lg font-Pretendard font-semibold text-gray-900 mb-4">
                          {t.content.quiz}
                        </h3>

                        {/* 문제 개수 */}
                        <div className="mb-4">
                          <label className="block text-sm font-Pretendard text-gray-700 mb-2">
                            {t.content.questionCount}
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              min="1"
                              max="10"
                              value={questionCount}
                              onChange={(e) =>
                                setQuestionCount(Number(e.target.value))
                              }
                              className="px-3 py-2 border border-gray-300 rounded text-sm font-Pretendard w-20 focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                            <span className="text-sm text-gray-600">
                              {t.content.questions} ({t.content.maxQuestions} 10
                              {t.content.questions})
                            </span>
                          </div>
                        </div>

                        {/* 난이도 */}
                        <div className="mb-4">
                          <label className="block text-sm font-Pretendard text-gray-700 mb-2">
                            {t.content.difficulty}
                          </label>
                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                setDifficulty(
                                  difficulty === "high" ? null : "high"
                                )
                              }
                              className={`px-4 py-2 rounded border text-sm font-Pretendard transition-colors ${
                                difficulty === "high"
                                  ? "bg-gray-800 text-white border-gray-800"
                                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                              }`}
                            >
                              {t.content.difficultyHigh}
                            </button>
                            <button
                              onClick={() =>
                                setDifficulty(
                                  difficulty === "medium" ? null : "medium"
                                )
                              }
                              className={`px-4 py-2 rounded border text-sm font-Pretendard transition-colors ${
                                difficulty === "medium"
                                  ? "bg-gray-800 text-white border-gray-800"
                                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                              }`}
                            >
                              {t.content.difficultyMedium}
                            </button>
                            <button
                              onClick={() =>
                                setDifficulty(
                                  difficulty === "low" ? null : "low"
                                )
                              }
                              className={`px-4 py-2 rounded border text-sm font-Pretendard transition-colors ${
                                difficulty === "low"
                                  ? "bg-gray-800 text-white border-gray-800"
                                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                              }`}
                            >
                              {t.content.difficultyLow}
                            </button>
                          </div>
                        </div>

                        {/* 문제 유형 */}
                        <div className="mb-6">
                          <label className="block text-sm font-Pretendard text-gray-700 mb-2">
                            {t.content.questionType}
                          </label>
                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                setQuestionType(
                                  questionType === "shortAnswer"
                                    ? null
                                    : "shortAnswer"
                                )
                              }
                              className={`px-4 py-2 rounded border text-sm font-Pretendard transition-colors ${
                                questionType === "shortAnswer"
                                  ? "bg-gray-800 text-white border-gray-800"
                                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                              }`}
                            >
                              {t.content.questionTypeShortAnswer}
                            </button>
                            <button
                              onClick={() =>
                                setQuestionType(
                                  questionType === "trueFalse"
                                    ? null
                                    : "trueFalse"
                                )
                              }
                              className={`px-4 py-2 rounded border text-sm font-Pretendard transition-colors ${
                                questionType === "trueFalse"
                                  ? "bg-gray-800 text-white border-gray-800"
                                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                              }`}
                            >
                              {t.content.questionTypeTrueFalse}
                            </button>
                            <button
                              onClick={() =>
                                setQuestionType(
                                  questionType === "multipleChoice"
                                    ? null
                                    : "multipleChoice"
                                )
                              }
                              className={`px-4 py-2 rounded border text-sm font-Pretendard transition-colors ${
                                questionType === "multipleChoice"
                                  ? "bg-gray-800 text-white border-gray-800"
                                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                              }`}
                            >
                              {t.content.questionTypeMultipleChoice}
                            </button>
                          </div>
                        </div>

                        {/* 문제지 생성 버튼 */}
                        <button
                          onClick={async () => {
                            if (!difficulty || !questionType) {
                              alert("난이도와 문제 유형을 선택해주세요.");
                              return;
                            }

                            setIsGeneratingQuiz(true);
                            setShowQuizCreateForm(false);

                            try {
                              // TODO: 퀴즈 생성 API 호출
                              await new Promise((resolve) =>
                                setTimeout(resolve, 2000)
                              );

                              console.log("퀴즈 생성:", {
                                questionCount,
                                difficulty,
                                questionType,
                              });
                            } catch (error) {
                              console.error("퀴즈 생성 실패:", error);
                            } finally {
                              setIsGeneratingQuiz(false);
                            }
                          }}
                          disabled={!difficulty || !questionType}
                          className="w-full px-6 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-Pretendard font-semibold text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {t.content.generateQuiz}
                        </button>
                      </div>
                    )}

                    {/* 퀴즈 생성 중 스켈레톤 UI */}
                    {isGeneratingQuiz && <QuizSkeleton />}

                    {/* 퀴즈 리스트 테이블 */}
                    {!isGeneratingQuiz && (
                      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                        <table className="w-full border-collapse">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-Pretendard font-semibold text-gray-700 uppercase border-b border-gray-200">
                                {t.content.quizNumber}
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-Pretendard font-semibold text-gray-700 uppercase border-b border-gray-200">
                                {t.content.questionCount}
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-Pretendard font-semibold text-gray-700 uppercase border-b border-gray-200">
                                {t.content.difficulty}
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-Pretendard font-semibold text-gray-700 uppercase border-b border-gray-200">
                                {t.content.createdAt}
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-Pretendard font-semibold text-gray-700 uppercase border-b border-gray-200">
                                {t.content.download}
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {mockQuizzes.map((quiz, index) => (
                              <tr
                                key={quiz.id}
                                className={`hover:bg-gray-50 cursor-pointer transition-colors ${
                                  index !== mockQuizzes.length - 1
                                    ? "border-b border-gray-200"
                                    : ""
                                }`}
                                onClick={() =>
                                  navigate(`/home/quiz/${quiz.id}`)
                                }
                              >
                                <td className="px-4 py-3 text-sm font-Pretendard text-gray-900">
                                  {quiz.number}
                                </td>
                                <td className="px-4 py-3 text-sm font-Pretendard text-gray-700">
                                  {quiz.questionCount}
                                </td>
                                <td className="px-4 py-3 text-sm font-Pretendard text-gray-700">
                                  {quiz.difficulty}
                                </td>
                                <td className="px-4 py-3 text-sm font-Pretendard text-gray-700">
                                  {quiz.createdAt}
                                </td>
                                <td className="px-4 py-3">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      console.log("다운로드", quiz.id);
                                    }}
                                    className="text-primary hover:text-primary/80 font-Pretendard text-sm"
                                  >
                                    {t.content.download}
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "advanced" && (
                  <div>
                    <h2 className="text-xl font-Pretendard font-semibold text-gray-900 mb-4">
                      {t.content.advanced}
                    </h2>

                    {/* 계획 생성 폼이 보이지 않을 때 */}
                    {!showPlanCreateForm && (
                      <div className="flex flex-col items-center justify-center py-12">
                        <p className="text-gray-600 font-Pretendard mb-6">
                          현재 생성 계획 없음
                        </p>
                        <button
                          onClick={() => setShowPlanCreateForm(true)}
                          className="px-6 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-Pretendard font-semibold text-gray-900"
                        >
                          계획 생성
                        </button>
                      </div>
                    )}

                    {/* 계획 생성 폼 */}
                    {showPlanCreateForm && (
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                        <h3 className="text-lg font-Pretendard font-semibold text-gray-900 mb-6">
                          계획
                        </h3>

                        {/* 목표 설정 */}
                        <div className="mb-4">
                          <label className="block text-sm font-Pretendard text-gray-700 mb-2">
                            목표 설정
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              min="1"
                              value={goalDays}
                              onChange={(e) =>
                                setGoalDays(Number(e.target.value))
                              }
                              className="px-3 py-2 border border-gray-300 rounded text-sm font-Pretendard w-24 focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                            <span className="text-sm text-gray-600 font-Pretendard">
                              일
                            </span>
                          </div>
                        </div>

                        {/* 일일 가용 시간 */}
                        <div className="mb-6">
                          <label className="block text-sm font-Pretendard text-gray-700 mb-2">
                            일일 가용 시간
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              min="1"
                              max="24"
                              value={dailyHours}
                              onChange={(e) =>
                                setDailyHours(Number(e.target.value))
                              }
                              className="px-3 py-2 border border-gray-300 rounded text-sm font-Pretendard w-24 focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                            <span className="text-sm text-gray-600 font-Pretendard">
                              시간
                            </span>
                          </div>
                        </div>

                        {/* 계획 생성 버튼 */}
                        <button
                          onClick={async () => {
                            console.log("계획 생성:", {
                              goalDays,
                              dailyHours,
                            });
                            setShowPlanCreateForm(false);
                          }}
                          className="w-full px-6 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-Pretendard font-semibold text-gray-900"
                        >
                          계획 생성
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ContentDetail;

