import type { AxiosResponse } from "axios";
import type { CreateNote, GetNote, Note, Notes, RecentNotes } from "../types/note";
import api from "./api";

export async function getRecentFile(): Promise<Note[]> {
  const res = await api.get<RecentNotes>("/notes/recent");   
  return res.data.recentNotes;   
}

export async function getFolderNotes(folderId: string, page: number, limit: number, searchValue: string): Promise<Note[]> {

  let res: AxiosResponse<Notes, any, {}, any>;

  if(folderId === "favorite"){
    res = await api.get<Notes>(`/notes`, {
      params: {
        favorite: true,
        deleted: false,
        page,
        limit,
        search: searchValue,
      },
    });
  } else if(folderId === "archived"){
    res = await api.get<Notes>(`/notes`, {
      params: {
        archived: true,
        deleted: false,
        page,
        limit,
        search: searchValue,
      }
    });
  } else if(folderId === "trash"){
    res = await api.get<Notes>(`/notes`, {
      params: {
        deleted: true,
        page,
        limit,
        search: searchValue,
      }
    });
  } else if(folderId === "all-notes"){
    res = await api.get<Notes>(`/notes`, {
      params: {
        deleted: false,
        page,
        limit,
        search: searchValue,
      }
    });
  } else {
    res = await api.get<Notes>(`/notes`, {
      params: {
        deleted: false,
        folderId,
        page,
        limit,
        search: searchValue,
      }
    });
  }

  return res.data.notes;
}

export async function getNote(noteId: string): Promise<Note> {
  const res = await api.get<GetNote>(`/notes/${noteId}`);
  return res.data.note;
}

export async function createNote(note: CreateNote): Promise<string> {
  const res = await api.post<{id: string}>("/notes", note);
  return res.data.id;
}

export async function updateNote(note: CreateNote, noteId: string): Promise<string> {
  const res = await api.patch<string>(`/notes/${noteId}`, note);
  return res.data;
}

export async function deleteNote(noteId: string): Promise<string> {
  const res = await api.delete<string>(`notes/${noteId}`);
  return res.data;
}

export async function restoreNote(noteId: string): Promise<string> {
  const res = await api.post<string>(`notes/${noteId}/restore`);
  return res.data;
}