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
      `파일 크기가 너무 큽니다. 최대 ${MAX_FILE_SIZE / (1024 * 1024)}MB까지 업로드 가능합니다.`
    );
  }

  const formData = new FormData();
  formData.append("file", file);
  
  // request 객체의 각 필드를 개별적으로 FormData에 추가 (multipart/form-data)
  formData.append("request[userId]", userId.toString());
  formData.append("request[title]", title);
  formData.append("request[folderId]", folderId.toString());

  // Content-Type 헤더를 명시적으로 설정하지 않음 (axios가 자동으로 boundary 포함하여 설정)
  const response = await axiosInstance.post<LectureUploadResponse>(
    `/lectures/${userId}`,
    formData
  );
  
  return response.data;
};

