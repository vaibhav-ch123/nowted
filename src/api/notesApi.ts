import type { Note, RecentNotes } from "../types/note";
import api from "./api";

export async function getRecentFile(): Promise<Note[]> {
  const res = await api.get<RecentNotes>("/notes/recent");   
  return res.data.recentNotes;   
}