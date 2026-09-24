import type { Folder, Folders } from "../types/folder";
import api from "./api";

export async function getFolders(): Promise<Folder[]> {

    const res = await api.get<Folders>("/folders");
    return res.data.folders;
}