import { useEffect, useRef, useState } from "react";
import type { Note } from "../types/note";
import { getFolderNotes } from "../api/notesApi";
import { NavLink, useParams } from "react-router";
import { useRefreshFolderContext } from "../context/FolderContext";

export function NoteList() {
  const { folderName, folderId } = useParams();
  const { refreshFolder } = useRefreshFolderContext();
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
    setNotes([]);
    setHasMore(true);
    setErr("");
  }, [folderId, refreshFolder]);

  useEffect(() => {
    if (!hasMore) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !loadingRef.current) {
          setPage((prev) => prev + 1);
        }
      },
      {
        rootMargin: "200px",
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
        const notesData = await getFolderNotes(folderId ? folderId : "", page, limit);

        if (cancelled) return;

        setNotes((notes) => {
          if (page === 1) return notesData;
          return [...notes, ...notesData];
        });

        if (notesData.length < limit) {
          setHasMore(false);
        }
      } catch (e) {
        if (!cancelled) {
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
  }, [folderId, page, refreshFolder]);

  return (
    <section className="bg-[#1C1C1C] text-[#FFFFFF] flex flex-col flex-25 gap-4 p-4 overflow-auto [scrollbar-color:rgba(255,255,255,0.4)_rgba(24,24,24,1)]">
      <h1 className="py-2 text-[22px] text-[rgba(255,255,255,1)]">
        {folderName}
      </h1>

      {err && <p className="text-red-400">{err}</p>}

      {notes.map((note) => (
        <NavLink
          to={`note/${note.id}`}
          key={note.id}
          className={({isActive}) => `p-4 rounded-[3px] ${isActive ? "bg-[rgba(255,255,255,0.1)]" : "bg-[rgba(255,255,255,0.03)]"}`}
        >
          <h2 className="py-2 text-[18px] text-[rgba(255,255,255,1)]">
            {note.title}
          </h2>
          <div className="flex gap-4 py-2">
            <p className="shrink-0 text-[rgba(255,255,255,0.4)] text-[16px]">
              {note.createdAt.slice(0, 10)}
            </p>
            <p className="min-w-0 truncate text-[rgba(255,255,255,0.6)] text-[16px]">
              {note.preview}
            </p>
          </div>
        </NavLink>
      ))}

      {loading && page === 1 && (
        <p className="text-center text-[rgba(255,255,255,0.6)]">
          Loading notes...
        </p>
      )}

      {loading && page > 1 && (
        <p className="text-center text-[rgba(255,255,255,0.6)]">
          Loading more...
        </p>
      )}

      {hasMore && <div ref={divScrollRef} className="h-1" />}

      {!hasMore && notes.length > 0 && (
        <p className="text-center text-[rgba(255,255,255,0.4)]">
          No more notes
        </p>
      )}

      {/* No notes */}
      {!loading && !err && notes.length === 0 && (
        <p className="text-center text-[rgba(255,255,255,0.4)]">
          No notes found.
        </p>
      )}
      {/* <section className="p-4 bg-[rgba(255,255,255,0.03)] rounded-[3px]">
        <h2 className="py-2 text-[18px] text-[rgba(255,255,255,1)]">
          My Goals for the Next Year
        </h2>
        <div className="flex gap-4 py-2">
          <p className="shrink-0 text-[rgba(255,255,255,0.4)] text-[16px]">
            31/12/2026
          </p>
          <p className="min-w-0 truncate text-[rgba(255,255,255,0.6)] text-[16px]">
            As the year comes to an end
          </p>
        </div>
      </section>
      <section className="p-4 bg-[rgba(255,255,255,0.1)] rounded-[3px]">
        <h2 className="py-2 text-[18px] text-[rgba(255,255,255,1)]">
          My Goals for the Next Year
        </h2>
        <div className="flex gap-4 py-2">
          <p className="shrink-0 text-[rgba(255,255,255,0.4)] text-[16px]">
            31/12/2026
          </p>
          <p className="min-w-0 truncate text-[rgba(255,255,255,0.6)] text-[16px]">
            As the year comes to an end
          </p>
        </div>
      </section>
      <section className="p-4 bg-[rgba(255,255,255,0.03)] rounded-[3px]">
        <h2 className="py-2 text-[18px] text-[rgba(255,255,255,1)]">
          My Goals for the Next Year
        </h2>
        <div className="flex gap-4 py-2">
          <p className="shrink-0 text-[rgba(255,255,255,0.4)] text-[16px]">
            31/12/2026
          </p>
          <p className="min-w-0 truncate text-[rgba(255,255,255,0.6)] text-[16px]">
            As the year comes to an end
          </p>
        </div>
      </section> */}
    </section>
  );
}
