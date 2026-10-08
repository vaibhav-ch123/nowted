import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type RefreshFolderContextType = {
  refreshFolder: number;
};

type SetRefreshFolderContextType = {
  setRefreshFolder: React.Dispatch<React.SetStateAction<number>>;
};

const RefreshFolderContext = createContext<
  RefreshFolderContextType | undefined
>(undefined);

const SetRefreshFolderContext = createContext<
  SetRefreshFolderContextType | undefined
>(undefined);

export function RefreshFolderProvider({ children }: { children: ReactNode }) {
  const [refreshFolder, setRefreshFolder] = useState<number>(0);
  const refreshFolderValue = useMemo(
    () => ({ refreshFolder }),
    [refreshFolder],
  );
  const setRefreshFolderValue = useMemo(
    () => ({ setRefreshFolder }),
    [setRefreshFolder],
  );

  return (
    <RefreshFolderContext value={refreshFolderValue}>
      <SetRefreshFolderContext value={setRefreshFolderValue}>
        {children}
      </SetRefreshFolderContext>
    </RefreshFolderContext>
  );
}

export function useRefreshFolderContext() {
  const context = useContext(RefreshFolderContext);

  if (!context) {
    throw new Error(
      "useRefreshFolderContext must be used inside RefreshFolderProvider",
    );
  }

  return context;
}

export function useSetRefreshFolderContext() {
  const context = useContext(SetRefreshFolderContext);

  if (!context) {
    throw new Error(
      "useSetRefreshFolderContext must be used inside SetRefreshFolderProvider",
    );
  }

  return context;
}
