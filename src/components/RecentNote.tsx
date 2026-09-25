import { useEffect, useState } from "react";
import fileLogo from "../assets/file-logo.svg";
import { getRecentFile } from "../api/notesApi";
import type { Note } from "../types/note";
import { NavLink, useParams } from "react-router";

export function RecentNote() {
  const { noteId } = useParams();
  const [recentFile, setRecentFile] = useState<Note[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [err, setErr] = useState<string>("");

  useEffect(() => {
    async function loadRecentFile() {
      try {
        const recentFile = await getRecentFile();
        setRecentFile(recentFile);
      } catch (e) {
        setErr("failed to load recent file");
      } finally {
        setLoading(false);
      }
    }

    loadRecentFile();
  }, [noteId]);

  if (loading) return <p>loading...</p>;
  if (err) return <p>{err}</p>;

  return (
    <section>
      <h2 className="px-[6%] py-2 text-[rgba(255,255,255,0.6)] text-[14px]">
        Recents
      </h2>

      <ul>
        {recentFile?.map((note) => (
          <li key={note.id}>
            <NavLink
              to={`note/${note.id}`}
              className={({ isActive }) =>
                `px-[6%] py-2 flex items-center gap-4 ${isActive ? "bg-[rgba(49,46,181,1)]" : ""}`
              }
            >
              {({ isActive }) => (
                <>
                  <img src={fileLogo} alt="file-logo" />
                  <p className={`${isActive ? "text-[rgba(255,255,255,1)]" : "text-[rgba(255,255,255,0.6)]"} text-[16px]`}>
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
