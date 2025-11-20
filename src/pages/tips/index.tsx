import { useState, useEffect } from "react";
import { useLanguage } from "../../store/useLanguageStore";
import { getTipsAPI, type TipResponse } from "../../api/tips";
import Sidebar from "../home/components/Sidebar";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

// 카테고리별로 그룹화된 Tip 데이터 타입
interface GroupedTip {
  category: string;
  indexes: Array<{
    idx: string;
    contents: string[];
  }>;
}

const TipsPage = () => {
  const { language } = useLanguage();
  const [tips, setTips] = useState<GroupedTip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedIdx, setSelectedIdx] = useState<string>("");
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set()
  );
  const [expandedIndexes, setExpandedIndexes] = useState<Set<string>>(
    new Set()
  );

  // API에서 데이터 가져오기
  useEffect(() => {
    const fetchTips = async () => {
      setIsLoading(true);
      // 에러 발생 시를 대비해 상태 초기화
      setTips([]);
      setSelectedCategory("");
      setSelectedIdx("");
      setExpandedCategories(new Set());
      setExpandedIndexes(new Set());

      try {
        // 언어 코드를 그대로 전달 (KR, EN, CN, JP, VI 형식)
        const response = await getTipsAPI(language);

        // API 응답 확인을 위한 콘솔 출력
        console.log("[TipsPage] Tips API 응답:", response);
        console.log("[TipsPage] 응답 타입:", typeof response);
        console.log("[TipsPage] 배열 여부:", Array.isArray(response));
        console.log("[TipsPage] 응답 구조:", JSON.stringify(response, null, 2));

        // 응답이 없거나 빈 경우 처리
        if (
          !response ||
          (typeof response === "object" && Object.keys(response).length === 0)
        ) {
          console.warn("[TipsPage] Tips 응답이 비어있습니다.");
          setTips([]);
          toast.error("Tips 데이터가 없습니다.");
          return;
        }

        // 응답 구조: 카테고리별로 이미 그룹화된 객체 형태
        // { "맛집": [...], "학교 생활 팁": [...], "유학생활 팁": [...] }
        let groupedArray: GroupedTip[] = [];

        if (
          response &&
          typeof response === "object" &&
          !Array.isArray(response)
        ) {
          // 객체의 각 키가 카테고리명이고 값이 배열인 구조
          const responseObj = response as Record<string, TipResponse[]>;

          groupedArray = Object.keys(responseObj)
            .sort()
            .map((category) => {
              // 각 카테고리 내에서 idx별로 그룹화
              const idxGroups: Record<string, string[]> = {};

              responseObj[category].forEach((tip) => {
                if (!idxGroups[tip.idx]) {
                  idxGroups[tip.idx] = [];
                }
                idxGroups[tip.idx].push(tip.content);
              });

              // idx별로 정렬하고 contents 배열로 변환
              const indexes = Object.keys(idxGroups)
                .sort()
                .map((idx) => ({
                  idx,
                  contents: idxGroups[idx],
                }));

              return {
                category,
                indexes,
              };
            });
        } else if (Array.isArray(response)) {
          // 배열 형태인 경우 (하위 호환성)
          const categoryGroups: Record<string, Record<string, string[]>> = {};

          response.forEach((tip) => {
            if (!categoryGroups[tip.category]) {
              categoryGroups[tip.category] = {};
            }
            if (!categoryGroups[tip.category][tip.idx]) {
              categoryGroups[tip.category][tip.idx] = [];
            }
            categoryGroups[tip.category][tip.idx].push(tip.content);
          });

          groupedArray = Object.keys(categoryGroups)
            .sort()
            .map((category) => {
              const indexes = Object.keys(categoryGroups[category])
                .sort()
                .map((idx) => ({
                  idx,
                  contents: categoryGroups[category][idx],
                }));

              return {
                category,
                indexes,
              };
            });
        } else {
          console.error("[TipsPage] Tips 응답이 올바르지 않습니다:", response);
          toast.error("Tips 데이터 형식이 올바르지 않습니다.");
          setTips([]);
          return;
        }

        // 빈 배열인 경우 처리
        if (groupedArray.length === 0) {
          console.warn("[TipsPage] 그룹화된 Tips가 없습니다.");
          setTips([]);
          toast.error("Tips 데이터가 없습니다.");
          return;
        }

        setTips(groupedArray);

        // 첫 번째 카테고리와 첫 번째 인덱스 선택
        if (groupedArray.length > 0) {
          const firstCategory = groupedArray[0].category;
          const firstIdx = groupedArray[0].indexes[0]?.idx || "";
          setSelectedCategory(firstCategory);
          setSelectedIdx(firstIdx);
          setExpandedCategories(new Set([firstCategory]));
          if (firstIdx) {
            setExpandedIndexes(new Set([`${firstCategory}-${firstIdx}`]));
          }
        }
      } catch (error) {
        const axiosError = error as AxiosError;
        console.error("[TipsPage] Tips 조회 실패:", axiosError);

        // 에러 발생 시 상태 초기화
        setTips([]);
        setSelectedCategory("");
        setSelectedIdx("");
        setExpandedCategories(new Set());
        setExpandedIndexes(new Set());

        // 상세한 에러 정보 로깅
        const errorData = axiosError?.response?.data as
          | { message?: string }
          | undefined;
        const errorMessage =
          errorData?.message || axiosError?.message || "알 수 없는 오류";
        const errorStatus = axiosError?.response?.status;
        const errorUrl = axiosError?.config?.url || axiosError?.config?.baseURL;

        console.error("[TipsPage] Tips API 에러 상세:", {
          message: errorMessage,
          status: errorStatus,
          url: errorUrl,
          fullError: axiosError,
        });

        // 사용자에게 더 구체적인 에러 메시지 표시
        if (errorStatus === 404) {
          toast.error("Tips를 찾을 수 없습니다.");
        } else if (errorStatus === 500) {
          toast.error("서버 오류가 발생했습니다.");
        } else if (
          axiosError?.code === "NETWORK_ERROR" ||
          axiosError?.message?.includes("Network") ||
          axiosError?.message?.includes("timeout")
        ) {
          toast.error("네트워크 연결을 확인해주세요.");
        } else {
          toast.error(
            `Tips를 불러오는데 실패했습니다. (${errorStatus || "오류"})`
          );
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchTips();
  }, [language]);

  const currentCategory = tips.find((cat) => cat.category === selectedCategory);
  const currentIndex = currentCategory?.indexes.find(
    (index) => index.idx === selectedIdx
  );

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  const toggleIndex = (category: string, idx: string) => {
    const indexKey = `${category}-${idx}`;
    setExpandedIndexes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(indexKey)) {
        newSet.delete(indexKey);
      } else {
        newSet.add(indexKey);
      }
      return newSet;
    });
  };

  const isCategoryExpanded = (category: string) => {
    return expandedCategories.has(category);
  };

  const isIndexExpanded = (category: string, idx: string) => {
    return expandedIndexes.has(`${category}-${idx}`);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen bg-white overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-gray-500 font-Pretendard">로딩 중...</div>
        </div>
      </div>
    );
  }

  // 로딩이 끝났는데 tips가 비어있는 경우
  if (!isLoading && tips.length === 0) {
    return (
      <div className="flex h-screen bg-white overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-gray-500 font-Pretendard mb-2">
              Tips 데이터를 불러올 수 없습니다.
            </div>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-Pretendard text-sm"
            >
              새로고침
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      <Sidebar />

      {/* 메인 콘텐츠 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 왼쪽: 목차 (나무위키 스타일) */}
        <div className="w-64 bg-gray-50 border-r border-gray-200 overflow-y-auto">
          <div className="p-4">
            <h2 className="text-lg font-Pretendard font-semibold text-gray-900 mb-4 mt-4">
              Index
            </h2>
            <nav className="space-y-2">
              {tips.map((categoryData) => {
                const isExpanded = isCategoryExpanded(categoryData.category);
                const isSelected = selectedCategory === categoryData.category;

                return (
                  <div key={categoryData.category} className="mb-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleCategory(categoryData.category)}
                        className="shrink-0 w-6 h-6 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors"
                        aria-label={isExpanded ? "접기" : "펼치기"}
                      >
                        <svg
                          className={`w-4 h-4 transition-transform ${
                            isExpanded ? "rotate-90" : ""
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => {
                          setSelectedCategory(categoryData.category);
                          const firstIdx = categoryData.indexes[0]?.idx || "";
                          setSelectedIdx(firstIdx);
                          // 카테고리 선택 시 자동으로 펼치기
                          if (!isExpanded) {
                            setExpandedCategories((prev) =>
                              new Set(prev).add(categoryData.category)
                            );
                          }
                        }}
                        className={`flex-1 text-left px-3 py-2 rounded-md text-sm font-Pretendard transition-colors ${
                          isSelected
                            ? "bg-primary/10 text-primary font-semibold"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {categoryData.category}
                      </button>
                    </div>
                    {isExpanded && (
                      <ul className="mt-2 ml-8 space-y-1">
                        {categoryData.indexes.map((indexData) => {
                          const isIdxExpanded = isIndexExpanded(
                            categoryData.category,
                            indexData.idx
                          );
                          const isIdxSelected = selectedIdx === indexData.idx;

                          return (
                            <li key={indexData.idx}>
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() =>
                                    toggleIndex(
                                      categoryData.category,
                                      indexData.idx
                                    )
                                  }
                                  className="shrink-0 w-4 h-4 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
                                  aria-label={isIdxExpanded ? "접기" : "펼치기"}
                                >
                                  <svg
                                    className={`w-3 h-3 transition-transform ${
                                      isIdxExpanded ? "rotate-90" : ""
                                    }`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M9 5l7 7-7 7"
                                    />
                                  </svg>
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedIdx(indexData.idx);
                                    if (!isIdxExpanded) {
                                      toggleIndex(
                                        categoryData.category,
                                        indexData.idx
                                      );
                                    }
                                  }}
                                  className={`flex-1 text-left px-2 py-1.5 rounded-md text-xs font-Pretendard transition-colors ${
                                    isIdxSelected
                                      ? "bg-primary/5 text-primary font-medium"
                                      : "text-gray-600 hover:bg-gray-50"
                                  }`}
                                >
                                  {indexData.idx}
                                </button>
                              </div>
                              {isIdxExpanded && (
                                <ul className="mt-1 ml-6 space-y-0.5">
                                  {indexData.contents.map(
                                    (content, contentIdx) => (
                                      <li key={contentIdx}>
                                        <button
                                          onClick={() =>
                                            setSelectedIdx(indexData.idx)
                                          }
                                          className="w-full text-left px-2 py-1 rounded text-xs text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors line-clamp-2"
                                        >
                                          {content}
                                        </button>
                                      </li>
                                    )
                                  )}
                                </ul>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>
        </div>

        {/* 오른쪽: 내용 */}
        <div className="flex-1 overflow-y-auto bg-white">
          <div className="max-w-4xl mx-auto p-8">
            {currentIndex && (
              <article className="prose prose-sm max-w-none font-Pretendard">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">
                  {currentIndex.idx}
                </h1>
                <div className="space-y-4">
                  {currentIndex.contents.map((content, index) => (
                    <div
                      key={index}
                      className="text-gray-700 leading-relaxed whitespace-pre-wrap p-4 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      {content.split("\n").map((line, lineIndex) => {
                        if (line.startsWith("## ")) {
                          return (
                            <h2
                              key={lineIndex}
                              className="text-2xl font-semibold mt-6 mb-4 text-gray-900 border-b border-gray-200 pb-2"
                            >
                              {line.substring(3)}
                            </h2>
                          );
                        }
                        if (line.startsWith("### ")) {
                          return (
                            <h3
                              key={lineIndex}
                              className="text-xl font-semibold mt-4 mb-3 text-gray-800"
                            >
                              {line.substring(4)}
                            </h3>
                          );
                        }
                        if (line.startsWith("- ")) {
                          return (
                            <li key={lineIndex} className="ml-6 mb-2 list-disc">
                              {line.substring(2)}
                            </li>
                          );
                        }
                        if (line.trim() === "") {
                          return <br key={lineIndex} />;
                        }
                        return (
                          <p key={lineIndex} className="mb-2">
                            {line}
                          </p>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </article>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TipsPage;
