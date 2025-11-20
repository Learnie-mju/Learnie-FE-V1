import axiosInstance from "./axiosInstance";

// 폴더 생성 요청 (새 API)
export interface CreateFolderRequest {
  userId: number;
  name: string;
}

// 폴더 생성 응답 (새 API)
export interface CreateFolderResponse {
  folderId: number;
  name: string;
}

// 폴더 목록 조회 응답 (새 API)
export interface FolderListItem {
  folderId: number;
  name: string;
}

// 기존 코드 호환성을 위한 응답 타입
export interface FolderResponse {
  folderId: number;
  folderName: string;
  userId: number;
  createdAt?: string;
}

// 폴더 생성 API (새 엔드포인트: POST /folders)
export const createFolderAPI = async (
  userId: number,
  folderName: string
): Promise<FolderResponse> => {
  const response = await axiosInstance.post<CreateFolderResponse>("/folders", {
    userId: userId,
    name: folderName,
  });
  // 응답 구조 변환: { folderId, name } -> { folderId, folderName, userId }
  return {
    folderId: response.data.folderId,
    folderName: response.data.name,
    userId: userId,
  };
};

// 폴더 목록 조회 API (새 엔드포인트: /folders/{userId})
export const getFoldersAPI = async (
  userId: number
): Promise<FolderResponse[]> => {
  const response = await axiosInstance.get<FolderListItem[]>(
    `/folders/${userId}`
  );
  // 응답 구조 변환: { folderId, name } -> { folderId, folderName, userId }
  return response.data.map((item) => ({
    folderId: item.folderId,
    folderName: item.name,
    userId: userId,
  }));
};

