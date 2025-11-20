import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useLanguage, translations } from "../../store/useLanguageStore";
import { useAuth } from "../../store/useAuthStore";
import {
  uploadLectureAPI,
  getLectureListByFolderAPI,
  type LectureListItem,
} from "../../api/lecture";
import { createFolderAPI, getFoldersAPI } from "../../api/folder";
import toast from "react-hot-toast";
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
  const location = useLocation();
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
  const [lectures, setLectures] = useState<LectureListItem[]>([]);
  const [isLoadingLectures, setIsLoadingLectures] = useState(false);
  const [selectedFolderName, setSelectedFolderName] = useState<string>("");
  const [folders, setFolders] = useState<
    Array<{ folderId: number; folderName: string }>
  >([]);

  // 폴더 생성 핸들러
  const handleCreateFolder = async (folderName: string) => {
    if (!user?.id) {
      toast.error("로그인이 필요합니다.");
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
      setSelectedFolderName(newFolder.folderName);
      toast.success("폴더가 생성되었습니다.");
    } catch (error) {
      console.error("폴더 생성 실패:", error);
      toast.error("폴더 생성에 실패했습니다.");
    } finally {
      setIsCreatingFolder(false);
    }
  };

  // 폴더 목록 가져오기
  useEffect(() => {
    const fetchFolders = async () => {
      if (!user?.id) return;

      try {
        const folderList = await getFoldersAPI(user.id);
        setFolders(
          folderList.map((folder) => ({
            folderId: folder.folderId,
            folderName: folder.folderName,
          }))
        );
      } catch (error) {
        console.error("폴더 목록 조회 실패:", error);
      }
    };

    fetchFolders();
  }, [user?.id, folderRefreshTrigger]);

  // 폴더 선택 시 강의 목록 가져오기
  useEffect(() => {
    const fetchLectures = async () => {
      if (!selectedFolderId) {
        setLectures([]);
        setSelectedFolderName("");
        return;
      }

      setIsLoadingLectures(true);
      try {
        const response = await getLectureListByFolderAPI(selectedFolderId);
        setLectures(response.lectureList);

        // 폴더 이름 찾기
        const folder = folders.find((f) => f.folderId === selectedFolderId);
        if (folder) {
          setSelectedFolderName(folder.folderName);
        }
      } catch (error) {
        console.error("강의 목록 조회 실패:", error);
        toast.error("강의 목록을 불러오는데 실패했습니다.");
        setLectures([]);
      } finally {
        setIsLoadingLectures(false);
      }
    };

    fetchLectures();
  }, [selectedFolderId, folders]);

  // 페이지로 돌아왔을 때 강의 목록 새로고침
  useEffect(() => {
    if (location.pathname === "/home" && selectedFolderId) {
      const fetchLectures = async () => {
        try {
          const response = await getLectureListByFolderAPI(selectedFolderId);
          setLectures(response.lectureList);
        } catch (error) {
          console.error("강의 목록 새로고침 실패:", error);
        }
      };
      fetchLectures();
    }
  }, [location.pathname, selectedFolderId]);

  // 폴더 선택 핸들러
  const handleFolderSelect = (folderId: number | null) => {
    setSelectedFolderId(folderId);
  };

  return (
    <div className="flex h-screen bg-white overflow-hidden relative">
      <Sidebar
        selectedFolderId={selectedFolderId}
        onFolderSelect={handleFolderSelect}
        refreshTrigger={folderRefreshTrigger}
        onCreateFolderClick={() => setIsCreateFolderModalOpen(true)}
      />

      {/* 메인 콘텐츠 */}
      <div className="flex-1 flex flex-col overflow-hidden bg-white relative">
        {/* 헤더 */}
        <header className="bg-white px-8 py-4 flex items-center justify-between border-b border-gray-200">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-Pretendard font-semibold text-gray-900">
              {t.sidebar.home}
            </h1>
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
        <main className="flex-1 flex flex-col overflow-hidden bg-white relative">
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

          {/* 폴더가 선택된 경우 강의 목록 표시 */}
          {selectedFolderId ? (
            <div className="flex-1 overflow-y-auto p-8">
              <div className="max-w-6xl mx-auto">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-2xl font-Pretendard font-semibold text-gray-900">
                    {selectedFolderName || "강의 목록"}
                  </h2>
                  <button
                    onClick={() => setSelectedFolderId(null)}
                    className="px-4 py-2 text-sm font-Pretendard text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    ← 뒤로가기
                  </button>
                </div>

                {isLoadingLectures ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-gray-500 font-Pretendard">
                      로딩 중...
                    </div>
                  </div>
                ) : lectures.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <p className="text-gray-500 font-Pretendard mb-4">
                      이 폴더에 강의가 없습니다.
                    </p>
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-Pretendard text-sm"
                    >
                      강의 업로드
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {lectures.map((lecture) => (
                      <button
                        key={lecture.lectureId}
                        onClick={() => {
                          navigate(`/home/content/${lecture.lectureId}`);
                        }}
                        className="text-left p-6 bg-white border border-gray-200 rounded-lg hover:border-primary hover:shadow-md transition-all"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-lg font-Pretendard font-semibold text-gray-900 line-clamp-2">
                            {lecture.title}
                          </h3>
                          <svg
                            className="w-5 h-5 text-gray-400 shrink-0 ml-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </div>
                        <p className="text-sm text-gray-500 font-Pretendard">
                          강의 상세 보기
                        </p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* 폴더가 선택되지 않은 경우 업로드 영역 표시 */
            <div
              className={`relative flex flex-col items-center justify-center w-full h-full border-2 border-dashed rounded-lg transition-all duration-300 m-8 ${
                isDragging || isHovering
                  ? "border-primary bg-primary/10 backdrop-blur-sm"
                  : "border-gray-300 bg-gray-50"
              } ${isUploading || isUploadComplete ? "opacity-30" : ""}`}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              onDragEnter={(e) => {
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
                e.preventDefault();
                e.stopPropagation();
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsDragging(false);

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
                className="relative z-10 flex flex-col items-center justify-center p-12 cursor-pointer"
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
                    isHovering || isDragging
                      ? "text-primary/70"
                      : "text-gray-400"
                  }`}
                >
                  {t.uploadArea.description}
                </p>
              </label>
              <input
                id="file-upload-drop"
                type="file"
                accept="audio/*,video/*,.mp3,.mp4,.wav"
                className="hidden"
                onChange={(e) => {
                  const files = e.target.files;
                  if (files && files.length > 0) {
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
          )}
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
          key={isModalOpen ? "open" : "closed"}
          isOpen={isModalOpen}
          refreshTrigger={folderRefreshTrigger}
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
          onConfirm={async (classTitle, files, folderId) => {
            if (!user || !user.id) {
              toast.error("로그인이 필요합니다.");
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
                folderId
              );

              // 업로드한 폴더를 자동으로 선택
              if (folderId) {
                setSelectedFolderId(folderId);

                // 폴더 목록이 없으면 먼저 가져오기
                if (folders.length === 0) {
                  try {
                    const folderList = await getFoldersAPI(user.id);
                    const updatedFolders = folderList.map((folder) => ({
                      folderId: folder.folderId,
                      folderName: folder.folderName,
                    }));
                    setFolders(updatedFolders);

                    // 폴더 이름 설정
                    const folder = updatedFolders.find(
                      (f) => f.folderId === folderId
                    );
                    if (folder) {
                      setSelectedFolderName(folder.folderName);
                    }
                  } catch (error) {
                    console.error("폴더 목록 조회 실패:", error);
                  }
                } else {
                  // 폴더 이름 설정
                  const folder = folders.find((f) => f.folderId === folderId);
                  if (folder) {
                    setSelectedFolderName(folder.folderName);
                  }
                }

                // 강의 목록 새로고침
                try {
                  const lectureResponse = await getLectureListByFolderAPI(
                    folderId
                  );
                  setLectures(lectureResponse.lectureList);
                } catch (error) {
                  console.error("강의 목록 새로고침 실패:", error);
                }
              }

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

              toast.error(errorMessage);
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
