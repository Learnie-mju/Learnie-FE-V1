import { useState, useEffect } from "react";
import { useLanguage, translations } from "../../../store/useLanguageStore";

const UploadSkeleton = () => {
  const { language } = useLanguage();
  const t = translations[language].home.upload;
  
  const [loadingStep, setLoadingStep] = useState(0);
  const loadingMessages = [
    t.uploading,
    t.processing,
    t.translating,
    t.completing,
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingStep((prev) => (prev + 1) % loadingMessages.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* 업로드 중 메시지 - QuizSkeleton과 동일한 스타일 */}
      <div className="relative bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border border-primary/30 rounded-xl p-8 mb-6 overflow-hidden">
        {/* 배경 애니메이션 */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-32 h-32 bg-primary rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-primary rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
        </div>

        <div className="relative flex flex-col items-center gap-4">
          {/* 메인 로딩 스피너 */}
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary/20 border-t-primary"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 bg-primary/20 rounded-full animate-pulse"></div>
            </div>
          </div>

          {/* 단계별 메시지 */}
          <div className="text-center">
            <p className="text-primary font-Pretendard font-semibold text-lg mb-2">
              {loadingMessages[loadingStep]}
            </p>
            <div className="flex items-center justify-center gap-1 mt-3">
              {loadingMessages.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 rounded-full transition-all duration-500 ${
                    index === loadingStep
                      ? "w-8 bg-primary"
                      : index < loadingStep
                      ? "w-2 bg-primary/50"
                      : "w-2 bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* 진행 바 */}
          <div className="w-full max-w-md mt-2">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full animate-pulse"
                style={{
                  width: `${((loadingStep + 1) / loadingMessages.length) * 100}%`,
                  transition: "width 0.5s ease-in-out",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 하단 안내 메시지 */}
      <div className="text-center">
        <p className="text-sm text-gray-500 font-Pretendard">
          {t.waitMessage}
        </p>
      </div>
    </div>
  );
};

export default UploadSkeleton;
