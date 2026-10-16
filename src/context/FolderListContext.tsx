import React, {
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

type RefreshFolderListContextType = number;

type SetRefreshFolderListContextType = React.Dispatch<
  React.SetStateAction<number>
>;

const FolderListContext = createContext<FolderListContextType | undefined>(
  undefined,
);

const RefreshFolderListContext = createContext<
  RefreshFolderListContextType | undefined
>(undefined);

const SetRefreshFolderListContext = createContext<
  SetRefreshFolderListContextType | undefined
>(undefined);

export function FolderListProvider({ children }: { children: ReactNode }) {
  const [folderList, setFolderList] = useState<Folder[]>([]);
  const [refreshFolderList, setRefreshFolderList] = useState(0);

  const value = useMemo(() => ({ folderList, setFolderList }), [folderList]);

  return (
    <FolderListContext value={value}>
      <RefreshFolderListContext value={refreshFolderList}>
        <SetRefreshFolderListContext value={setRefreshFolderList}>
          {children}
        </SetRefreshFolderListContext>
      </RefreshFolderListContext>
    </FolderListContext>
  );
}

export function useFolderListContext() {
  const context = useContext(FolderListContext);

  if (!context) {
    throw new Error(
      "useFolderListContext must be used inside FolderListProvider",
    );
  }

  return context;
}

export function useRefreshFolderListContext() {
  const context = useContext(RefreshFolderListContext);

  if (context === undefined) {
    throw new Error(
      "useRefreshFolderListContext must be used inside RefreshFolderListProvider",
    );
  }

  return context;
}

export function useSetRefreshFolderListContext() {
  const context = useContext(SetRefreshFolderListContext);

  if (!context) {
    throw new Error(
      "useSetRefreshFolderListContext must be used inside SetRefreshFolderListProvider",
    );
  }

  return context;
}
