import folderLogo from "../assets/folder-logo.svg";
import folderOpenLogo from "../assets/open-folder-logo.svg";
import addFolderLogo from "../assets/add-folder-logo.svg";
import { useState, useEffect } from "react";
import { getFolders } from "../api/folderApi";
import type { Folder } from "../types/folder";
import { NavLink } from "react-router";
import { useFolderId } from "../context/FolderContext";

export function FolderLists() {
  const { setFolderId } = useFolderId();
  const [folders, setFolders] = useState<Folder[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [err, setErr] = useState<string>("");

  useEffect(() => {
    async function loadFolders() {
      try {
        const foldersData = await getFolders();
        setFolders(foldersData);
      } catch (e) {
        setErr("failed to load folder data");
      } finally {
        setLoading(false);
      }
    }

    loadFolders();
  }, []);

  if (loading) return <p>Loading..</p>;
  if (err) return <p>{err}</p>;

  return (
    <section>
      <div className="px-[6%] py-2 flex justify-between">
        <h2 className="text-[rgba(255,255,255,0.6)] text-[14px]">Folders</h2>
        <img src={addFolderLogo} alt="add-folder-logo" />
      </div>
      <ul>
        {folders?.map((folder) => (
          <li key={folder.id}>
            <NavLink
              to={`/dashboard/folder/${folder.id}`}
              className={({ isActive }) =>
                `px-[6%] py-2 flex items-center gap-4 ${isActive ? "bg-[rgba(255,255,255,0.03)]" : ""}`
              }
              onClick={() => {
                setFolderId(folder.id);
              }}
            >
              {({ isActive }) => (
                <>
                  <img
                    src={isActive ? folderOpenLogo : folderLogo}
                    alt="folder-open-logo"
                  />
                  <p
                    className={`${isActive ? "text-[rgba(255,255,255,1)]" : "text-[rgba(255,255,255,0.6)]"} text-[16px]`}
                  >
                    {folder.name}
                  </p>
                </>
              )}
            </NavLink>
          </li>
        ))}
        {/* <li className="bg-[rgba(255,255,255,0.03)] px-[6%] py-2 flex items-center gap-4">
          <img src={folderOpenLogo} alt="folder-open-logo" />
          <a href="#" className="text-[rgba(255,255,255,1)] text-[16px]">
            Personal
          </a>
        </li>
        <li className="px-[6%] py-2 flex items-center gap-4">
          <img src={folderLogo} alt="folder-logo" />
          <a href="#" className="text-[rgba(255,255,255,0.6)] text-[16px]">
            Work
          </a>
        </li>
        <li className="px-[6%] py-2 flex items-center gap-4">
          <img src={folderLogo} alt="folder-logo" />
          <a href="#" className="text-[rgba(255,255,255,0.6)] text-[16px]">
            Travel
          </a>
        </li>
        <li className="px-[6%] py-2 flex items-center gap-4">
          <img src={folderLogo} alt="folder-logo" />
          <a href="#" className="text-[rgba(255,255,255,0.6)] text-[16px]">
            Events
          </a>
        </li>
        <li className="px-[6%] py-2 flex items-center gap-4">
          <img src={folderLogo} alt="folder-logo" />
          <a href="#" className="text-[rgba(255,255,255,0.6)] text-[16px]">
            Finances
          </a>
        </li> */}
      </ul>
    </section>
  );
}
