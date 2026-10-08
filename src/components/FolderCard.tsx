import folderOpenLogo from "../assets/open-folder-logo.svg";
import folderLogo from "../assets/folder-logo.svg";
import trashLogo from "../assets/bin-logo.svg";
import { deleteFolder, editFolder } from "../api/folderApi";
import { useSetRefreshFileContext } from "../context/FileContext";
import { NavLink, useLocation, useNavigate, useParams } from "react-router";
import type React from "react";
import type { Folder } from "../types/folder";
import { toast } from "sonner";
import { useState } from "react";

export function FolderCard({
  setOpenCreateFolderInput,
  setEditFolderId,
  editFolderId,
  setRefreshFolderList,
  folder
}: {
  setOpenCreateFolderInput: React.Dispatch<React.SetStateAction<boolean>>,
  setEditFolderId: React.Dispatch<React.SetStateAction<string>>,
  editFolderId: string,
  setRefreshFolderList: React.Dispatch<React.SetStateAction<number>>,
  folder: Folder
}) {

  const { setRefreshFile } = useSetRefreshFileContext();
  const [folderName, setFolderName] = useState("");
  const { folderId, noteId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  async function handleEditFolder(folderName: string, editFolderId: string) {
    try {
      const message = await editFolder(folderName, editFolderId);
      toast.success(message);
      setRefreshFolderList((prev) => prev + 1);
      if (folderId === editFolderId)
        navigate(
          `/dashboard/${folderName}/${editFolderId}${noteId ? `/note/${noteId}` : ``}`,
        );
    } catch (err) {
      if (err instanceof Error) {
        console.log(err);
      }
      toast.error("failed to edit folder");
    } finally {
      setFolderName("");
    }
  }

  async function handleDeleteFolder(deleteFolderId: string) {
    try {
      const message = await deleteFolder(deleteFolderId);
      toast.success(message);
      setRefreshFolderList((prev) => prev + 1);
      setRefreshFile((prev) => prev + 1);
      if (folderId === deleteFolderId)
        navigate("/dashboard/All Notes/all-notes");
    } catch (err) {
      if (err instanceof Error) {
        console.log(err);
      }
      toast.error("failed to delete folder");
    }
  }

  return (
    <li key={folder.id}>
      {editFolderId === folder.id ? (
        <div className="px-[6%] py-2 flex items-center gap-4" data-menu-content>
          <img
            src={folderOpenLogo}
            alt="folder-open-logo"
            className="invert dark:invert-0"
          />
          <input
            className="text-black dark:text-[rgba(255,255,255,1)] border border-black dark:border-[rgba(255,255,255,0.4)] outline-none text-[16px] w-[50%]"
            value={folderName}
            autoFocus
            onChange={(e) => {
              setFolderName(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                if (folderName.trim() === "" || folderName === folder.name)
                  return;
                setEditFolderId("");
                handleEditFolder(folderName, folder.id);
              }
            }}
          />
        </div>
      ) : (
        <NavLink
          to={`/dashboard/${folder.name}/${folder.id}`}
          className={({ isActive }) =>
            `group px-[6%] py-2 flex items-center justify-between hover:bg-gray-100 dark:hover:bg-[rgba(255,255,255,0.03)] ${isActive ? "dark:bg-[rgba(255,255,255,0.03)] bg-gray-100" : ""}`
          }
          onClick={(e) => {
            const pathFolderId = location.pathname.split("/")[3];
            if (pathFolderId === folder.id) {
              e.preventDefault();
              navigate(`/dashboard/All Notes/all-notes`);
            }
          }}
        >
          {({ isActive }) => (
            <>
              <div className="flex gap-4">
                <img
                  src={isActive ? folderOpenLogo : folderLogo}
                  alt="folder-open-logo"
                  className="invert dark:invert-0"
                />
                <p
                  className={`${isActive ? "dark:text-[rgba(255,255,255,1)]" : "dark:text-[rgba(255,255,255,0.6)]"} text-black truncate text-[16px]`}
                >
                  {folder.name}
                </p>
              </div>
              <div className="hidden group-hover:flex gap-4">
                <button
                  className="cursor-pointer text-black dark:text-[rgba(255,255,255,0.6)] dark:hover:text-[rgba(255,255,255,1)]"
                  data-menu-trigger
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setFolderName(folder.name);
                    setOpenCreateFolderInput(false);
                    setEditFolderId(folder.id);
                  }}
                >
                  {" "}
                  ✎{" "}
                </button>
                <button
                  className="cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleDeleteFolder(folder.id);
                  }}
                >
                  {" "}
                  <img
                    src={trashLogo}
                    className="w-3.5 invert dark:invert-0"
                  />{" "}
                </button>
              </div>
            </>
          )}
        </NavLink>
      )}
    </li>
  );
}
