import type { Folder } from "./folder";

export type Note = {
  id: string;
  folderId: string;
  title: string;
  content?: string;
  isFavorite: boolean;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  preview?: string;
  folder: Folder;
};

export type RecentNotes = {
  recentNotes: Note[];
};

export type Notes = {
  notes: Note[];
  total: number;
};

export type GetNote = {
  note: Note;
};

export type CreateNote = {
  folderId: string;
  title: string;
  content: string;
  isFavorite: boolean;
  isArchived: boolean;
};
