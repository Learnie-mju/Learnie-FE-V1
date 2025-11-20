import { useState, useEffect } from "react";

const QuizSkeleton = () => {
  const [loadingStep, setLoadingStep] = useState(0);
  const loadingMessages = [
    "강의 내용을 분석하고 있습니다...",
    "문제를 생성하고 있습니다...",
    "난이도를 조정하고 있습니다...",
    "최종 검토 중입니다...",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingStep((prev) => (prev + 1) % loadingMessages.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* 퀴즈 생성 중 메시지 - 개선된 버전 */}
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

      {/* 스켈레톤 테이블 - 개선된 버전 */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        <table className="w-full border-collapse">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-Pretendard font-semibold text-gray-700 uppercase border-b border-gray-200">
                퀴즈 번호
              </th>
              <th className="px-4 py-3 text-left text-xs font-Pretendard font-semibold text-gray-700 uppercase border-b border-gray-200">
                문제 개수
              </th>
              <th className="px-4 py-3 text-left text-xs font-Pretendard font-semibold text-gray-700 uppercase border-b border-gray-200">
                난이도
              </th>
              <th className="px-4 py-3 text-left text-xs font-Pretendard font-semibold text-gray-700 uppercase border-b border-gray-200">
                생성일
              </th>
              <th className="px-4 py-3 text-left text-xs font-Pretendard font-semibold text-gray-700 uppercase border-b border-gray-200">
                다운로드
              </th>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3].map((index) => (
              <tr
                key={index}
                className={`transition-colors ${
                  index !== 3 ? "border-b border-gray-200" : ""
                } ${index % 2 === 0 ? "bg-gray-50/50" : "bg-white"}`}
              >
                <td className="px-4 py-4">
                  <div 
                    className="h-4 w-8 bg-gray-200 rounded relative overflow-hidden"
                    style={{
                      background: "linear-gradient(90deg, #e5e7eb 25%, #d1d5db 50%, #e5e7eb 75%)",
                      backgroundSize: "200% 100%",
                      animation: `shimmer 2s infinite`,
                      animationDelay: `${index * 0.1}s`,
                    }}
                  ></div>
                </td>
                <td className="px-4 py-4">
                  <div 
                    className="h-4 w-12 bg-gray-200 rounded relative overflow-hidden"
                    style={{
                      background: "linear-gradient(90deg, #e5e7eb 25%, #d1d5db 50%, #e5e7eb 75%)",
                      backgroundSize: "200% 100%",
                      animation: `shimmer 2s infinite`,
                      animationDelay: `${index * 0.15}s`,
                    }}
                  ></div>
                </td>
                <td className="px-4 py-4">
                  <div 
                    className="h-4 w-16 bg-gray-200 rounded relative overflow-hidden"
                    style={{
                      background: "linear-gradient(90deg, #e5e7eb 25%, #d1d5db 50%, #e5e7eb 75%)",
                      backgroundSize: "200% 100%",
                      animation: `shimmer 2s infinite`,
                      animationDelay: `${index * 0.2}s`,
                    }}
                  ></div>
                </td>
                <td className="px-4 py-4">
                  <div 
                    className="h-4 w-24 bg-gray-200 rounded relative overflow-hidden"
                    style={{
                      background: "linear-gradient(90deg, #e5e7eb 25%, #d1d5db 50%, #e5e7eb 75%)",
                      backgroundSize: "200% 100%",
                      animation: `shimmer 2s infinite`,
                      animationDelay: `${index * 0.25}s`,
                    }}
                  ></div>
                </td>
                <td className="px-4 py-4">
                  <div 
                    className="h-4 w-16 bg-gray-200 rounded relative overflow-hidden"
                    style={{
                      background: "linear-gradient(90deg, #e5e7eb 25%, #d1d5db 50%, #e5e7eb 75%)",
                      backgroundSize: "200% 100%",
                      animation: `shimmer 2s infinite`,
                      animationDelay: `${index * 0.3}s`,
                    }}
                  ></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 하단 안내 메시지 */}
      <div className="text-center">
        <p className="text-sm text-gray-500 font-Pretendard">
          잠시만 기다려주세요. AI가 최적의 문제를 생성하고 있습니다.
        </p>
      </div>
    </div>
  );
};

export default QuizSkeleton;

