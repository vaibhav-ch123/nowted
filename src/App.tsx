import { SideBar } from "./components/SideBar";
import { NoteList } from "./components/NoteList";
import { Outlet } from "react-router";
import { RefreshFileProvider } from "./context/FileContext";
import { RefreshFolderProvider } from "./context/FolderContext";
import { SearchContextProvider } from "./context/SearchContext";
import { FolderListProvider } from "./context/FolderListContext";

function App() {
  return (
    <RefreshFileProvider>
      <RefreshFolderProvider>
        <FolderListProvider>
          <SearchContextProvider>
            <main className="flex h-screen">
              <SideBar />
              <NoteList />
              <Outlet />
            </main>
          </SearchContextProvider>
        </FolderListProvider>
      </RefreshFolderProvider>
    </RefreshFileProvider>
  );
}

export default App;
