import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage, translations } from "../../store/useLanguageStore";
import { useAuth } from "../../store/useAuthStore";
import { uploadLectureAPI } from "../../api/lecture";
import { createFolderAPI } from "../../api/folder";
import Sidebar from "./components/Sidebar";
import UploadModal from "./components/UploadModal";
import CreateFolderModal from "./components/CreateFolderModal";
import UploadSkeleton from "./components/UploadSkeleton";
import UserMenu from "./components/UserMenu";

const LANGUAGE_OPTIONS = [
  { code: "KR" as const, label: "한국어" },
  { code: "CN" as const, label: "中文" },
  { code: "EN" as const, label: "English" },
  { code: "JP" as const, label: "日本語" },
  { code: "VI" as const, label: "Tiếng Việt" },
] as const;

const HomePage = () => {
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();
  const { user } = useAuth();
  const t = translations[language].home;

  // 로그인된 경우 사용자 정보의 언어를 우선 사용 (백엔드에서 받은 언어)
  useEffect(() => {
    if (user?.language) {
      // 사용자 정보에 언어가 있으면 무조건 동기화
      setLanguage(user.language);
    } else if (user) {
      // 사용자 정보는 있지만 language가 없는 경우 localStorage에서 확인
      const storedLang = localStorage.getItem("userLanguage");
      if (storedLang && ["KR", "CN", "EN", "JP", "VI"].includes(storedLang)) {
        setLanguage(storedLang as typeof language);
      }
    }
  }, [user, setLanguage]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateFolderModalOpen, setIsCreateFolderModalOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadComplete, setIsUploadComplete] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [folderRefreshTrigger, setFolderRefreshTrigger] = useState(0);

  // 폴더 생성 핸들러
  const handleCreateFolder = async (folderName: string) => {
    if (!user?.id) {
      alert("로그인이 필요합니다.");
      return;
    }

    setIsCreatingFolder(true);
    try {
      const newFolder = await createFolderAPI(user.id, folderName);
      setIsCreateFolderModalOpen(false);
      // 폴더 생성 성공 시 사이드바 새로고침 트리거
      setFolderRefreshTrigger((prev) => prev + 1);
      // 생성된 폴더 자동 선택
      setSelectedFolderId(newFolder.folderId);
      alert("폴더가 생성되었습니다.");
    } catch (error) {
      console.error("폴더 생성 실패:", error);
      alert("폴더 생성에 실패했습니다.");
    } finally {
      setIsCreatingFolder(false);
    }
  };

  return (
    <div className="flex h-screen bg-white overflow-hidden relative">
      <Sidebar
        selectedFolderId={selectedFolderId}
        onFolderSelect={setSelectedFolderId}
        refreshTrigger={folderRefreshTrigger}
      />

      {/* 메인 콘텐츠 */}
      <div className="flex-1 flex flex-col overflow-hidden bg-white relative">
        {/* 헤더 */}
        <header className="bg-white px-8 py-4 flex items-center justify-between border-b border-gray-200">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-Pretendard font-semibold text-gray-900">
              {t.sidebar.home}
            </h1>
            {selectedFolderId && (
              <span className="text-sm text-gray-500 font-Pretendard">
                (폴더 선택됨)
              </span>
            )}
          </div>

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
        <main className="flex-1 flex flex-col items-center justify-center p-8 relative">
          {/* 블러 처리 오버레이 */}
          {(isUploading || isUploadComplete) && (
            <div
              className={`absolute inset-0 bg-white/80 backdrop-blur-md z-40 transition-opacity duration-500 ${
                isUploadComplete ? "opacity-100" : "opacity-50"
              }`}
            />
          )}

          {/* 업로드 완료 축하 메시지 */}
          {showSuccessMessage && (
            <div className="absolute inset-0 z-50 flex items-center justify-center">
              <div className="relative z-10 animate-bounce">
                <div className="text-3xl font-Pretendard font-bold text-green-500 text-center animate-pulse">
                  수업 내용의 번역이 완료되었어요!
                </div>
              </div>
            </div>
          )}

          {/* 스켈레톤 UI */}
          {isUploading && !isUploadComplete && (
            <div className="absolute inset-0 z-30 flex items-center justify-center p-8">
              <UploadSkeleton />
            </div>
          )}

          <div
            className={`relative flex flex-col items-center justify-center w-full h-full border-2 border-dashed rounded-lg transition-all duration-300 ${
              !selectedFolderId
                ? "border-gray-200 bg-gray-100 cursor-not-allowed"
                : isDragging || isHovering
                ? "border-primary bg-primary/10 backdrop-blur-sm"
                : "border-gray-300 bg-gray-50"
            } ${isUploading || isUploadComplete ? "opacity-30" : ""}`}
            onMouseEnter={() => {
              if (selectedFolderId) setIsHovering(true);
            }}
            onMouseLeave={() => setIsHovering(false)}
            onDragEnter={(e) => {
              if (!selectedFolderId) {
                e.preventDefault();
                e.stopPropagation();
                return;
              }
              e.preventDefault();
              e.stopPropagation();
              setIsDragging(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsDragging(false);
            }}
            onDragOver={(e) => {
              if (!selectedFolderId) {
                e.preventDefault();
                e.stopPropagation();
                return;
              }
              e.preventDefault();
              e.stopPropagation();
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsDragging(false);

              // 폴더가 선택되지 않았으면 드롭 무시
              if (!selectedFolderId) {
                alert("먼저 폴더를 선택하거나 생성해주세요.");
                return;
              }

              const files = Array.from(e.dataTransfer.files);
              if (files.length > 0) {
                setSelectedFiles(files);
                setIsModalOpen(true);
              }
            }}
          >
            {/* 호버 시 블러 오버레이 */}
            {(isHovering || isDragging) && (
              <div className="absolute inset-0 bg-primary/5 backdrop-blur-md rounded-lg transition-opacity duration-300" />
            )}

            <label
              htmlFor="file-upload-drop"
              className={`relative z-10 flex flex-col items-center justify-center p-12 ${
                selectedFolderId
                  ? "cursor-pointer"
                  : "cursor-not-allowed opacity-50"
              }`}
            >
              {/* 구름 아이콘 */}
              <svg
                className={`w-16 h-16 mb-4 transition-colors duration-300 ${
                  isHovering || isDragging ? "text-primary" : "text-gray-400"
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <p
                className={`font-Pretendard text-lg mb-2 transition-colors duration-300 ${
                  isHovering || isDragging
                    ? "text-primary font-semibold"
                    : "text-gray-600"
                }`}
              >
                {t.uploadArea.title}
              </p>
              <p
                className={`font-Pretendard text-sm transition-colors duration-300 ${
                  isHovering || isDragging ? "text-primary/70" : "text-gray-400"
                }`}
              >
                {t.uploadArea.description}
              </p>
              {!selectedFolderId && (
                <p className="font-Pretendard text-xs text-orange-500 mt-2">
                  {t.uploadArea.folderRequired}
                </p>
              )}
            </label>
            <input
              id="file-upload-drop"
              type="file"
              accept="audio/*,video/*,.mp3,.mp4,.wav"
              className="hidden"
              disabled={!selectedFolderId}
              onChange={(e) => {
                const files = e.target.files;
                if (files && files.length > 0) {
                  // 폴더가 선택되지 않았으면 알림
                  if (!selectedFolderId) {
                    alert("먼저 폴더를 선택하거나 생성해주세요.");
                    e.target.value = ""; // 파일 선택 초기화
                    return;
                  }
                  setSelectedFiles(Array.from(files));
                  setIsModalOpen(true);
                }
              }}
            />

            {/* 폴더 생성 버튼 */}
            <div className="absolute bottom-4 right-4 z-10">
              <button
                onClick={() => setIsCreateFolderModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-Pretendard text-sm font-medium shadow-lg"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                {t.uploadArea.createFolder}
              </button>
            </div>
          </div>
        </main>

        {/* 폴더 생성 모달 */}
        <CreateFolderModal
          isOpen={isCreateFolderModalOpen}
          onClose={() => setIsCreateFolderModalOpen(false)}
          onConfirm={handleCreateFolder}
          isLoading={isCreatingFolder}
        />

        {/* 업로드 모달 */}
        <UploadModal
          isOpen={isModalOpen}
          selectedFolderId={selectedFolderId}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedFiles([]);
            // 파일 input 초기화
            const fileInput = document.getElementById(
              "file-upload-drop"
            ) as HTMLInputElement;
            if (fileInput) {
              fileInput.value = "";
            }
          }}
          onConfirm={async (classTitle, files) => {
            if (!user || !user.id) {
              alert("로그인이 필요합니다.");
              return;
            }

            // 폴더 선택 확인
            if (!selectedFolderId) {
              alert(
                "먼저 사이드바에서 폴더를 선택하거나 '폴더 만들기' 버튼으로 새 폴더를 생성해주세요."
              );
              return;
            }

            try {
              setIsModalOpen(false);
              setIsUploading(true);
              setIsUploadComplete(false);
              setShowSuccessMessage(false);

              // 첫 번째 파일만 업로드 (API는 단일 파일만 받음)
              const file = files[0];
              const response = await uploadLectureAPI(
                user.id,
                classTitle,
                file,
                selectedFolderId
              );

              // 업로드 완료
              setIsUploadComplete(true);

              // 블러 처리 후 축하 메시지 표시
              setTimeout(() => {
                setShowSuccessMessage(true);
              }, 300);

              // 축하 메시지 표시 후 콘텐츠 상세 페이지로 이동
              setTimeout(() => {
                // 응답 데이터를 state로 전달하기 위해 URL에 포함하거나,
                // 전역 상태나 localStorage에 저장
                navigate(`/home/content/${response.lectureId}`, {
                  state: {
                    lectureData: response,
                  },
                });

                // 상태 초기화
                setIsUploading(false);
                setIsUploadComplete(false);
                setShowSuccessMessage(false);
                setSelectedFiles([]);
              }, 3000);
            } catch (error) {
              console.error("파일 업로드 실패:", error);

              // 에러 메시지 추출
              let errorMessage = "파일 업로드에 실패했습니다.";

              if (error instanceof Error) {
                if (
                  error.message.includes("Maximum upload size") ||
                  error.message.includes("너무 큽니다")
                ) {
                  errorMessage = error.message;
                } else {
                  errorMessage = error.message;
                }
              } else if (
                error &&
                typeof error === "object" &&
                "response" in error
              ) {
                const axiosError = error as {
                  response?: {
                    status?: number;
                    data?: { message?: string };
                  };
                  message?: string;
                };

                if (
                  axiosError.response?.status === 413 ||
                  axiosError.message?.includes("Maximum upload size")
                ) {
                  errorMessage =
                    "파일 크기가 너무 큽니다. 더 작은 파일을 업로드해주세요.";
                } else if (
                  axiosError.response?.status === 415 ||
                  axiosError.message?.includes("Content-Type")
                ) {
                  errorMessage = "지원하지 않는 파일 형식입니다.";
                } else if (axiosError.response?.data?.message) {
                  errorMessage = axiosError.response.data.message;
                } else if (axiosError.message) {
                  errorMessage = axiosError.message;
                }
              }

              alert(errorMessage);
              setIsUploading(false);
              setIsUploadComplete(false);
              setShowSuccessMessage(false);
            }
          }}
          files={selectedFiles}
        />
      </div>
    </div>
  );
};

export default HomePage;
