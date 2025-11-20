import { useState } from "react";
import { useLanguage, translations } from "../../../store/useLanguageStore";
import { useAuth } from "../../../store/useAuthStore";

const Sidebar = () => {
  const { language } = useLanguage();
  const { logout } = useAuth();
  const t = translations[language];
  const [isCoursesOpen, setIsCoursesOpen] = useState(false);

  // 임시 강의 목록 (실제로는 API에서 가져옴)
  const courses = [
    "콘텐츠 스토리 텔링",
    "게임 엔진 1",
    "역사와 문명",
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col">
      {/* 로고 */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-Pretendard font-semibold text-primary">
          LOGO
        </h1>
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
              <ul className="mt-2 ml-8 space-y-1">
                {courses.map((course, index) => (
                  <li key={index}>
                    <a
                      href={`/course/${index}`}
                      className="block px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded transition-colors"
                    >
                      {course}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </li>
        </ul>
      </nav>

      {/* 로그아웃 */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={logout}
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
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          {t.home.sidebar.logout}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

