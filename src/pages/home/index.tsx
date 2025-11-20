import { useState } from "react";
import { useLanguage, translations } from "../../store/useLanguageStore";
import Sidebar from "./components/Sidebar";
import UploadModal from "./components/UploadModal";

const LANGUAGE_OPTIONS = [
  { code: "ko" as const, label: "한국어" },
  { code: "en" as const, label: "English" },
  { code: "zh" as const, label: "中文" },
  { code: "ja" as const, label: "日本語" },
] as const;

const HomePage = () => {
  // TODO: UI 작업 완료 후 활성화
  // const { status, session } = useAuth();
  // const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();
  const t = translations[language].home;
  
  // 임시로 세션 데이터 사용 (실제로는 useAuth에서 가져옴)
  const session = { name: "홍길동" };
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

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
            {/* 왼쪽: 키워드 섹션 */}
            <div className="flex-1 border-r border-gray-200 pr-8">
              <h2 className="text-xl font-Pretendard font-semibold text-gray-900 mb-6">
                {t.content.keywords}
              </h2>
              <div className="space-y-4 text-gray-700 font-Pretendard">
                <p className="leading-relaxed">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
                <p className="leading-relaxed">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
                <p className="leading-relaxed">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
              </div>
            </div>

            {/* 오른쪽: 퀴즈 섹션 */}
            <div className="flex-1 pl-8">
              {/* 요약 버튼들 */}
              <div className="flex gap-2 mb-6">
                {[1, 2, 3].map((num) => (
                  <button
                    key={num}
                    className={`px-4 py-2 rounded border text-sm font-Pretendard transition-colors ${
                      num === 1
                        ? "border-primary text-primary bg-primary/5"
                        : "border-gray-300 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {t.content.summary}
                  </button>
                ))}
              </div>

              {/* 퀴즈 제목 */}
              <h2 className="text-xl font-Pretendard font-semibold text-gray-900 mb-6">
                {t.content.quiz}
              </h2>

              {/* 번호 입력 */}
              <div className="mb-4">
                <label className="block text-sm font-Pretendard text-gray-700 mb-2">
                  {t.content.number}
                </label>
                <input
                  type="text"
                  value="1"
                  readOnly
                  className="w-full px-4 py-3 rounded-lg bg-primary/10 border border-primary/30 text-gray-900 font-Pretendard"
                />
              </div>

              {/* 번호 표시 */}
              <div className="text-2xl font-Pretendard font-semibold text-gray-900">
                1
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

