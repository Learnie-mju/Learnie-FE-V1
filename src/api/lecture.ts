import axiosInstance from "./axiosInstance";

// 강의 업로드 요청
export interface LectureUploadRequest {
  file: File;
  request: {
    userId: number;
    title: string;
  };
}

// 강의 업로드 응답
export interface LectureUploadResponse {
  lectureId: number;
  title: string;
  content: string;
  summary: string;
}

// 폴더별 강의 목록 항목
export interface LectureListItem {
  lectureId: number;
  title: string;
}

// 폴더별 강의 목록 응답
export interface LectureListResponse {
  lectureList: LectureListItem[];
}

// 최대 파일 크기 (100MB)
const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB in bytes

// 강의 업로드 API
export const uploadLectureAPI = async (
  userId: number,
  title: string,
  file: File,
  folderId: number
): Promise<LectureUploadResponse> => {
  // 파일 크기 검증
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(
      `파일 크기가 너무 큽니다. 최대 ${
        MAX_FILE_SIZE / (1024 * 1024)
      }MB까지 업로드 가능합니다.`
    );
  }

  const formData = new FormData();

  // file: multipart/form-data로 추가
  formData.append("file", file);

  // request: JSON 객체를 Blob으로 변환하여 FormData에 추가
  const requestData = {
    userId: userId,
    folderId: folderId,
    title: title,
  };
  const requestBlob = new Blob([JSON.stringify(requestData)], {
    type: "application/json",
  });
  formData.append("request", requestBlob);

  // Content-Type 헤더를 명시적으로 설정하지 않음 (axios가 자동으로 boundary 포함하여 설정)
  // 파일 업로드는 시간이 오래 걸릴 수 있으므로 타임아웃 제거
  const response = await axiosInstance.post<LectureUploadResponse>(
    `/lectures`,
    formData,
    {
      timeout: 0, // 타임아웃 없음
    }
  );

  return response.data;
};

// 폴더별 강의 목록 조회 API
export const getLectureListByFolderAPI = async (
  folderId: number
): Promise<LectureListResponse> => {
  const response = await axiosInstance.get<LectureListResponse>(
    `/lectures/list/${folderId}`
  );
  return response.data;
};

// 강의 상세 조회 API
export const getLectureDetailAPI = async (
  lectureId: number
): Promise<LectureUploadResponse> => {
  const response = await axiosInstance.get<LectureUploadResponse>(
    `/lectures/${lectureId}`
  );
  return response.data;
};
