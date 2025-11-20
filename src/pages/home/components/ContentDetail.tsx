import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useLanguage, translations } from "../../../store/useLanguageStore";
import { useAuth } from "../../../store/useAuthStore";
import {
  getLectureDetailAPI,
  createReviewAPI,
  type LectureUploadResponse,
  type CreateReviewResponse,
} from "../../../api/lecture";
import { createQuizAPI, getQuizListAPI, type QuizListItem } from "../../../api/quiz";
import QuizSkeleton from "./QuizSkeleton";
import Sidebar from "./Sidebar";
import UserMenu from "./UserMenu";
import ReactMarkdown from "react-markdown";
import toast from "react-hot-toast";

const LANGUAGE_OPTIONS = [
  { code: "KR" as const, label: "한국어" },
  { code: "CN" as const, label: "中文" },
  { code: "EN" as const, label: "English" },
  { code: "JP" as const, label: "日本語" },
  { code: "VI" as const, label: "Tiếng Việt" },
] as const;


const ContentDetail = () => {
  const { contentId } = useParams<{ contentId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { language, setLanguage } = useLanguage();
  const { user } = useAuth();
  const t = translations[language].home;

  // location.state에서 전달된 강의 데이터 가져오기
  const stateLectureData = location.state?.lectureData as
    | LectureUploadResponse
    | undefined;

  const [lectureData, setLectureData] = useState<LectureUploadResponse | null>(
    stateLectureData || null
  );
  const [isLoading, setIsLoading] = useState(!stateLectureData);

  // 강의 상세 정보 가져오기
  useEffect(() => {
    const fetchLectureDetail = async () => {
      if (!contentId) return;

      // state에서 데이터가 있으면 사용하고, 없으면 API 호출
      if (stateLectureData) {
        setLectureData(stateLectureData);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const lectureId = parseInt(contentId, 10);
        if (isNaN(lectureId)) {
          toast.error("잘못된 강의 ID입니다.");
          navigate("/home");
          return;
        }

        const data = await getLectureDetailAPI(lectureId);
        setLectureData(data);
      } catch (error) {
        console.error("강의 상세 조회 실패:", error);
        toast.error("강의 정보를 불러오는데 실패했습니다.");
        navigate("/home");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLectureDetail();
  }, [contentId, stateLectureData, navigate]);

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
    "short" | "ox" | "multiple" | null
  >(null);

  // 퀴즈 리스트 상태
  const [quizList, setQuizList] = useState<QuizListItem[]>([]);
  const [isLoadingQuizList, setIsLoadingQuizList] = useState(false);

  // 퀴즈 리스트 조회
  useEffect(() => {
    const fetchQuizList = async () => {
      if (!lectureData?.lectureId) return;

      setIsLoadingQuizList(true);
      try {
        console.log("[ContentDetail] 퀴즈 리스트 조회 시작 - lectureId:", lectureData.lectureId);
        const quizzes = await getQuizListAPI(lectureData.lectureId);
        console.log("[ContentDetail] 받은 퀴즈 리스트:", quizzes);
        console.log("[ContentDetail] 받은 퀴즈 리스트 개수:", quizzes.length);
        setQuizList(quizzes);
        console.log("[ContentDetail] 퀴즈 리스트 상태 업데이트 완료");
      } catch (error) {
        console.error("[ContentDetail] 퀴즈 리스트 조회 실패:", error);
        toast.error("퀴즈 리스트를 불러오는데 실패했습니다.");
      } finally {
        setIsLoadingQuizList(false);
      }
    };

    if (activeTab === "quiz" && lectureData?.lectureId) {
      fetchQuizList();
    }
  }, [lectureData?.lectureId, activeTab]);

  // 강의 리뷰 상태
  const [review, setReview] = useState<CreateReviewResponse | null>(null);
  const [isGeneratingReview, setIsGeneratingReview] = useState(false);

  if (isLoading) {
    return (
      <div className="flex h-screen bg-white overflow-hidden relative">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-gray-500 font-Pretendard">로딩 중...</div>
        </div>
      </div>
    );
  }

  if (!lectureData) {
    return (
      <div className="flex h-screen bg-white overflow-hidden relative">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-gray-500 font-Pretendard">
            강의 정보를 불러올 수 없습니다.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white overflow-hidden relative">
      <Sidebar />

      {/* 메인 콘텐츠 */}
      <div className="flex-1 flex flex-col overflow-hidden bg-white relative">
        {/* 헤더 */}
        <header className="bg-white px-8 py-4 flex items-center justify-between">
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
                {lectureData?.content ? (
                  <div className="leading-relaxed whitespace-pre-wrap">
                    {lectureData.content}
                  </div>
                ) : (
                  <p className="leading-relaxed text-gray-500">
                    강의 녹음본의 번역본이 여기에 표시됩니다. 원본 강의 내용을
                    모국어로 번역한 텍스트를 확인할 수 있습니다.
                  </p>
                )}
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
                      {lectureData?.summary ? (
                        <div className="prose prose-sm max-w-none">
                          <ReactMarkdown>{lectureData.summary}</ReactMarkdown>
                        </div>
                      ) : (
                        <>
                          <p>{t.content.summaryContent}</p>
                          <p className="mt-4">
                            강의의 주요 내용을 요약한 내용이 여기에 표시됩니다.
                            핵심 개념과 중요한 포인트를 빠르게 파악할 수
                            있습니다.
                          </p>
                        </>
                      )}
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
                                  questionType === "short"
                                    ? null
                                    : "short"
                                )
                              }
                              className={`px-4 py-2 rounded border text-sm font-Pretendard transition-colors ${
                                questionType === "short"
                                  ? "bg-gray-800 text-white border-gray-800"
                                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                              }`}
                            >
                              {t.content.questionTypeShortAnswer}
                            </button>
                            <button
                              onClick={() =>
                                setQuestionType(
                                  questionType === "ox"
                                    ? null
                                    : "ox"
                                )
                              }
                              className={`px-4 py-2 rounded border text-sm font-Pretendard transition-colors ${
                                questionType === "ox"
                                  ? "bg-gray-800 text-white border-gray-800"
                                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                              }`}
                            >
                              {t.content.questionTypeTrueFalse}
                            </button>
                            <button
                              onClick={() =>
                                setQuestionType(
                                  questionType === "multiple"
                                    ? null
                                    : "multiple"
                                )
                              }
                              className={`px-4 py-2 rounded border text-sm font-Pretendard transition-colors ${
                                questionType === "multiple"
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
                              toast.error("난이도와 문제 유형을 선택해주세요.");
                              return;
                            }

                            if (!lectureData?.lectureId) {
                              toast.error("강의 정보를 불러올 수 없습니다.");
                              return;
                            }

                            setIsGeneratingQuiz(true);
                            setShowQuizCreateForm(false);

                            try {
                              console.log("[퀴즈 생성] 호출 전 파라미터:", {
                                lectureId: lectureData.lectureId,
                                quizType: questionType, // "short" | "ox" | "multiple"
                                quizNum: questionCount, // 문제 개수
                                level: difficulty, // "high" | "medium" | "low"
                              });

                              // 퀴즈 생성 API 호출
                              await createQuizAPI(
                                lectureData.lectureId,
                                questionType, // "short" | "ox" | "multiple"
                                questionCount, // 문제 개수
                                difficulty // "high" | "medium" | "low"
                              );

                              toast.success("퀴즈가 생성되었습니다!");
                              
                              // 퀴즈 목록 새로고침
                              try {
                                console.log("[ContentDetail] 퀴즈 생성 후 리스트 새로고침 시작");
                                const quizzes = await getQuizListAPI(lectureData.lectureId);
                                console.log("[ContentDetail] 새로고침된 퀴즈 리스트:", quizzes);
                                setQuizList(quizzes);
                              } catch (error) {
                                console.error("[ContentDetail] 퀴즈 리스트 조회 실패:", error);
                              }
                            } catch (error) {
                              console.error("퀴즈 생성 실패:", error);
                              toast.error("퀴즈 생성에 실패했습니다.");
                            } finally {
                              setIsGeneratingQuiz(false);
                            }
                          }}
                          disabled={!difficulty || !questionType || !lectureData?.lectureId}
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
                        {isLoadingQuizList ? (
                          <div className="p-8 text-center text-gray-500 font-Pretendard">
                            퀴즈 리스트를 불러오는 중...
                          </div>
                        ) : quizList.length === 0 ? (
                          <div className="p-8 text-center text-gray-500 font-Pretendard">
                            생성된 퀴즈가 없습니다.
                          </div>
                        ) : (
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
                              {quizList.map((quiz, index) => {
                                const quizId = Array.isArray(quiz.quiz_id) && quiz.quiz_id.length > 0 
                                  ? quiz.quiz_id[0] 
                                  : index + 1;
                                const createdAt = new Date(quiz.createdAt).toLocaleDateString("ko-KR");
                                
                                return (
                                  <tr
                                    key={quizId}
                                    className={`hover:bg-gray-50 cursor-pointer transition-colors ${
                                      index !== quizList.length - 1
                                        ? "border-b border-gray-200"
                                        : ""
                                    }`}
                                    onClick={() =>
                                      navigate(`/home/quiz/${quizId}`, {
                                        state: {
                                          quizIds: quiz.quiz_id,
                                          quizType: quiz.quizType,
                                          lectureData: lectureData,
                                        },
                                      })
                                    }
                                  >
                                    <td className="px-4 py-3 text-sm font-Pretendard text-gray-900">
                                      {quiz.quizNum || index + 1}
                                    </td>
                                    <td className="px-4 py-3 text-sm font-Pretendard text-gray-700">
                                      {quiz.quizNum || "-"}
                                    </td>
                                    <td className="px-4 py-3 text-sm font-Pretendard text-gray-700">
                                      {quiz.level}
                                    </td>
                                    <td className="px-4 py-3 text-sm font-Pretendard text-gray-700">
                                      {createdAt}
                                    </td>
                                    <td className="px-4 py-3">
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          console.log("다운로드", quizId);
                                        }}
                                        className="text-primary hover:text-primary/80 font-Pretendard text-sm"
                                      >
                                        {t.content.download}
                                      </button>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "advanced" && (
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-Pretendard font-semibold text-gray-900">
                        {t.content.advanced}
                      </h2>
                      {!review && !isGeneratingReview && (
                        <button
                          onClick={async () => {
                            if (!lectureData?.lectureId) {
                              toast.error("강의 정보를 불러올 수 없습니다.");
                              return;
                            }

                            setIsGeneratingReview(true);

                            try {
                              console.log("[ContentDetail] 리뷰 생성 시작:", {
                                lectureId: lectureData.lectureId,
                              });

                              // 제목 없이 lectureId만으로 리뷰 생성
                              const createdReview = await createReviewAPI(
                                lectureData.lectureId,
                                "", // 제목 없음
                                "" // 리뷰 내용도 서버에서 생성
                              );

                              console.log("[ContentDetail] 생성된 리뷰:", createdReview);
                              setReview(createdReview);
                              toast.success("리뷰가 생성되었습니다!");
                            } catch (error) {
                              console.error("[ContentDetail] 리뷰 생성 실패:", error);
                              toast.error("리뷰 생성에 실패했습니다.");
                            } finally {
                              setIsGeneratingReview(false);
                            }
                          }}
                          disabled={!lectureData?.lectureId || isGeneratingReview}
                          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-Pretendard text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isGeneratingReview ? "리뷰 생성 중..." : "리뷰 생성"}
                        </button>
                      )}
                    </div>

                    {/* 리뷰 생성 중 */}
                    {isGeneratingReview && (
                      <div className="p-8 text-center text-gray-500 font-Pretendard">
                        리뷰를 생성하는 중...
                      </div>
                    )}

                    {/* 생성된 리뷰 표시 */}
                    {review && !isGeneratingReview && (
                      <div className="text-gray-700 font-Pretendard leading-relaxed whitespace-pre-wrap">
                        {review.title && (
                          <div className="mb-4">
                            <h3 className="text-lg font-Pretendard font-semibold text-gray-900">
                              {review.title}
                            </h3>
                          </div>
                        )}
                        {review.review && (
                          <div className="leading-relaxed">
                            {review.review}
                          </div>
                        )}
                      </div>
                    )}

                    {/* 리뷰가 없고 생성 중이 아닐 때 */}
                    {!review && !isGeneratingReview && (
                      <div className="text-gray-700 font-Pretendard leading-relaxed">
                        <p>{t.content.advancedContent}</p>
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
