import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

type RefreshFolderContextType = number;

type SetRefreshFolderContextType = React.Dispatch<React.SetStateAction<number>>;

const RefreshFolderContext = createContext<
  RefreshFolderContextType | undefined
>(undefined);

const SetRefreshFolderContext = createContext<
  SetRefreshFolderContextType | undefined
>(undefined);

export function RefreshFolderProvider({ children }: { children: ReactNode }) {
  const [refreshFolder, setRefreshFolder] = useState<number>(0);

  return (
    <RefreshFolderContext value={refreshFolder}>
      <SetRefreshFolderContext value={setRefreshFolder}>
        {children}
      </SetRefreshFolderContext>
    </RefreshFolderContext>
  );
}

export function useRefreshFolderContext() {
  const context = useContext(RefreshFolderContext);

  if (context === undefined) {
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
