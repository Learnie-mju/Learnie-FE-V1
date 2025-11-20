import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../store/useAuthStore";
import { useLanguage, translations } from "../../../store/useLanguageStore";
import toast from "react-hot-toast";
import DeleteAccountModal from "./DeleteAccountModal";

const UserMenu = () => {
  const { user, logout } = useAuth();
  const { language } = useLanguage();
  const t = translations[language].userMenu;
  const toastT = translations[language].toast;
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // 외부 클릭 시 메뉴 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleDeleteAccountClick = () => {
    setIsOpen(false);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteAccount = async () => {
    try {
      // TODO: 회원 삭제 API 호출
      // await deleteUserAPI();
      
      toast.success(toastT.accountDeleted);
      setIsDeleteModalOpen(false);
      await logout();
      navigate("/login", { replace: true });
    } catch (error) {
      toast.error(toastT.accountDeletionFailed);
      console.error("회원 삭제 실패:", error);
    }
  };

  const handleEditProfile = () => {
    // TODO: 회원 수정 모달 또는 페이지로 이동
    toast.success(toastT.editProfileComingSoon);
    setIsOpen(false);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="relative" ref={menuRef}>
      {/* 사용자 아이콘 버튼 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
          <svg
            className="w-5 h-5 text-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>
        <span className="text-sm font-Pretendard font-medium text-gray-700">
          {user.username}
        </span>
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform ${
            isOpen ? "rotate-180" : ""
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

      {/* 드롭다운 메뉴 */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
          <div className="px-4 py-2 border-b border-gray-200">
            <p className="text-sm font-Pretendard font-semibold text-gray-900">
              {user.username}
            </p>
            <p className="text-xs text-gray-500 font-Pretendard">
              {user.userId}
            </p>
          </div>
          
          <button
            onClick={handleEditProfile}
            className="w-full text-left px-4 py-2 text-sm font-Pretendard text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            {t.editProfile}
          </button>
          
          <button
            onClick={handleDeleteAccountClick}
            className="w-full text-left px-4 py-2 text-sm font-Pretendard text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            {t.deleteAccount}
          </button>
        </div>
      )}

      {/* 회원 삭제 모달 */}
      <DeleteAccountModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteAccount}
      />
    </div>
  );
};

export default UserMenu;

