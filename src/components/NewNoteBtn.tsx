import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { createNote } from "../api/notesApi";
import type { CreateNote } from "../types/note";
import { useRefreshFolderContext } from "../context/FolderContext";
import { useSearchContext } from "../context/SearchContext";
import { useRefreshFileContext } from "../context/FileContext";

export function NewNoteBtn({ toggleSearch }: { toggleSearch: boolean }) {
  const { folderId } = useParams();
  const { setRefreshFolder } = useRefreshFolderContext();
  const { setRefreshFile } = useRefreshFileContext();
  const navigate = useNavigate();
  const { searchValue, setSearchValue } = useSearchContext();
  const [folderErr, setFolderErr] = useState("");
  const [searchInputValue, setSearchInputValue] = useState(searchValue);

  useEffect(() => {

    const timer = setTimeout(() => {
      setSearchValue(searchInputValue);
    }, 1000);

    return () => { clearTimeout(timer); }

  }, [searchInputValue]);

  async function createNoteData(folderId: string) {
    const noteData: CreateNote = {
      folderId,
      title: "Untitled Note",
      content: "Start writing..",
      isFavorite: false,
      isArchived: false,
    };

    const noteId = await createNote(noteData);

    navigate(`note/${noteId}`);

    setRefreshFile((prev) => prev+1);
    setRefreshFolder((prev) => prev+1);
  }

  function handleNewNote(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setFolderErr("");

    if (!folderId || folderId.length < 15) {
      setFolderErr("Select a folder first!");
      return;
    }

    createNoteData(folderId);
  }

  return (
    <div className="px-[6%] text-center">
      {folderErr && <p className="text-red-400">{folderErr}</p>}
      {toggleSearch ? (
        <button
          className="w-full rounded-[3px] bg-[rgba(255,255,255,0.05)] text-[#FFFFFF] text-[16px] py-2 cursor-pointer"
          onClick={handleNewNote}
        >
          + New Note
        </button>
      ) : (
        <input
          className="w-full rounded-[3px] bg-[rgba(255,255,255,0.05)] text-[#FFFFFF] text-[16px] p-2"
          placeholder="Enter you want to search.."
          value={searchInputValue}
          onChange={(e) => { setSearchInputValue(e.target.value) }}
        />
      )}
    </div>
  );
}
