import { useLanguage, translations } from "../../../store/useLanguageStore";

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteAccountModal = ({
  isOpen,
  onClose,
  onConfirm,
}: DeleteAccountModalProps) => {
  const { language } = useLanguage();
  const t = translations[language].userMenu;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 w-full max-w-md shadow-xl">
        <div className="mb-6">
          <h3 className="text-xl font-Pretendard font-semibold text-gray-900 mb-2">
            {t.deleteAccountModal.title}
          </h3>
          <p className="text-gray-600 font-Pretendard text-sm">
            {t.deleteAccountModal.message}
          </p>
        </div>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-700 font-Pretendard font-medium hover:bg-gray-50 transition-colors"
          >
            {t.deleteAccountModal.cancel}
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2.5 bg-red-600 text-white rounded-lg font-Pretendard font-medium hover:bg-red-700 transition-colors"
          >
            {t.deleteAccountModal.confirm}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccountModal;

