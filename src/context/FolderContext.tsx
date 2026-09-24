import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

type folderContextType = {
    folderId: string,
    setFolderId: React.Dispatch<React.SetStateAction<string>>
}

const FolderContext = createContext<folderContextType | undefined>(undefined);

export function FolderProvider({children}: {children: ReactNode}) {
    const [folderId, setFolderId] = useState<string>("");
    const value = useMemo(() => ({folderId, setFolderId}), [folderId]);

    return (
        <FolderContext value={value}>
          {children}
        </FolderContext>
    );
}

export function useFolderId() {

    const context = useContext(FolderContext);

    if(!context)        throw new Error("useFolderId must be used inside folderProvider");

    return context;
}