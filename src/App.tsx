import { SideBar } from "./components/SideBar";
import { NoteList } from "./components/NoteList";
import { Outlet } from "react-router";
import { SearchContextProvider } from "./context/SearchContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SearchContextProvider>
        <main className="flex h-screen">
          <SideBar />
          <NoteList />
          <Outlet />
        </main>
      </SearchContextProvider>
    </QueryClientProvider>
  );
}

export default App;
