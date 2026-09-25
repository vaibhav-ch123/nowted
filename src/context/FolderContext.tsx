import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type refreshFolderContextType = {
  refreshFolder: number;
  setRefreshFolder: React.Dispatch<React.SetStateAction<number>>;
};

const RefreshFolderContext = createContext<refreshFolderContextType | undefined>(undefined);

export function RefreshFolderProvider({ children }: { children: ReactNode }) {
  const [refreshFolder, setRefreshFolder] = useState<number>(0);
  const value = useMemo(() => ({ refreshFolder, setRefreshFolder }), [refreshFolder]);

  return <RefreshFolderContext value={value}>{children}</RefreshFolderContext>;
}

export function useRefreshFolderContext() {
  const context = useContext(RefreshFolderContext);

  if (!context) {
    throw new Error("useRefreshFolderContext must be used inside RefreshFolderProvider");
  }

  return context;
}
