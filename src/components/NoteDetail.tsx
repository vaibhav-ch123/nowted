import optionLogo from "../assets/option-logo.svg";
import dateLogo from "../assets/date-logo.svg";
import folderLogo from "../assets/add-folder-logo.svg";
import archiveLogo from "../assets/archived-logo.svg";
import favLogo from "../assets/fav-logo.svg";
import binLogo from "../assets/bin-logo.svg";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { deleteNote, getNote, updateNote } from "../api/notesApi";
import type { CreateNote } from "../types/note";
import { toast } from "sonner";
import { useRefreshFileContext } from "../context/FileContext";
import { useRefreshFolderContext } from "../context/FolderContext";
import { useFolderListContext } from "../context/FolderListContext";

export function NoteDetail() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasFolderListOpen, setHasFolderListOpen] = useState(false);
  const [note, setNote] = useState<CreateNote>({
    folderId: "",
    title: "",
    content: "",
    isFavorite: false,
    isArchived: false,
  });
  const { setRefreshFile } = useRefreshFileContext();
  const { setRefreshFolder } = useRefreshFolderContext();
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
        setNote({
          folderId: noteData.folderId ? noteData.folderId : "",
          title: noteData.title,
          content: noteData.content ? noteData.content : "",
          isFavorite: noteData.isFavorite,
          isArchived: noteData.isArchived,
        });
      } catch (e) {
        if (!cancelled) {
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
        const message = await updateNote(note, noteId ? noteId : "");
        setRefreshFile((prev) => prev + 1);
        setRefreshFolder((prev) => prev + 1);
        toast.success(message);
        if (
          folderId !== "favorite" &&
          folderId !== "archived" &&
          folderId !== "all-notes" &&
          note.folderId != folderId
        )
          navigate("../");

        if (
          (note.isArchived && folderId !== "archived") ||
          (!note.isArchived && folderId === "archived")
        )
          navigate("../");
      } catch (err) {
        console.log(err);
        toast.error("failed to update file");
      }
    }, 1500);

    return () => {
      clearTimeout(timer);
    };
  }, [note]);

  async function handleDeleteNote(noteId: string) {
    try {
      const message = await deleteNote(noteId);
      toast.success(message);
      setRefreshFile((prev) => prev + 1);
      setRefreshFolder((prev) => prev + 1);
      navigate(`../`);
    } catch (err) {
      console.log(err);
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
        {/* <h1 className="text-[32px] text-[rgba(255,255,255,1)]">Reflection on the month of June</h1> */}
        <input
          type="text"
          className="text-[32px] text-black dark:text-[rgba(255,255,255,1)] w-[90%]"
          onChange={(e) => {
            setHasIntialNote(false);
            setNote((prev) => ({ ...prev, title: e.target.value }));
          }}
          value={note.title}
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
                    setNote((prev) => ({
                      ...prev,
                      isFavorite: !prev.isFavorite,
                    }));
                  }}
                >
                  <img src={favLogo} alt="favorite-logo" className="invert dark:invert-0" />
                  <button className="cursor-pointer text-left">
                    {!note.isFavorite
                      ? "Add to favorites"
                      : "Remove from favorites"}
                  </button>
                </li>
                <li
                  className="flex gap-4 px-4 py-2 hover:bg-gray-400 dark:hover:bg-[rgba(255,255,255,0.03)]"
                  onClick={() => {
                    setHasIntialNote(false);
                    setNote((prev) => ({
                      ...prev,
                      isArchived: !prev.isArchived,
                    }));
                  }}
                >
                  <img src={archiveLogo} alt="archived-logo" className="invert dark:invert-0" />
                  <button className="cursor-pointer">
                    {!note.isArchived ? "Archived" : "Unarchived"}
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
                  <img src={binLogo} alt="bin-logo" className="invert dark:invert-0" />
                  <button className="cursor-pointer">Delete</button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex gap-[10%] w-[35%]">
          <img src={dateLogo} alt="date-logo" className="w-[8%] invert dark:invert-0" />
          <div className="flex w-[82%]">
            <p className="text-[14px] text-black dark:text-[rgba(255,255,255,0.6)] w-[60%]">
              Date
            </p>
            <p className="text-[14px] text-black dark:text-[rgba(255,255,255,1)] w-[40%] underline">
              21/06/2026
            </p>
          </div>
        </div>
        <hr className="border-0 border-t border-t-gray-300 dark:border-t-[rgba(255,255,255,0.1)]" />
        <div className="flex gap-[10%] w-[35%]">
          <img src={folderLogo} alt="folder-logo" className="w-[8%] invert dark:invert-0" />
          <div className="flex w-[82%]">
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
                  folderList.filter((folder) => folder.id === note.folderId)[0]
                    ?.name
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
                        setNote((prev) => ({ ...prev, folderId: folder.id }));
                      }}
                    >
                      {folder.name}
                    </button>
                  ))}{" "}
                </div>
              )}
            </div>
            {/* <select
              className="appearance-none outline-none text-[14px] bg-[#181818] text-[rgba(255,255,255,1)] w-[40%] underline overflow-auto [scrollbar-color:rgba(255,255,255,0.4)_rgba(24,24,24,1)]"
              value={note.folderId}
              onChange={(e) => {
                setHasIntialNote(false);
                setNote((prev) => ({...prev, folderId: e.target.value}));
              }}
            >
              {folderList.map((folder) => (
                <option id={folder.id} value={folder.id}>
                  {folder.name}
                </option>
              ))}
            </select> */}
          </div>
        </div>
      </section>

      <textarea
        value={note.content}
        onChange={(e) => {
          setHasIntialNote(false);
          setNote((prev) => ({ ...prev, content: e.target.value }));
        }}
        rows={30}
        className="overflow-auto [scrollbar-color:#d1d5db_#e5e7eb] dark:[scrollbar-color:rgba(255,255,255,0.4)_rgba(24,24,24,1)]"
      />
      {/* <section>
        <p>It's hard to believe that June is already over!</p>

        <p>
          One of the best things that happened was getting promoted at work...
        </p>

        <p>I also had a great time on my vacation to Hawaii...</p>
      </section> */}
    </article>
  );
}
