import { SideBar } from "./components/SideBar";
import { NoteList } from "./components/NoteList";
// import { RestoreNotePage } from './components/RestoreNotePage'
// import { SelectNotePage } from './components/SelectNotePage'
// import { NoteDetail } from "./components/NoteDetail";
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
              {/* <NoteDetail /> */}
              {/* <SelectNotePage /> */}
              {/* <RestoreNotePage /> */}
            </main>
          </SearchContextProvider>
        </FolderListProvider>
      </RefreshFolderProvider>
    </RefreshFileProvider>
  );
}

export default App;
