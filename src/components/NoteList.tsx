import { useEffect, useRef, useState } from "react";
import type { Note } from "../types/note";
import { getFolderNotes } from "../api/notesApi";
import { NavLink, useParams } from "react-router";
import { useRefreshFolderContext } from "../context/FolderContext";
import { useSearchContext } from "../context/SearchContext";

export function NoteList() {
  const { folderName, folderId } = useParams();
  const { refreshFolder } = useRefreshFolderContext();
  const { searchValue } = useSearchContext();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const divScrollRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef(false);
  const limit = 10;

  useEffect(() => {
    loadingRef.current = loading;
  }, [loading]);

  useEffect(() => {
    setPage(1);
    setHasMore(true);
    setErr("");
  }, [folderId, refreshFolder, searchValue]);

  useEffect(() => {
    if (!hasMore)  return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !loadingRef.current) {
          setPage((prev) => prev + 1);
        }
      },
    );

    const element = divScrollRef.current;

    if (element) {
      observer.observe(element);
    }

    return () => {
      observer.disconnect();
    };
  }, [hasMore]);

  useEffect(() => {
    let cancelled = false;

    async function loadNotes() {
      setLoading(true);
      setErr("");

      try {
        const notesData = await getFolderNotes(
          folderId ? folderId : "",
          page,
          limit,
          searchValue,
        );
        if (cancelled) return;

        setNotes((notes) => {
          if (page === 1) return notesData;
          return [...notes, ...notesData];
        });

        if (notesData.length < limit) {
          setHasMore(false);
        }
      } catch (err) {
        if (!cancelled) {
          if (err instanceof Error) {
            console.log(err.message);
          }
          setErr("failed to load notes");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadNotes();

    return () => {
      cancelled = true;
    };
  }, [folderId, page, refreshFolder, searchValue]);

  return (
    <section className="bg-gray-300 dark:bg-[#1C1C1C] text-black dark:text-[#FFFFFF] flex flex-col flex-25 gap-4 p-4 overflow-auto [scrollbar-color:#d1d5db_#e5e7eb] dark:[scrollbar-color:rgba(255,255,255,0.4)_rgba(24,24,24,1)]">
      <h1 className="py-2 text-[22px] text-black dark:text-[rgba(255,255,255,1)]">
        {folderName}
      </h1>

      {err && <p className="text-red-400">{err}</p>}

      {notes.map((note) => (
        <NavLink
          to={`note/${note.id}${folderId === "trash" ? "/trash" : ""}`}
          key={note.id}
          className={({ isActive }) =>
            `p-4 rounded-[3px] hover:bg-gray-100 dark:hover:bg-[rgba(255,255,255,0.1)] ${isActive ? "dark:bg-[rgba(255,255,255,0.1)] bg-gray-100" : "dark:bg-[rgba(255,255,255,0.03)] bg-gray-200"}`
          }
        >
          <h2 className="py-2 text-[18px] text-black dark:text-[rgba(255,255,255,1)] truncate">
            {note.title}
          </h2>
          <div className="flex gap-4 py-2">
            <p className="shrink-0 text-black dark:text-[rgba(255,255,255,0.4)] text-[16px]">
              {note.createdAt.slice(0, 10)}
            </p>
            <p className="min-w-0 truncate text-black dark:text-[rgba(255,255,255,0.6)] text-[16px]">
              {note.preview}
            </p>
          </div>
        </NavLink>
      ))}

      {loading && page === 1 && (
        <p className="text-center text-black dark:text-[rgba(255,255,255,0.6)]">
          Loading notes...
        </p>
      )}

      {loading && page > 1 && (
        <p className="text-center text-black dark:text-[rgba(255,255,255,0.6)]">
          Loading more...
        </p>
      )}

      {hasMore && <div ref={divScrollRef} className="h-1" />}

      {!hasMore && notes.length > 0 && (
        <p className="text-center text-black dark:text-[rgba(255,255,255,0.4)]">
          No more notes
        </p>
      )}

      {/* No notes */}
      {!loading && !err && notes.length === 0 && (
        <p className="text-center text-black dark:text-[rgba(255,255,255,0.4)]">
          No notes found.
        </p>
      )}
    </section>
  );
}
