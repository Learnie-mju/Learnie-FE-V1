import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage, translations } from "../../../store/useLanguageStore";
import { useAuth } from "../../../store/useAuthStore";
import { getFoldersAPI, type FolderResponse } from "../../../api/folder";

interface SidebarProps {
  selectedFolderId?: number | null;
  onFolderSelect?: (folderId: number | null) => void;
  refreshTrigger?: number; // 폴더 생성 후 새로고침을 위한 트리거
  onCreateFolderClick?: () => void; // 폴더 만들기 클릭 핸들러
}

const Sidebar = ({
  selectedFolderId,
  onFolderSelect,
  refreshTrigger,
  onCreateFolderClick,
}: SidebarProps) => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { user, logout } = useAuth();
  const t = translations[language];
  const [isCoursesOpen, setIsCoursesOpen] = useState(false);
  const [folders, setFolders] = useState<FolderResponse[]>([]);
  const [isLoadingFolders, setIsLoadingFolders] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);

  // 폴더 목록 조회
  useEffect(() => {
    const fetchFolders = async () => {
      if (!user?.id) return;

      setIsLoadingFolders(true);
      try {
        const folderList = await getFoldersAPI(user.id);
        setFolders(folderList);
      } catch (error) {
        console.error("폴더 목록 조회 실패:", error);
        // 에러 발생 시 빈 배열로 설정
        setFolders([]);
      } finally {
        setIsLoadingFolders(false);
      }
    };

    fetchFolders();
  }, [user?.id, refreshTrigger]); // refreshTrigger가 변경되면 폴더 목록 재조회

  // 우클릭 메뉴 닫기
  useEffect(() => {
    const handleClickOutside = () => {
      setContextMenu(null);
    };
    if (contextMenu) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [contextMenu]);

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col">
      {/* 로고 */}
      <div className="p-6 border-b border-gray-200">
        <button
          onClick={() => navigate("/home")}
          className="text-xl font-Pretendard font-semibold text-primary hover:text-primary/80 transition-colors cursor-pointer"
        >
          Orbit AI
        </button>
      </div>

      {/* 네비게이션 */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          <li>
            <a
              href="/home"
              className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary/10 text-primary font-medium transition-colors"
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
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              {t.home.sidebar.home}
            </a>
          </li>
          <li>
            <button
              onClick={() => setIsCoursesOpen(!isCoursesOpen)}
              onContextMenu={(e) => {
                e.preventDefault();
                setContextMenu({ x: e.clientX, y: e.clientY });
              }}
              className="flex items-center justify-between w-full px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
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
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
                {t.home.sidebar.courses}
              </div>
              <svg
                className={`w-4 h-4 transition-transform ${isCoursesOpen ? "rotate-180" : ""}`}
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
            {isCoursesOpen && (
              <div className="mt-2 ml-8">
                {isLoadingFolders ? (
                  <div className="px-4 py-2 text-sm text-gray-400">
                    로딩 중...
                  </div>
                ) : folders.length === 0 ? (
                  <div className="px-4 py-2 text-sm text-gray-400">
                    {t.home.folder.noFolders}
                  </div>
                ) : (
                  <ul className="space-y-1">
                    {folders.map((folder) => (
                      <li key={folder.folderId}>
                        <button
                          onClick={() => {
                            if (onFolderSelect) {
                              onFolderSelect(
                                selectedFolderId === folder.folderId
                                  ? null
                                  : folder.folderId
                              );
                            }
                          }}
                          className={`w-full text-left px-4 py-2 text-sm rounded transition-colors flex items-center gap-2 ${
                            selectedFolderId === folder.folderId
                              ? "bg-primary/10 text-primary font-medium"
                              : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                          }`}
                        >
                          <svg
                            className="w-4 h-4 flex-shrink-0"
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
                          <span className="truncate">{folder.folderName}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </li>
          <li>
            <a
              href="/tips"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
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
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343 5.657l-.707-.707m2.828-9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
              {t.home.sidebar.schoolTips}
            </a>
          </li>
        </ul>
      </nav>

      {/* 우클릭 메뉴 */}
      {contextMenu && (
        <div
          className="fixed bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-1 min-w-[150px]"
          style={{ left: contextMenu.x, top: contextMenu.y }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => {
              if (onCreateFolderClick) {
                onCreateFolderClick();
              }
              setContextMenu(null);
            }}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2"
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
                d="M12 4v16m8-8H4"
              />
            </svg>
            {t.home.folder.create}
          </button>
        </div>
      )}

      {/* 로그아웃 */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={async () => {
            await logout();
            navigate("/login", { replace: true });
          }}
          className="flex items-center gap-3 px-4 py-3 w-full text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
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
              d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-9.9-2.829a5 5 0 010-7.07m7.072 0a5 5 0 010 7.07M13 12a1 1 0 11-2 0 1 1 0 012 0z"
            />
          </svg>
          {t.home.sidebar.logout}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

