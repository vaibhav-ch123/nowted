import { Route, Routes } from "react-router";
import App from "../App";
import { SelectNotePage } from "../components/SelectNotePage";
import { NoteDetail } from "../components/NoteDetail";
import { RestoreNotePage } from "../components/RestoreNotePage";

export function AppRoutes() {

    return (
        <Routes>
            <Route path="dashboard/folder/:folderId" element={<App />} >
              <Route index element={<SelectNotePage />} />
              <Route path="note/:noteId" element={<NoteDetail />} />
              <Route path="note/:noteId/trash" element={<RestoreNotePage />} />
            </Route>
        </Routes>
    );
}