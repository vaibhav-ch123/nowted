import type React from "react"
import { createContext, useContext, useMemo, useState } from "react"

type SearchContextType = {
    searchValue: string,
    setSearchValue: React.Dispatch<React.SetStateAction<string>>
}

const SearchContext = createContext<SearchContextType | null>(null);

export function SearchContextProvider({children}: {children: React.ReactNode}) {
    
    const [searchValue, setSearchValue] = useState("");
    
    const value = useMemo(() => ({searchValue, setSearchValue}), [searchValue]);

    return (
        <SearchContext value={value}>{children}</SearchContext>
    );
}

export function useSearchContext() {

    const context = useContext(SearchContext);

    if(!context)         throw new Error("useSearchContext must be used inside SearchContextProvider");

    return context;
}