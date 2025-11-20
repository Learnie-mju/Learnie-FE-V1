import { useState, useEffect } from "react";
import { useLanguage, translations } from "../../../store/useLanguageStore";

interface CreateFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (folderName: string) => void;
  isLoading?: boolean;
}

const CreateFolderModal = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}: CreateFolderModalProps) => {
  const { language } = useLanguage();
  const t = translations[language].home.folder;
  const [folderName, setFolderName] = useState("");

  useEffect(() => {
    if (isOpen) {
      setFolderName("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (!folderName.trim()) {
      alert(t.folderNamePlaceholder);
      return;
    }
    onConfirm(folderName.trim());
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 w-full max-w-md shadow-xl">
        {/* 제목 */}
        <h2 className="text-xl font-Pretendard font-semibold text-gray-900 mb-6">
          {t.createFolder}
        </h2>

        {/* 폴더 이름 입력 */}
        <div className="mb-6">
          <label className="block text-sm font-Pretendard text-gray-700 mb-2">
            {t.folderName}
          </label>
          <input
            type="text"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            placeholder={t.folderNamePlaceholder}
            disabled={isLoading}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 font-Pretendard focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !isLoading && folderName.trim()) {
                handleConfirm();
              }
            }}
          />
        </div>

        {/* 버튼 */}
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-6 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-700 font-Pretendard font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {translations[language].home.uploadModal.cancel}
          </button>
          <button
            onClick={handleConfirm}
            disabled={!folderName.trim() || isLoading}
            className="px-6 py-2.5 bg-primary text-white rounded-lg font-Pretendard font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? t.creating : t.create}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateFolderModal;

