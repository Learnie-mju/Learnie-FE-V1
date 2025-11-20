import axiosInstance from "./axiosInstance";

// 폴더 생성 요청
export interface CreateFolderRequest {
  userId: number;
  folderName: string;
}

// 폴더 생성 응답
export interface FolderResponse {
  folderId: number;
  folderName: string;
  userId: number;
  createdAt?: string;
}

// 폴더 생성 API
export const createFolderAPI = async (
  userId: number,
  folderName: string
): Promise<FolderResponse> => {
  const response = await axiosInstance.post<FolderResponse>("/folders", {
    userId: userId,
    folderName: folderName,
  });
  return response.data;
};

// 폴더 목록 조회 API
export const getFoldersAPI = async (
  userId: number
): Promise<FolderResponse[]> => {
  const response = await axiosInstance.get<FolderResponse[]>(
    `/folders/user/${userId}`
  );
  return response.data;
};

