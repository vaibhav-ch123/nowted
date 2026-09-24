import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

type FileContextType = {
    fileId: string,
    setFileId: React.Dispatch<React.SetStateAction<string>>
}

const FileContext = createContext<FileContextType | undefined>(undefined);

export function FileProvider({children}: {children: ReactNode}) {

    const [fileId, setFileId] = useState<string>("");
    const value = useMemo(() => ({fileId, setFileId}), [fileId]);
    
    return (
      <FileContext value={value}>
        {children}
      </FileContext>
    );
}

export function useFileId() {
  const context = useContext(FileContext);

  if(!context)     throw new Error("useFileId must be use inside fileProvider");

  return context;
}