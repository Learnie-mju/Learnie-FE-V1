import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage, translations } from "../../store/useLanguageStore";
import Sidebar from "./components/Sidebar";
import UploadModal from "./components/UploadModal";

const LANGUAGE_OPTIONS = [
  { code: "ko" as const, label: "한국어" },
  { code: "en" as const, label: "English" },
  { code: "zh" as const, label: "中文" },
  { code: "ja" as const, label: "日本語" },
  { code: "vi" as const, label: "Tiếng Việt" },
  { code: "mn" as const, label: "Монгол" },
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

const HomePage = () => {
  // TODO: UI 작업 완료 후 활성화
  // const { status, session } = useAuth();
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();
  const t = translations[language].home;
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [activeTab, setActiveTab] = useState<"summary" | "quiz" | "advanced">("summary");

  // TODO: UI 작업 완료 후 활성화
  // 로그인되지 않은 상태면 로그인 페이지로 redirect
  // useEffect(() => {
  //   if (status === "unauthenticated") {
  //     navigate("/login", { replace: true });
  //   }
  // }, [status, navigate]);

  // 로그인되지 않은 상태면 아무것도 렌더링하지 않음
  // if (status !== "authenticated") {
  //   return null;
  // }

  return (
    <div className="flex h-screen bg-white overflow-hidden relative">
      <Sidebar />
      
      {/* 메인 콘텐츠 */}
      <div className="flex-1 flex flex-col overflow-hidden bg-white relative">
        {/* 헤더 */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          {/* 뒤로가기 버튼 */}
          <button className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
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
                  강의 녹음본의 번역본이 여기에 표시됩니다. 원본 강의 내용을 모국어로 번역한 텍스트를 확인할 수 있습니다.
                </p>
                <p className="leading-relaxed">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
                <p className="leading-relaxed">
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
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
                        강의의 주요 내용을 요약한 내용이 여기에 표시됩니다. 핵심 개념과 중요한 포인트를 빠르게 파악할 수 있습니다.
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
                        onClick={() => {
                          // TODO: 퀴즈 생성 로직
                          console.log("퀴즈 생성");
                        }}
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-Pretendard text-sm"
                      >
                        {t.content.createQuiz}
                      </button>
                    </div>
                    
                    {/* 퀴즈 리스트 테이블 */}
                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-Pretendard font-semibold text-gray-700 uppercase">
                              {t.content.quizNumber}
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-Pretendard font-semibold text-gray-700 uppercase">
                              {t.content.questionCount}
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-Pretendard font-semibold text-gray-700 uppercase">
                              {t.content.difficulty}
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-Pretendard font-semibold text-gray-700 uppercase">
                              {t.content.createdAt}
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-Pretendard font-semibold text-gray-700 uppercase">
                              {t.content.download}
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {mockQuizzes.map((quiz) => (
                            <tr
                              key={quiz.id}
                              className="hover:bg-gray-50 cursor-pointer transition-colors"
                              onClick={() => navigate(`/home/quiz/${quiz.id}`)}
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
                                    // TODO: 다운로드 로직
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
                  </div>
                )}

                {activeTab === "advanced" && (
                  <div>
                    <h2 className="text-xl font-Pretendard font-semibold text-gray-900 mb-4">
                      {t.content.advanced}
                    </h2>
                    <div className="text-gray-700 font-Pretendard leading-relaxed">
                      <p>{t.content.advancedContent}</p>
                      <p className="mt-4">
                        강의 내용을 더 깊이 있게 다룬 심화 자료가 여기에 표시됩니다. 추가 학습 자료와 상세한 설명을 확인할 수 있습니다.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>

        {/* 하단 스크롤 버튼 */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <button className="w-10 h-10 rounded-full bg-pink-500 hover:bg-pink-600 flex items-center justify-center transition-colors shadow-lg">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 10l7-7m0 0l7 7m-7-7v18"
              />
            </svg>
          </button>
        </div>

        {/* 업로드 모달 */}
        <UploadModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedFiles([]);
            // 파일 input 초기화
            const fileInput = document.getElementById("file-upload") as HTMLInputElement;
            if (fileInput) {
              fileInput.value = "";
            }
          }}
          onConfirm={(classTitle, files) => {
            // TODO: 실제 파일 업로드 로직 구현
            console.log("업로드 확인:", { classTitle, files });
            setIsModalOpen(false);
            setSelectedFiles([]);
          }}
          files={selectedFiles}
        />
      </div>
    </div>
  );
};

export default HomePage;

