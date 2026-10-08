import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

type RefreshFileContextType = {
  refreshFile: number  
}

type SetRefreshFileContextType = {
  setRefreshFile: React.Dispatch<React.SetStateAction<number>>
}

const RefreshFileContext = createContext<RefreshFileContextType | undefined>(undefined);

const SetRefreshFileContext = createContext<SetRefreshFileContextType | undefined>(undefined);

export function RefreshFileProvider({children}: {children: ReactNode}) {

    const [refreshFile, setRefreshFile] = useState<number>(0);
    const refreshFileValue = useMemo(() => ({refreshFile}), [refreshFile]);
    const setRefreshFileValue = useMemo(() => ({setRefreshFile}), [setRefreshFile]); 

    return (
      <RefreshFileContext value={refreshFileValue}>
        <SetRefreshFileContext value={setRefreshFileValue}>
          {children}
        </SetRefreshFileContext>
      </RefreshFileContext>
    );
}

export function useRefreshFileContext() {
  const context = useContext(RefreshFileContext);

  if(!context)     throw new Error("useRefreshFile must be use inside RefreshFileProvider");

  return context;
}

export function useSetRefreshFileContext() {
  const context = useContext(SetRefreshFileContext);

  if(!context)     throw new Error("useSetRefreshFile must be use inside SetRefreshFileProvider");

  return context;
}