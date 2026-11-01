import { useEffect, useRef} from "react";
import { getFolderNotes } from "../api/notesApi";
import { NavLink, useParams } from "react-router";
import { useSearchContext } from "../context/SearchContext";
import { useInfiniteQuery } from "@tanstack/react-query";

export function NoteList() {
  const { folderName, folderId } = useParams();
  const { searchValue } = useSearchContext();
  const divScrollRef = useRef<HTMLDivElement>(null);
  const limit = Math.ceil(window.innerHeight / 114);

  const {
    data,
    isLoading: loading,
    error: err,
    hasNextPage,
    isFetching,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["folderNotes", folderId, searchValue, limit],

    queryFn: ({ pageParam, signal }) =>
      getFolderNotes(folderId ?? "", pageParam, limit, searchValue, signal),

    initialPageParam: 1,

    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < limit) {
        return undefined;
      }

      return allPages.length + 1;
    },
  });

  const notes = data?.pages.flat() ?? [];
  const page = Number(data?.pageParams.at(-1) ?? 1);

  useEffect(() => {
    if (!hasNextPage && isFetching)   return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !isFetching) {
        fetchNextPage();
      }
    });

    const element = divScrollRef.current;
    if (element) {
      observer.observe(element);
    }

    return () => {
      observer.disconnect();
    };
  }, [hasNextPage, isFetching, fetchNextPage]);

  return (
    <section className="bg-gray-300 dark:bg-[#1C1C1C] text-black dark:text-[#FFFFFF] flex flex-col flex-25 gap-4 p-4 overflow-auto [scrollbar-color:#d1d5db_#e5e7eb] dark:[scrollbar-color:rgba(255,255,255,0.4)_rgba(24,24,24,1)]">
      <h1 className="py-2 text-[22px] text-black dark:text-[rgba(255,255,255,1)]">
        {folderName}
      </h1>

      {err && <p className="text-red-400">{err.message}</p>}

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

      {hasNextPage && <div ref={divScrollRef} className="h-1"> hello </div>}

      {!hasNextPage && notes.length > 0 && (
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
