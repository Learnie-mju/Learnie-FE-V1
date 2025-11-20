import { useState, useEffect } from "react";
import { useLanguage, translations } from "../../../store/useLanguageStore";
import { useAuth } from "../../../store/useAuthStore";
import {
  getFoldersAPI,
  createFolderAPI,
  type FolderResponse,
} from "../../../api/folder";
import toast from "react-hot-toast";
import CreateFolderModal from "./CreateFolderModal";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (classTitle: string, files: File[], folderId: number) => void;
  files: File[];
  refreshTrigger?: number;
}

const UploadModal = ({
  isOpen,
  onClose,
  onConfirm,
  files,
  refreshTrigger,
}: UploadModalProps) => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const t = translations[language].home.uploadModal;
  const toastT = translations[language].toast;
  const [classTitle, setClassTitle] = useState("");
  const [folders, setFolders] = useState<FolderResponse[]>([]);
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);
  const [selectedFolderName, setSelectedFolderName] = useState<string>("");
  const [isLoadingFolders, setIsLoadingFolders] = useState(false);
  const [isCreateFolderModalOpen, setIsCreateFolderModalOpen] = useState(false);
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [isFolderListOpen, setIsFolderListOpen] = useState(false);

  // 폴더 목록 조회
  useEffect(() => {
    const fetchFolders = async () => {
      if (!user?.id || !isOpen) return;

      setIsLoadingFolders(true);
      try {
        const folderList = await getFoldersAPI(user.id);
        setFolders(folderList);
      } catch (error) {
        console.error("폴더 목록 조회 실패:", error);
        setFolders([]);
      } finally {
        setIsLoadingFolders(false);
      }
    };

    fetchFolders();
  }, [user?.id, isOpen, refreshTrigger]);

  // 모달이 닫힐 때 상태 초기화
  useEffect(() => {
    if (!isOpen) {
      setClassTitle("");
      setSelectedFolderId(null);
      setSelectedFolderName("");
      setIsFolderListOpen(false);
    }
  }, [isOpen]);

  // 폴더 생성 핸들러
  const handleCreateFolder = async (folderName: string) => {
    if (!user?.id) {
      toast.error(toastT.loginRequired);
      return;
    }

    setIsCreatingFolder(true);
    try {
      const newFolder = await createFolderAPI(user.id, folderName);
      setIsCreateFolderModalOpen(false);
      // 폴더 목록 다시 조회
      const folderList = await getFoldersAPI(user.id);
      setFolders(folderList);
      // 생성된 폴더 자동 선택
      setSelectedFolderId(newFolder.folderId);
      setSelectedFolderName(newFolder.folderName);
      setIsFolderListOpen(false);
      toast.success(toastT.folderCreated);
    } catch (error) {
      console.error("폴더 생성 실패:", error);
      toast.error(toastT.folderCreationFailed);
    } finally {
      setIsCreatingFolder(false);
    }
  };

  if (!isOpen) return null;

  // 최대 파일 크기 (100MB)
  const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

  const handleConfirm = () => {
    if (!selectedFolderId) {
      toast.error(toastT.selectOrCreateFolder);
      return;
    }

    if (!classTitle.trim()) {
      toast.error(toastT.enterTitle);
      return;
    }

    if (files.length === 0) {
      toast.error(toastT.selectFile);
      return;
    }

    // 파일 크기 검증
    const oversizedFiles = files.filter((file) => file.size > MAX_FILE_SIZE);
    if (oversizedFiles.length > 0) {
      const fileNames = oversizedFiles.map((f) => f.name).join(", ");
      const toastMessages = toastT as Record<string, string>;
      toast.error(
        `${
          toastMessages.fileTooLarge ||
          "파일 크기가 너무 큽니다. 더 작은 파일을 업로드해주세요."
        } (최대 ${MAX_FILE_SIZE / (1024 * 1024)}MB):\n${fileNames}`
      );
      return;
    }

    onConfirm(classTitle.trim(), files, selectedFolderId);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 w-full max-w-md shadow-xl">
        {/* 파일 정보 - 점선 테두리 박스 */}
        <div className="mb-6">
          <div className="border-2 border-dashed border-primary/50 rounded-lg px-4 py-6 min-h-[80px] flex items-center justify-center bg-gray-50/50">
            {files.length > 0 ? (
              <div className="text-center w-full">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="text-primary font-Pretendard text-sm font-medium break-word"
                  >
                    {file.name}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-sm font-Pretendard">
                {t.fileInfo}
              </p>
            )}
          </div>
        </div>

        {/* 폴더 선택 */}
        <div className="mb-6">
          <div className="border border-gray-300 rounded-lg overflow-hidden">
            {/* 폴더 선택 헤더 */}
            <button
              onClick={() => setIsFolderListOpen(!isFolderListOpen)}
              className="w-full flex items-center justify-between px-4 py-3 bg-white hover:bg-gray-50 transition-colors"
            >
              <span className="text-gray-700 font-Pretendard text-sm">
                {selectedFolderName || t.selectFolder}
              </span>
              <svg
                className={`w-5 h-5 text-gray-400 transition-transform ${
                  isFolderListOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* 폴더 목록 */}
            {isFolderListOpen && (
              <div className="border-t border-gray-200 bg-white">
                {isLoadingFolders ? (
                  <div className="px-4 py-3 text-sm text-gray-400 text-center">
                    {t.loading}
                  </div>
                ) : folders.length === 0 ? (
                  <div className="px-4 py-3 text-sm text-gray-400 text-center">
                    {translations[language].home.folder.noFolders}
                  </div>
                ) : (
                  <div className="max-h-48 overflow-y-auto">
                    {folders.map((folder) => (
                      <button
                        key={folder.folderId}
                        onClick={() => {
                          setSelectedFolderId(folder.folderId);
                          setSelectedFolderName(folder.folderName);
                          setIsFolderListOpen(false);
                        }}
                        className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-center gap-2 ${
                          selectedFolderId === folder.folderId
                            ? "bg-primary/5 text-primary"
                            : "text-gray-700"
                        }`}
                      >
                        <svg
                          className="w-4 h-4 shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                          />
                        </svg>
                        <span className="font-Pretendard text-sm">
                          {folder.folderName}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
                {/* 폴더 추가 버튼 */}
                <button
                  onClick={() => {
                    setIsFolderListOpen(false);
                    setIsCreateFolderModalOpen(true);
                  }}
                  className="w-full text-left px-4 py-3 border-t border-gray-200 hover:bg-gray-50 transition-colors flex items-center gap-2 text-primary font-Pretendard text-sm"
                >
                  <span className="text-xl font-medium">+</span>
                  <span>{t.addFolder}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 수업 제목 입력 */}
        <div className="mb-6">
          <input
            type="text"
            value={classTitle}
            onChange={(e) => setClassTitle(e.target.value)}
            placeholder={t.classTitle}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 font-Pretendard focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        {/* 버튼 */}
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-700 font-Pretendard font-medium hover:bg-gray-50 transition-colors"
          >
            {t.cancel}
          </button>
          <button
            onClick={handleConfirm}
            disabled={
              !selectedFolderId || !classTitle.trim() || files.length === 0
            }
            className="px-6 py-2.5 bg-primary text-white rounded-lg font-Pretendard font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t.confirm}
          </button>
        </div>
      </div>

      {/* 폴더 생성 모달 */}
      <CreateFolderModal
        isOpen={isCreateFolderModalOpen}
        onClose={() => setIsCreateFolderModalOpen(false)}
        onConfirm={handleCreateFolder}
        isLoading={isCreatingFolder}
      />
    </div>
  );
};

export default UploadModal;
