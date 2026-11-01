import { memo, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { createNote } from "../api/notesApi";
import type { CreateNote } from "../types/note";
import { useSearchContext } from "../context/SearchContext";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const NewNoteBtn = memo(function NewNoteBtn({
  toggleSearch,
}: {
  toggleSearch: boolean;
}) {
  const { folderId } = useParams();
  const navigate = useNavigate();
  const { searchValue, setSearchValue } = useSearchContext();
  const [folderErr, setFolderErr] = useState("");
  const [searchInputValue, setSearchInputValue] = useState(searchValue);
  let warningTimer = useRef(0);
  const queryClient = useQueryClient();

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchValue(searchInputValue);
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [searchInputValue]);

  const createNoteMutation = useMutation({
    mutationFn: (folderId: string) => {
      const noteData: CreateNote = {
        folderId,
        title: "Untitled Note",
        content: "",
        isFavorite: false,
        isArchived: false,
      };

      return createNote(noteData);
    },

    onSuccess: (noteId) => {
      toast.success("note created successfully");

      navigate(`note/${noteId}`);

      queryClient.invalidateQueries({
        queryKey: ["recentNotes"],
      });
      queryClient.invalidateQueries({
        queryKey: ["folderNotes", folderId, searchValue],
      });
    },

    onError: (err) => {
      if (err instanceof Error) {
        console.log(err.message);
      }
      toast.error("failed to create note");
    },

  });

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

    createNoteMutation.mutate(folderId);
  }

  return (
    <div className="px-[6%] text-center">
      {toggleSearch ? (
        <button
          className="w-full rounded-[3px] bg-white text-black dark:bg-[rgba(255,255,255,0.05)] dark:text-[#FFFFFF] text-[16px] py-2 cursor-pointer"
          onClick={handleNewNote}
          disabled={createNoteMutation.isPending}
        >
          {createNoteMutation.isPending ? "Creating..." : "+ New Note"}
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
});
