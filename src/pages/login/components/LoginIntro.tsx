import { useEffect, useState } from "react";
import { useLanguage, translations } from "../../../store/useLanguageStore";

// 각 메시지가 나타나는 딜레이 (밀리초)
const DELAY_BETWEEN_MESSAGES = 600;

const LANGUAGE_OPTIONS = [
  { code: "KR" as const, label: "한국어" },
  { code: "CN" as const, label: "中文" },
  { code: "EN" as const, label: "English" },
  { code: "JP" as const, label: "日本語" },
  { code: "VI" as const, label: "Tiếng Việt" },
] as const;

const LoginIntro = () => {
  const { language, setLanguage } = useLanguage();
  const [visibleMessages, setVisibleMessages] = useState<number[]>([]);
  const [showSlogan, setShowSlogan] = useState(false);
  const [hideSlogan, setHideSlogan] = useState(false);

  const messages = translations[language].intro;

  // 슬로건 애니메이션 및 전환
  useEffect(() => {
    // 슬로건 표시
    const showTimer = setTimeout(() => {
      setShowSlogan(true);
    }, 300);

    // 슬로건이 표시된 후 일정 시간 후 사라지고 단계 시작
    const hideTimer = setTimeout(() => {
      setHideSlogan(true);
    }, 2500); // 2.5초 후 슬로건 페이드아웃 시작

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  // 메시지 애니메이션 (언어 변경 시 key prop으로 컴포넌트가 재마운트되므로 자동 초기화됨)
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    // 슬로건이 사라지기 시작할 때 메시지들을 순차적으로 표시
    messages.forEach((_, index) => {
      const timer = setTimeout(() => {
        setVisibleMessages((prev) => {
          if (!prev.includes(index)) {
            return [...prev, index];
          }
          return prev;
        });
      }, 2800 + index * DELAY_BETWEEN_MESSAGES); // 슬로건 페이드아웃 후 시작
      timers.push(timer);
    });

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, [messages]);

  return (
    <div className="text-gray-900 w-full bg-gradient-to-br from-white via-green-50/30 to-green-50/50 relative overflow-hidden">
      {/* 헤더 - 로고 및 언어 선택 */}
      <div className="absolute top-0 left-0 right-0 z-20 py-6 md:py-8 px-4 md:px-8 lg:px-16 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0">
        {/* 왼쪽 위 로고 */}
        <img
          src="/logoImage.png"
          alt="Orbit AI"
          className="h-8 md:h-10 lg:h-12 w-auto"
        />

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

      {/* 메인 콘텐츠 영역 */}
      <div className="h-full flex flex-col justify-center px-8 md:px-16 relative">
        {/* 슬로건 이미지 - 페이드아웃 애니메이션 (가운데 정렬) */}
        <div
          className={`absolute left-1/2 -translate-x-1/2 transition-all duration-1000 ${
            showSlogan && !hideSlogan
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 -translate-y-8 scale-95 pointer-events-none"
          }`}
        >
          <img
            src="/firstSection.png"
            alt="Orbit AI Slogan"
            className="h-auto w-auto max-w-4xl"
          />
        </div>

        {/* 안내 문구 영역 - 페이드인 애니메이션 (왼쪽 정렬) */}
        <div className="w-full max-w-3xl self-start">
          <div
            className={`space-y-5 md:space-y-6 w-full transition-all duration-1000 ${
              hideSlogan
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            {messages.map((message, index) => {
              const isVisible = visibleMessages.includes(index);
              return (
                <p
                  key={index}
                  className={`font-Pretendard font-bold text-lg md:text-xl lg:text-2xl leading-relaxed text-gray-700 text-left transition-all duration-700 ${
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
