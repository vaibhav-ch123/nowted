import { memo, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { createNote } from "../api/notesApi";
import type { CreateNote } from "../types/note";
import { useSetRefreshFolderContext } from "../context/FolderContext";
import { useSearchContext } from "../context/SearchContext";
import { useSetRefreshFileContext } from "../context/FileContext";
import { toast } from "sonner";

export const NewNoteBtn = memo( function NewNoteBtn({ toggleSearch }: { toggleSearch: boolean }) {
  const { folderId } = useParams();
  const { setRefreshFolder } = useSetRefreshFolderContext();
  const { setRefreshFile } = useSetRefreshFileContext();
  const navigate = useNavigate();
  const { searchValue, setSearchValue } = useSearchContext();
  const [folderErr, setFolderErr] = useState("");
  const [searchInputValue, setSearchInputValue] = useState(searchValue);
  let warningTimer = useRef(0);
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchValue(searchInputValue);
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [searchInputValue]);

  async function createNoteData(folderId: string) {
    try {
      const noteData: CreateNote = {
        folderId,
        title: "Untitled Note",
        content: "",
        isFavorite: false,
        isArchived: false,
      };

      const noteId = await createNote(noteData);
      toast.success("note created successfully");

      navigate(`note/${noteId}`);
      setRefreshFile((prev) => prev + 1);
      setRefreshFolder((prev) => prev + 1);
    } catch (err) {
      if (err instanceof Error) {
        console.log(err.message);
      }
      toast.error("failed to create note");
    }
  }

  function handleNewNote(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setFolderErr("");

    if (!folderId || folderId.length < 15) {
      clearTimeout(warningTimer.current);
      setFolderErr("Select a folder first!");

      warningTimer.current = setTimeout(() => {
        setFolderErr("");
      }, 3000);

      return;
    }

    createNoteData(folderId);
  }

  return (
    <div className="px-[6%] text-center">
      {toggleSearch ? (
        <button
          className="w-full rounded-[3px] bg-white text-black dark:bg-[rgba(255,255,255,0.05)] dark:text-[#FFFFFF] text-[16px] py-2 cursor-pointer"
          onClick={handleNewNote}
        >
          + New Note
        </button>
      ) : (
        <input
          className="w-full rounded-[3px] bg-white text-black dark:bg-[rgba(255,255,255,0.05)] dark:text-[#FFFFFF] text-[16px] p-2"
          placeholder="Enter you want to search.."
          autoFocus
          value={searchInputValue}
          onChange={(e) => {
            setSearchInputValue(e.target.value);
          }}
        />
      )}
      {folderErr && <p className="text-red-400">{folderErr}</p>}
    </div>
  );
}
)