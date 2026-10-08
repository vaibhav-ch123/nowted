import optionLogo from "../assets/option-logo.svg";
import dateLogo from "../assets/date-logo.svg";
import folderLogo from "../assets/add-folder-logo.svg";
import archiveLogo from "../assets/archived-logo.svg";
import favLogo from "../assets/fav-logo.svg";
import binLogo from "../assets/bin-logo.svg";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { deleteNote, getNote, updateNote } from "../api/notesApi";
import type { CreateNote, Note } from "../types/note";
import { toast } from "sonner";
import { useSetRefreshFileContext } from "../context/FileContext";
import { useSetRefreshFolderContext } from "../context/FolderContext";
import { useFolderListContext } from "../context/FolderListContext";

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
  const [note, setNote] = useState<Note | null>(null);
  const { setRefreshFile } = useSetRefreshFileContext();
  const { setRefreshFolder } = useSetRefreshFolderContext();
  const { folderList } = useFolderListContext();
  const navigate = useNavigate();
  const { noteId, folderId } = useParams();
  const [hasIntialNote, setHasIntialNote] = useState(true);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

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
    let cancelled = false;
    setHasIntialNote(true);
    setErr("");
    async function loadNote() {
      if (!noteId) return;
      try {
        const noteData = await getNote(noteId);
        if (cancelled) return;
        setNote(noteData);
        setUpdateNoteValue({
          folderId: noteData.folderId ? noteData.folderId : "",
          title: noteData.title,
          content: noteData.content ? noteData.content : "",
          isFavorite: noteData.isFavorite,
          isArchived: noteData.isArchived,
        });
      } catch (err) {
        if (!cancelled) {
          if (err instanceof Error) {
            console.log(err.message);
          }
          setErr("failed to load note!");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadNote();

    return () => {
      cancelled = true;
    };
  }, [noteId]);

  useEffect(() => {
    if (hasIntialNote) return;

    const timer = setTimeout(async () => {
      try {
        const message = await updateNote(updateNoteValue, noteId ? noteId : "");
        setNote((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            folderId: updateNoteValue.folderId,
            title: updateNoteValue.title,
            content: updateNoteValue.content,
            isArchived: updateNoteValue.isArchived,
            isFavorite: updateNoteValue.isFavorite,
          };
        });
        setRefreshFile((prev) => prev + 1);
        setRefreshFolder((prev) => prev + 1);
        toast.success(message);
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
      } catch (err) {
        if (err instanceof Error) {
          console.log(err.message);
        }
        toast.error("failed to update file");
      }
    }, 1500);

    return () => {
      clearTimeout(timer);
    };
  }, [updateNoteValue]);

  async function handleDeleteNote(noteId: string) {
    try {
      const message = await deleteNote(noteId);
      toast.success(message);
      setRefreshFile((prev) => prev + 1);
      setRefreshFolder((prev) => prev + 1);
      navigate(`../`);
    } catch (err) {
      if (err instanceof Error) {
        console.log(err.message);
      }
      toast.error("failed to delete note");
    }
  }

  if (loading)
    return (
      <p className="bg-gray-200 dark:bg-[#181818] text-black dark:text-[#FFFFFF] flex flex-col flex-55 gap-6 px-8 py-10">
        Loading..
      </p>
    );
  if (err)
    return (
      <p className="bg-gray-200 dark:bg-[#181818] text-red-400 flex flex-col flex-55 gap-6 px-8 py-10">
        {err}
      </p>
    );

  return (
    <article className="bg-gray-200 dark:bg-[#181818] text-black dark:text-[#FFFFFF] flex flex-col flex-55 gap-6 px-8 py-10 overflow-auto [scrollbar-color:#d1d5db_#e5e7eb] dark:[scrollbar-color:rgba(255,255,255,0.4)_rgba(24,24,24,1)]">
      {loading}
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
                    handleDeleteNote(noteId);
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
                  folderList.filter(
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
                  {folderList.map((folder) => (
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
