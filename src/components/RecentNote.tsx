import React from "react";
import fileLogo from "../assets/file-logo.svg";
import { getRecentFile } from "../api/notesApi";
import { NavLink } from "react-router";
import { useQuery } from "@tanstack/react-query";

export const RecentNote = React.memo(function RecentNote() {

  const {
    data: recentFile,
    isLoading: loading,
    error: err,
  } = useQuery({
    queryKey: ["recentNotes"],
    queryFn: ({signal}) => getRecentFile(signal),
  });

  if (loading)
    return (
      <p className="px-[6%] py-2 text-[rgba(255,255,255,0.6)] text-[14px]">
        loading...
      </p>
    );
  if (err)
    return <p className="px-[6%] py-2 text-red-400 text-[14px]">{err.message}</p>;

  return (
    <section>
      <h2 className="px-[6%] py-2 text-black dark:text-[rgba(255,255,255,0.6)] text-[14px]">
        Recents
      </h2>

      <ul>
        {recentFile?.map((note) => (
          <li key={note.id}>
            <NavLink
              to={`/dashboard/${note.folder.name}/${note.folderId}/note/${note.id}`}
              className={({ isActive }) =>
                `px-[6%] py-2 flex items-center gap-4 hover:bg-[rgba(49,46,181,1)] ${isActive ? "bg-[rgba(49,46,181,1)]" : ""}`
              }
            >
              {({ isActive }) => (
                <>
                  <img
                    src={fileLogo}
                    alt="file-logo"
                    className="invert dark:invert-0"
                  />
                  <p
                    className={`${isActive ? "dark:text-[rgba(255,255,255,1)]" : "dark:text-[rgba(255,255,255,0.6)]"} text-black truncate text-[16px]`}
                  >
                    {note.title}
                  </p>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </section>
  );
});
