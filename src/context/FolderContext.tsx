import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Folder } from "../types/folder";

type folderContextType = {
  folderData: Folder;
  setFolderData: React.Dispatch<React.SetStateAction<Folder>>;
};

const FolderContext = createContext<folderContextType | undefined>(undefined);

export function FolderProvider({ children }: { children: ReactNode }) {
  const [folderData, setFolderData] = useState<Folder>({
    id: "all-notes",
    name: "All Notes",
    createdAt: "",
    updatedAt: "",
    deletedAt: "",
  });
  const value = useMemo(() => ({ folderData, setFolderData }), [folderData]);

  return <FolderContext value={value}>{children}</FolderContext>;
}

export function useFolderContextData() {
  const context = useContext(FolderContext);

  if (!context) {
    throw new Error("useFolderId must be used inside folderProvider");
  }

  return context;
}
