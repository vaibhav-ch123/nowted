export type Folder = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}

export type Folders = {
  folders: Folder[];
}
