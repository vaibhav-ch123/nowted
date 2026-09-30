import folderLogo from "../assets/folder-logo.svg";
import folderOpenLogo from "../assets/open-folder-logo.svg";
import addFolderLogo from "../assets/add-folder-logo.svg";
import trashLogo from "../assets/bin-logo.svg";
import { useState, useEffect } from "react";
import {
  createFolder,
  deleteFolder,
  editFolder,
  getFolders,
} from "../api/folderApi";
import { NavLink, useLocation, useNavigate } from "react-router";
import { useFolderListContext } from "../context/FolderListContext";
import { toast } from "sonner";
import { useRefreshFileContext } from "../context/FileContext";

export function FolderLists() {
  const [refreshFolderList, setRefreshFolderList] = useState(0);
  const { folderList, setFolderList } = useFolderListContext();
  const { setRefreshFile } = useRefreshFileContext();
  const [folderName, setFolderName] = useState("");
  const [openCreateFolderInput, setOpenCreateFolderInput] = useState(false);
  const [editFolderId, setEditFolderId] = useState("");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target;

      if (!(target instanceof Element)) return;

      if (
        target.closest("[data-menu-trigger]") ||
        target.closest("[data-menu-content]")
      )
        return;

      setOpenCreateFolderInput(false);
      setEditFolderId("");
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  useEffect(() => {
    setErr("");
    async function loadFolders() {
      try {
        const foldersData = await getFolders();
        setFolderList(foldersData);
      } catch (e) {
        setErr("failed to load folder data");
      } finally {
        setLoading(false);
      }
    }

    loadFolders();
  }, [refreshFolderList]);

  async function handleCreateFolder() {
    try {
      const message = await createFolder(folderName);
      toast.success(message);
      setRefreshFolderList((prev) => prev + 1);
    } catch (err) {
      console.log(err);
      toast.error("failed to create folder");
    } finally {
      setFolderName("");
    }
  }

  async function handleEditFolder(folderName: string, folderId: string) {
    try {
      const message = await editFolder(folderName, folderId);
      toast.success(message);
      setRefreshFolderList((prev) => prev + 1);
    } catch (err) {
      console.log(err);
      toast.error("failed to edit folder");
    } finally {
      setFolderName("");
    }
  }

  async function handleDeleteFolder(folderId: string) {
    try {
      const message = await deleteFolder(folderId);
      toast.success(message);
      setRefreshFolderList((prev) => prev + 1);
      setRefreshFile((prev) => prev+1);
      navigate("/dashboard/All Notes/all-notes")
    } catch (err) {
      console.log(err);
      toast.error("failed to delete folder");
    }
  }

  if (loading)
    return (
      <p className="px-[6%] py-2 text-black dark:text-[rgba(255,255,255,0.6)] text-[14px]">
        loading...
      </p>
    );

  if (err)
    return <p className="px-[6%] py-2 text-red-400 text-[14px]">{err}</p>;

  return (
    <section className="h-[30%] overflow-auto [scrollbar-color:#d1d5db_#e5e7eb] dark:[scrollbar-color:rgba(255,255,255,0.4)_rgba(24,24,24,1)]">
      <div className="px-[6%] py-2 flex justify-between">
        <h2 className="text-black dark:text-[rgba(255,255,255,0.6)] text-[14px]">Folders</h2>
        <img
          src={addFolderLogo}
          alt="add-folder-logo"
          className="cursor-pointer invert dark:invert-0"
          data-menu-trigger
          onClick={() => {
            setOpenCreateFolderInput(true);
            setFolderName("");
            setEditFolderId("");
          }}
        />
      </div>

      {openCreateFolderInput && (
        <div
          className="bg-white dark:bg-[rgba(255,255,255,0.03)] px-[6%] py-2 flex items-center gap-4"
          data-menu-content
        >
          <img src={folderOpenLogo} alt="folder-open-logo" className="invert dark:invert-0" />
          <input
            className="text-black dark:text-[rgba(255,255,255,1)] border border-black dark:border-[rgba(255,255,255,0.4)] outline-none text-[16px] w-[50%]"
            value={folderName}
            onChange={(e) => {
              setFolderName(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                if (folderName.trim() === "") return;
                setOpenCreateFolderInput(false);
                handleCreateFolder();
              }
            }}
          />
        </div>
      )}

      <ul>
        {folderList?.map((folder) => (
          <li key={folder.id}>
            {editFolderId === folder.id ? (
              <div
                className="px-[6%] py-2 flex items-center gap-4"
                data-menu-content
              >
                <img src={folderOpenLogo} alt="folder-open-logo" className="invert dark:invert-0" />
                <input
                  className="text-black dark:text-[rgba(255,255,255,1)] border border-black dark:border-[rgba(255,255,255,0.4)] outline-none text-[16px] w-[50%]"
                  value={folderName}
                  onChange={(e) => {
                    setFolderName(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      if (
                        folderName.trim() === "" ||
                        folderName === folder.name
                      )
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
                        <img src={trashLogo} className="w-3.5 invert dark:invert-0" />{" "}
                      </button>
                    </div>
                  </>
                )}
              </NavLink>
            )}
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
