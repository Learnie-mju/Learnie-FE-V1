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
  const [classTitle, setClassTitle] = useState("");
  const [folders, setFolders] = useState<FolderResponse[]>([]);
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);
  const [isLoadingFolders, setIsLoadingFolders] = useState(false);
  const [isCreateFolderModalOpen, setIsCreateFolderModalOpen] = useState(false);
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);

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
      // 폴더 목록 다시 조회
      const folderList = await getFoldersAPI(user.id);
      setFolders(folderList);
      // 생성된 폴더 자동 선택
      setSelectedFolderId(newFolder.folderId);
      toast.success("폴더가 생성되었습니다.");
    } catch (error) {
      console.error("폴더 생성 실패:", error);
      toast.error("폴더 생성에 실패했습니다.");
    } finally {
      setIsCreatingFolder(false);
    }
  };

  if (!isOpen) return null;

  // 최대 파일 크기 (100MB)
  const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

  const handleConfirm = () => {
    if (!selectedFolderId) {
      toast.error("먼저 폴더를 선택하거나 생성해주세요.");
      return;
    }

    if (!classTitle.trim()) {
      toast.error("제목을 입력해주세요.");
      return;
    }

    if (files.length === 0) {
      toast.error("파일을 선택해주세요.");
      return;
    }

    // 파일 크기 검증
    const oversizedFiles = files.filter((file) => file.size > MAX_FILE_SIZE);
    if (oversizedFiles.length > 0) {
      const fileNames = oversizedFiles.map((f) => f.name).join(", ");
      toast.error(
        `다음 파일의 크기가 너무 큽니다 (최대 ${
          MAX_FILE_SIZE / (1024 * 1024)
        }MB):\n${fileNames}`
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
          <label className="block text-sm font-Pretendard text-gray-700 mb-2">
            {translations[language].home.folder.folderName}
          </label>
          <div className="flex gap-2">
            <select
              value={selectedFolderId || ""}
              onChange={(e) =>
                setSelectedFolderId(
                  e.target.value ? Number(e.target.value) : null
                )
              }
              className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-gray-800 font-Pretendard focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">폴더를 선택하세요</option>
              {isLoadingFolders ? (
                <option disabled>로딩 중...</option>
              ) : folders.length === 0 ? (
                <option disabled>폴더가 없습니다</option>
              ) : (
                folders.map((folder) => (
                  <option key={folder.folderId} value={folder.folderId}>
                    {folder.folderName}
                  </option>
                ))
              )}
            </select>
            <button
              onClick={() => setIsCreateFolderModalOpen(true)}
              className="px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-Pretendard text-sm font-medium whitespace-nowrap"
            >
              + {translations[language].home.folder.create}
            </button>
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
