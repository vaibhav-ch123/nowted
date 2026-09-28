import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

type RefreshFileContextType = {
    refreshFile: number,
    setRefreshFile: React.Dispatch<React.SetStateAction<number>>
}

const RefreshFileContext = createContext<RefreshFileContextType | undefined>(undefined);

export function RefreshFileProvider({children}: {children: ReactNode}) {

    const [refreshFile, setRefreshFile] = useState<number>(0);
    const value = useMemo(() => ({refreshFile, setRefreshFile}), [refreshFile]);
    
    return (
      <RefreshFileContext value={value}>
        {children}
      </RefreshFileContext>
    );
}

export function useRefreshFileContext() {
  const context = useContext(RefreshFileContext);

  if(!context)     throw new Error("useRefreshFile must be use inside RefreshFileProvider");

  return context;
}