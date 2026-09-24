import type { AxiosResponse } from "axios";
import type { Note, Notes, RecentNotes } from "../types/note";
import api from "./api";

export async function getRecentFile(): Promise<Note[]> {
  const res = await api.get<RecentNotes>("/notes/recent");   
  return res.data.recentNotes;   
}

export async function getFolderNotes(folderId: string, page: number, limit: number): Promise<Note[]> {

  let res: AxiosResponse<Notes, any, {}, any>;

  if(folderId === "favorite"){
    res = await api.get<Notes>(`/notes`, {
      params: {
        favorite: true,
        deleted: false,
        page,
        limit,
      },
    });
  } else if(folderId === "archived"){
    res = await api.get<Notes>(`/notes`, {
      params: {
        archived: true,
        deleted: false,
        page,
        limit,
      }
    });
  } else if(folderId === "trash"){
    res = await api.get<Notes>(`/notes`, {
      params: {
        deleted: true,
        page,
        limit,
      }
    });
  } else if(folderId === "all-notes"){
    res = await api.get<Notes>(`/notes`, {
      params: {
        deleted: false,
        page,
        limit,
      }
    });
  } else {
    res = await api.get<Notes>(`/notes`, {
      params: {
        deleted: false,
        folderId,
        page,
        limit,
      }
    });
  }

  return res.data.notes;
}