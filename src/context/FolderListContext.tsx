import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Folder } from "../types/folder";

type FolderListContextType = {
  folderList: Folder[];
  setFolderList: React.Dispatch<React.SetStateAction<Folder[]>>;
};

const FolderListContext = createContext<FolderListContextType | undefined>(undefined);

export function FolderListProvider({ children }: { children: ReactNode }) {
  const [folderList, setFolderList] = useState<Folder[]>([]);
  const value = useMemo(() => ({ folderList, setFolderList }), [folderList]);

  return <FolderListContext value={value}>{children}</FolderListContext>;
}

export function useFolderListContext() {
  const context = useContext(FolderListContext);

  if (!context) {
    throw new Error("useFolderListContext must be used inside FolderListProvider");
  }

  return context;
}
