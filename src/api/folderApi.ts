import type { Folder, Folders } from "../types/folder";
import api from "./api";

export async function getFolders(): Promise<Folder[]> {
  const res = await api.get<Folders>("/folders");
  return res.data.folders;
}

export async function createFolder(folderName: string): Promise<string> {
  const res = await api.post<string>("/folders", { name: folderName });  
  return res.data;
}

export async function editFolder(folderName: string, folderId: string): Promise<string> {
  const res = await api.patch<string>(`/folders/${folderId}`, { name: folderName });
  return res.data;
}

export async function deleteFolder(folderId: string): Promise<string> {
  const res = await api.delete<string>(`/folders/${folderId}`);
  return res.data;  
}