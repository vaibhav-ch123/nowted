import optionLogo from "../assets/option-logo.svg";
import dateLogo from "../assets/date-logo.svg";
import folderLogo from "../assets/add-folder-logo.svg";
import archiveLogo from "../assets/archived-logo.svg";
import favLogo from "../assets/fav-logo.svg";
import binLogo from "../assets/bin-logo.svg";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { deleteNote, getNote, updateNote } from "../api/notesApi";
import type { CreateNote} from "../types/note";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getFolders } from "../api/folderApi";
import { useSearchContext } from "../context/SearchContext";

export function NoteDetail() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasFolderListOpen, setHasFolderListOpen] = useState(false);
  const [updateNoteValue, setUpdateNoteValue] = useState<CreateNote>({
    folderId: "",
    title: "",
    content: "",
    isFavorite: false,
    isArchived: false,
  });
  const navigate = useNavigate();
  const { noteId, folderId } = useParams();
  const [hasIntialNote, setHasIntialNote] = useState(true);
  const queryClient = useQueryClient();
  const { searchValue } = useSearchContext();

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target;
      if (!(target instanceof Element)) return;

      if (
        target.closest("[data-menu-trigger]") ||
        target.closest("[data-menu-content]")
      )
        return;

      setIsMenuOpen(false);
      setHasFolderListOpen(false);
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  useEffect(() => {
    if (hasIntialNote) return;

    const timer = setTimeout(async () => {
      if (!note) return;
      updateNoteMutation.mutate(note.id);
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [updateNoteValue]);

  const updateNoteMutation = useMutation({
    mutationFn: (noteId: string) => updateNote(updateNoteValue, noteId),
    onSuccess: (message, noteId) => {
      toast.success(message);
      queryClient.invalidateQueries({
        queryKey: ["recentNotes"],
      });
      queryClient.invalidateQueries({
        queryKey: ["folderNotes", folderId, searchValue],
      });
      queryClient.invalidateQueries({
        queryKey: ["notes", noteId],
      });
      if (
        folderId !== "favorite" &&
        folderId !== "archived" &&
        folderId !== "all-notes" &&
        updateNoteValue.folderId !== folderId
      )
        navigate("../");

      if (
        (updateNoteValue.isArchived && folderId !== "archived") ||
        (!updateNoteValue.isArchived && folderId === "archived") ||
        (!updateNoteValue.isFavorite && folderId === "favorite")
      )
        navigate("../");
    },
    onError: (err) => {
      if (err instanceof Error) {
        console.log(err.message);
      }
      toast.error("failed to update file");
      if (!note) return;
      setHasIntialNote(true);
      setUpdateNoteValue({
        folderId: note.folderId,
        title: note.title,
        content: note.content ?? "",
        isFavorite: note.isFavorite,
        isArchived: note.isArchived,
      });
    },
  });

  const {
    data: note,
    isLoading: noteLoading,
    error: noteErr,
  } = useQuery({
    queryKey: ["notes", noteId],
    queryFn: async ({ signal }) => {
      const noteData = await getNote(noteId!, signal);
      setUpdateNoteValue({
        folderId: noteData.folderId ? noteData.folderId : "",
        title: noteData.title,
        content: noteData.content ? noteData.content : "",
        isFavorite: noteData.isFavorite,
        isArchived: noteData.isArchived,
      });
      setHasIntialNote(true);
      return noteData;
    },
    enabled: !!noteId,
  });

  const {
    data: folderList,
    isLoading: folderLoading,
    error: folderErr,
  } = useQuery({
    queryKey: ["folders"],
    queryFn: ({ signal }) => getFolders(signal),
  });

  const deleteNoteMutation = useMutation({
    mutationFn: (noteId: string) => deleteNote(noteId),
    onSuccess: (message) => {
      toast.success(message);
      queryClient.invalidateQueries({
        queryKey: ["recentNotes"],
      });
      queryClient.invalidateQueries({
        queryKey: ["folderNotes", folderId, searchValue],
      });
      navigate("../");
    },
    onError: (err) => {
      if (err instanceof Error) {
        console.log(err.message);
      }
      toast.error("failed to delete note");
    },
  });

  if (noteLoading || folderLoading)
    return (
      <p className="bg-gray-200 dark:bg-[#181818] text-black dark:text-[#FFFFFF] flex flex-col flex-55 gap-6 px-8 py-10">
        Loading..
      </p>
    );

  if (noteErr)
    return (
      <p className="bg-gray-200 dark:bg-[#181818] text-red-400 flex flex-col flex-55 gap-6 px-8 py-10">
        {noteErr?.message}
      </p>
    );

  if (folderErr)
    return (
      <p className="bg-gray-200 dark:bg-[#181818] text-red-400 flex flex-col flex-55 gap-6 px-8 py-10">
        {folderErr?.message}
      </p>
    );

  return (
    <article className="bg-gray-200 dark:bg-[#181818] text-black dark:text-[#FFFFFF] flex flex-col flex-55 gap-6 px-8 py-10 overflow-auto [scrollbar-color:#d1d5db_#e5e7eb] dark:[scrollbar-color:rgba(255,255,255,0.4)_rgba(24,24,24,1)]">
      <section className="flex justify-between items-center">
        <input
          type="text"
          className="text-[32px] text-black dark:text-[rgba(255,255,255,1)] w-[90%]"
          onChange={(e) => {
            setHasIntialNote(false);
            setUpdateNoteValue((prev) => ({ ...prev, title: e.target.value }));
          }}
          value={updateNoteValue.title}
        />
        <div className="relative cursor-pointer">
          <img
            src={optionLogo}
            alt="option-logo"
            className="invert dark:invert-0"
            onClick={() => {
              setIsMenuOpen((prev) => !prev);
            }}
            data-menu-trigger
          />
          {isMenuOpen && (
            <div
              className="absolute top-12 right-0 bg-gray-300 dark:bg-[#333333] w-50 rounded-md"
              data-menu-content
            >
              <ul className="flex flex-col">
                <li
                  className="flex gap-4 px-4 py-2 hover:bg-gray-400 dark:hover:bg-[rgba(255,255,255,0.03)]"
                  onClick={() => {
                    setHasIntialNote(false);
                    setUpdateNoteValue((prev) => ({
                      ...prev,
                      isFavorite: !prev.isFavorite,
                    }));
                  }}
                >
                  <img
                    src={favLogo}
                    alt="favorite-logo"
                    className="invert dark:invert-0"
                  />
                  <button className="cursor-pointer text-left">
                    {!updateNoteValue.isFavorite
                      ? "Add to favorites"
                      : "Remove from favorites"}
                  </button>
                </li>
                <li
                  className="flex gap-4 px-4 py-2 hover:bg-gray-400 dark:hover:bg-[rgba(255,255,255,0.03)]"
                  onClick={() => {
                    setHasIntialNote(false);
                    setUpdateNoteValue((prev) => ({
                      ...prev,
                      isArchived: !prev.isArchived,
                    }));
                  }}
                >
                  <img
                    src={archiveLogo}
                    alt="archived-logo"
                    className="invert dark:invert-0"
                  />
                  <button className="cursor-pointer">
                    {!updateNoteValue.isArchived ? "Archived" : "Unarchived"}
                  </button>
                </li>
                <li className="px-4 py-2">
                  <hr className="text-gray-200 dark:text-[rgba(255,255,255,0.05)]" />
                </li>
                <li
                  className="flex gap-4 px-4 py-2 hover:bg-gray-400 dark:hover:bg-[rgba(255,255,255,0.03)]"
                  onClick={() => {
                    if (!noteId) return;
                    deleteNoteMutation.mutate(noteId);
                  }}
                >
                  <img
                    src={binLogo}
                    alt="bin-logo"
                    className="invert dark:invert-0"
                  />
                  <button className="cursor-pointer">Delete</button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex items-center gap-[10%] w-[35%]">
          <img
            src={dateLogo}
            alt="date-logo"
            className="w-5 invert dark:invert-0"
          />
          <div className="flex items-center flex-1">
            <p className="text-[14px] text-black dark:text-[rgba(255,255,255,0.6)] w-[60%]">
              Date
            </p>
            <p className="text-[14px] text-black dark:text-[rgba(255,255,255,1)] w-[40%] underline p-1">
              {note?.createdAt.slice(0, 10)}
            </p>
          </div>
        </div>
        <hr className="border-0 border-t border-t-gray-300 dark:border-t-[rgba(255,255,255,0.1)]" />
        <div className="flex items-center gap-[10%] w-[35%]">
          <img
            src={folderLogo}
            alt="folder-logo"
            className="w-5 invert dark:invert-0"
          />
          <div className="flex items-center flex-1">
            <p className="text-[14px] text-black dark:text-[rgba(255,255,255,0.6)] w-[60%]">
              Folder
            </p>
            <div className="relative text-[14px] bg-gray-200 dark:bg-[#181818] text-black dark:text-[rgba(255,255,255,1)] w-[40%]">
              <button
                className="w-full text-left underline hover:bg-gray-300 dark:hover:bg-[#333333] rounded-[3px] p-1 cursor-pointer"
                onClick={() => {
                  setHasFolderListOpen((prev) => !prev);
                }}
                data-menu-trigger
              >
                {
                  folderList?.filter(
                    (folder) => folder.id === updateNoteValue.folderId,
                  )[0]?.name
                }
              </button>
              {hasFolderListOpen && (
                <div
                  className="absolute bg-gray-300 dark:bg-[#333333] rounded-md w-50 h-70 overflow-y-auto scrollbar-thin [scrollbar-color:#d1d5db_#e5e7eb] dark:[scrollbar-color:rgba(255,255,255,0.4)_rgba(24,24,24,1)]"
                  data-menu-content
                >
                  {" "}
                  {folderList?.map((folder) => (
                    <button
                      key={folder.id}
                      className="p-2 w-full text-left cursor-pointer hover:bg-gray-400 dark:hover:bg-[rgba(255,255,255,0.03)]"
                      onClick={() => {
                        setHasIntialNote(false);
                        setHasFolderListOpen(false);
                        setUpdateNoteValue((prev) => ({
                          ...prev,
                          folderId: folder.id,
                        }));
                      }}
                    >
                      {folder.name}
                    </button>
                  ))}{" "}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <textarea
        value={updateNoteValue.content}
        onChange={(e) => {
          setHasIntialNote(false);
          setUpdateNoteValue((prev) => ({ ...prev, content: e.target.value }));
        }}
        placeholder="Start writing.."
        rows={30}
        className="overflow-auto [scrollbar-color:#d1d5db_#e5e7eb] dark:[scrollbar-color:rgba(255,255,255,0.4)_rgba(24,24,24,1)]"
      />
    </article>
  );
}
