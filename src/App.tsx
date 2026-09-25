import { SideBar } from "./components/SideBar";
import { NoteList } from "./components/NoteList";
// import { RestoreNotePage } from './components/RestoreNotePage'
// import { SelectNotePage } from './components/SelectNotePage'
// import { NoteDetail } from "./components/NoteDetail";
import { Outlet } from "react-router";
import { FileProvider } from "./context/FileContext";
import { RefreshFolderProvider } from "./context/FolderContext";

function App() {
  return (
    <FileProvider>
      <RefreshFolderProvider>
        <main className="flex h-screen">
          <SideBar />
          <NoteList />
          <Outlet />
          {/* <NoteDetail /> */}
          {/* <SelectNotePage /> */}
          {/* <RestoreNotePage /> */}
        </main>
      </RefreshFolderProvider>
    </FileProvider>
  );
}

export default App;
