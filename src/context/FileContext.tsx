import { createContext, useContext, useState, type ReactNode } from "react";

type RefreshFileContextType = number;

type SetRefreshFileContextType = React.Dispatch<React.SetStateAction<number>>;

const RefreshFileContext = createContext<RefreshFileContextType | undefined>(
  undefined,
);

const SetRefreshFileContext = createContext<
  SetRefreshFileContextType | undefined
>(undefined);

export function RefreshFileProvider({ children }: { children: ReactNode }) {
  const [refreshFile, setRefreshFile] = useState<number>(0);

  return (
    <RefreshFileContext value={refreshFile}>
      <SetRefreshFileContext value={setRefreshFile}>
        {children}
      </SetRefreshFileContext>
    </RefreshFileContext>
  );
}

export function useRefreshFileContext() {
  const context = useContext(RefreshFileContext);
  
  if (context === undefined)
    throw new Error("useRefreshFile must be use inside RefreshFileProvider");

  return context;
}

export function useSetRefreshFileContext() {
  const context = useContext(SetRefreshFileContext);

  if (!context)
    throw new Error(
      "useSetRefreshFile must be use inside SetRefreshFileProvider",
    );

  return context;
}
