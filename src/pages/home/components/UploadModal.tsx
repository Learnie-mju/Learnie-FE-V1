import { useState, useEffect } from "react";
import { useLanguage, translations } from "../../../store/useLanguageStore";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (classTitle: string, files: File[]) => void;
  files: File[];
}

const UploadModal = ({ isOpen, onClose, onConfirm, files }: UploadModalProps) => {
  const { language } = useLanguage();
  const t = translations[language].home.uploadModal;
  const [classTitle, setClassTitle] = useState("");

  useEffect(() => {
    if (isOpen) {
      setClassTitle("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (classTitle.trim() && files.length > 0) {
      onConfirm(classTitle.trim(), files);
      onClose();
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 w-full max-w-md shadow-xl">
        {/* 파일 정보 */}
        <div className="mb-4">
          <div className="bg-gray-100 border border-gray-300 rounded px-4 py-3 min-h-[60px] flex flex-col justify-center">
            <p className="text-gray-600 text-sm font-Pretendard mb-2">{t.fileInfo}</p>
            <div className="space-y-1">
              {files.map((file, index) => (
                <div key={index} className="text-gray-800 text-sm font-Pretendard">
                  <span className="font-medium">{file.name}</span>
                  <span className="text-gray-500 ml-2">({formatFileSize(file.size)})</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 수업 제목 입력 */}
        <div className="mb-6">
          <input
            type="text"
            value={classTitle}
            onChange={(e) => setClassTitle(e.target.value)}
            placeholder={t.classTitle}
            className="w-full border border-gray-300 rounded px-4 py-3 text-gray-800 font-Pretendard focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        {/* 버튼 */}
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded text-gray-700 font-Pretendard font-medium hover:bg-gray-50 transition-colors"
          >
            {t.cancel}
          </button>
          <button
            onClick={handleConfirm}
            disabled={!classTitle.trim() || files.length === 0}
            className="px-6 py-2 border border-gray-300 rounded text-gray-700 font-Pretendard font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t.confirm}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadModal;

