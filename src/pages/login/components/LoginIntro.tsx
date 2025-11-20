import { useEffect, useState } from "react";
import { useLanguage, translations } from "../../../store/useLanguageStore";

// 각 메시지가 나타나는 딜레이 (밀리초)
const DELAY_BETWEEN_MESSAGES = 600;

const LANGUAGE_OPTIONS = [
  { code: "ko" as const, label: "한국어" },
  { code: "en" as const, label: "English" },
  { code: "zh" as const, label: "中文" },
  { code: "ja" as const, label: "日本語" },
  { code: "vi" as const, label: "Tiếng Việt" },
  { code: "mn" as const, label: "Монгол" },
] as const;

const LoginIntro = () => {
  const { language, setLanguage } = useLanguage();
  const [visibleMessages, setVisibleMessages] = useState<number[]>([]);

  const messages = translations[language].intro;
  const title = translations[language].title;

  // 메시지 애니메이션 (언어 변경 시 key prop으로 컴포넌트가 재마운트되므로 자동 초기화됨)
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    // 각 메시지를 순차적으로 표시
    messages.forEach((_, index) => {
      const timer = setTimeout(() => {
        setVisibleMessages((prev) => {
          if (!prev.includes(index)) {
            return [...prev, index];
          }
          return prev;
        });
      }, index * DELAY_BETWEEN_MESSAGES);
      timers.push(timer);
    });

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, [messages]);

  return (
    <div className="text-gray-900 w-full bg-white relative overflow-hidden">
      {/* 헤더 - Orbit 및 언어 선택 */}
      <div className="absolute top-0 left-0 right-0 z-20 py-6 md:py-8 px-4 md:px-8 lg:px-16 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0 bg-white/80 backdrop-blur-sm">
        <h1 className="text-xl md:text-2xl lg:text-3xl font-Pretendard font-semibold text-gray-900">
          {title}
        </h1>

        {/* 언어 선택 버튼 */}
        <div className="flex flex-wrap gap-2">
          {LANGUAGE_OPTIONS.map((option) => (
            <button
              key={option.code}
              onClick={() => setLanguage(option.code)}
              className={`px-3 py-1.5 rounded-md text-xs md:text-sm font-medium transition-all whitespace-nowrap ${
                language === option.code
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* 안내 문구 영역 */}
      <div className="h-full flex flex-col justify-center px-8 md:px-16 items-start">
        <div className="flex flex-col relative justify-start items-start w-full max-w-3xl">
          <div className="space-y-5 md:space-y-6">
            {messages.map((message, index) => {
              const isVisible = visibleMessages.includes(index);
              return (
                <p
                  key={index}
                  className={`font-Pretendard font-normal text-lg md:text-xl lg:text-2xl leading-relaxed text-gray-700 transition-all duration-700 ${
                    isVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-4"
                  }`}
                >
                  {message}
                </p>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginIntro;
