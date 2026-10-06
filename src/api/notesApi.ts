import type { AxiosResponse } from "axios";
import type { CreateNote, GetNote, Note, Notes, RecentNotes } from "../types/note";
import api from "./api";
import type { ErrorType } from "../types/error";

export async function getRecentFile(): Promise<Note[]> {

  const res = await api.get<RecentNotes | ErrorType>("/notes/recent"); 

  if("recentNotes" in res.data){
    return res.data.recentNotes;
  }

  throw new Error(res.data.error);  
}

export async function getFolderNotes(folderId: string, page: number, limit: number, searchValue: string): Promise<Note[]> {

  let res: AxiosResponse<Notes | ErrorType, any, {}, any>;

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

  if("notes" in res.data){
    return res.data.notes;
  }

  throw new Error(res.data.error);
}

export async function getNote(noteId: string): Promise<Note> {
  const res = await api.get<GetNote | ErrorType>(`/notes/${noteId}`);

  if("note" in res.data) {
    return res.data.note;
  }

  throw new Error(res.data.error);
}

export async function createNote(note: CreateNote): Promise<string> {
  const res = await api.post<{id: string} | ErrorType>("/notes", note);
  
  if("id" in res.data){
    return res.data.id;
  }

  throw new Error(res.data.error);
}

export async function updateNote(note: CreateNote, noteId: string): Promise<string> {
  const res = await api.patch<string | ErrorType>(`/notes/${noteId}`, note);

  if(typeof res.data === "string"){
    return res.data;
  }

  throw new Error(res.data.error);
}

export async function deleteNote(noteId: string): Promise<string> {
  const res = await api.delete<string | ErrorType>(`notes/${noteId}`);

  if(typeof res.data === "string"){
    return res.data;
  }

  throw new Error(res.data.error);
}

export async function restoreNote(noteId: string): Promise<string> {
  const res = await api.post<string | ErrorType>(`notes/${noteId}/restore`);
  
  if(typeof res.data === "string"){
    return res.data
  }

  throw new Error(res.data.error);
}