import { useEffect, useState } from "react";
import fileLogo from "../assets/file-logo.svg";
import { getRecentFile } from "../api/notesApi";
import type { Note } from "../types/note";
import { NavLink } from "react-router";
import { useRefreshFileContext } from "../context/FileContext";

export function RecentNote() {
  const [recentFile, setRecentFile] = useState<Note[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const { refreshFile } = useRefreshFileContext();
  useEffect(() => {
    setErr("");
    let cancelled = false;
    async function loadRecentFile() {
      try {
        const recentFile = await getRecentFile();
        if (cancelled) return;
        setRecentFile(recentFile);
      } catch (err) {
        if (!cancelled) {
          if (err instanceof Error) {
            console.log(err.message);
          }
          setErr("failed to load recent file");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadRecentFile();

    return () => {
      cancelled = true;
    };
  }, [refreshFile]);

  if (loading)
    return (
      <p className="px-[6%] py-2 text-[rgba(255,255,255,0.6)] text-[14px]">
        loading...
      </p>
    );
  if (err)
    return <p className="px-[6%] py-2 text-red-400 text-[14px]">{err}</p>;

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
        {/* <li className="px-[6%] py-2 bg-[rgba(49,46,181,1)] flex items-center gap-4">
          <img src={fileLogo} alt="file-logo" />
          <a href="#" className="text-[rgba(255,255,255,1)] text-[16px]">
            Reflection on the Month of June
          </a>
        </li>
        <li className="px-[6%] py-2 flex items-center gap-4">
          <img src={fileLogo} alt="file-logo" />
          <a href="#" className="text-[rgba(255,255,255,0.6)] text-[16px]">
            Project Proposal
          </a>
        </li>
        <li className="px-[6%] py-2 flex items-center gap-4">
          <img src={fileLogo} alt="file-logo" />
          <a href="#" className="text-[rgba(255,255,255,0.6)] text-[16px]">
            Travel itinerary
          </a>
        </li> */}
      </ul>
    </section>
  );
}
