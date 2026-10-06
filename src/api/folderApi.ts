import type { ErrorType } from "../types/error";
import type { Folder, Folders } from "../types/folder";
import api from "./api";

export async function getFolders(): Promise<Folder[]> {
  const res = await api.get<Folders | ErrorType>("/folders");

  if("folders" in res.data){
    return res.data.folders;
  }

  throw new Error(res.data.error);
}

export async function createFolder(folderName: string): Promise<string> {
  const res = await api.post<string | ErrorType>("/folders", { name: folderName });  

  if(typeof res.data === "string"){
    return res.data;
  }

  throw new Error(res.data.error);
}

export async function editFolder(folderName: string, folderId: string): Promise<string> {
  const res = await api.patch<string | ErrorType>(`/folders/${folderId}`, { name: folderName });

  if(typeof res.data === "string"){
    return res.data;
  }

  throw new Error(res.data.error);
}

export async function deleteFolder(folderId: string): Promise<string> {
  const res = await api.delete<string | ErrorType>(`/folders/${folderId}`);

  if(typeof res.data === "string"){
    return res.data;  
  }

  throw new Error(res.data.error);
}