import favoritesLogo from "../assets/archived-logo.svg";
import trashLogo from "../assets/bin-logo.svg";
import archivedLogo from "../assets/archived-logo.svg";
import { NavLink } from "react-router";
import { useFolderContextData } from "../context/FolderContext";
import { useMemo } from "react";

export function MoreMenu() {
  const { setFolderData } = useFolderContextData();
  const favFolder = useMemo(
    () => ({
      id: "favorite",
      name: "Favorite",
      createdAt: "",
      updatedAt: "",
      deletedAt: "",
    }),
    [],
  );
  const trashFolder = useMemo(
    () => ({
      id: "trash",
      name: "Trash",
      createdAt: "",
      updatedAt: "",
      deletedAt: "",
    }),
    [],
  );
  const archivedFolder = useMemo(
    () => ({
      id: "archived",
      name: "Archived",
      createdAt: "",
      updatedAt: "",
      deletedAt: "",
    }),
    [],
  );

  return (
    <section>
      <h2 className="px-[6%] py-2 text-[rgba(255,255,255,0.6)] text-[14px]">
        More
      </h2>
      <ul>
        <li>
          <NavLink
            to="/dashboard/folder/favorite"
            className={({ isActive }) =>
              `px-[6%] py-2 flex items-center gap-4 ${isActive ? "bg-[rgba(255,255,255,0.03)]" : ""}`
            }
            onClick={() => {
              setFolderData(favFolder);
            }}
          >
            {({ isActive }) => (
              <>
                <img src={favoritesLogo} alt="favorites-logo" />
                <p
                  className={`${isActive ? "text-[rgba(255,255,255,1)]" : "text-[rgba(255,255,255,0.6)]"} text-[16px]`}
                >
                  Favorites
                </p>
              </>
            )}
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/dashboard/folder/trash"
            className={({ isActive }) =>
              `px-[6%] py-2 flex items-center gap-4 ${isActive ? "bg-[rgba(255,255,255,0.03)]" : ""}`
            }
            onClick={() => {
              setFolderData(trashFolder);
            }}
          >
            {({ isActive }) => (
              <>
                <img src={trashLogo} alt="trash-logo" />
                <p
                  className={`${isActive ? "text-[rgba(255,255,255,1)]" : "text-[rgba(255,255,255,0.6)]"} text-[16px]`}
                >
                  Trash
                </p>
              </>
            )}
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/dashboard/folder/archived"
            className={({ isActive }) =>
              `px-[6%] py-2 flex items-center gap-4 ${isActive ? "bg-[rgba(255,255,255,0.03)]" : ""}`
            }
            onClick={() => {
              setFolderData(archivedFolder);
            }}
          >
            {({ isActive }) => (
              <>
                <img src={archivedLogo} alt="archived-logo" />
                <p
                  className={`${isActive ? "text-[rgba(255,255,255,1)]" : "text-[rgba(255,255,255,0.6)]"} text-[16px]`}
                >
                  Archived Notes
                </p>
              </>
            )}
          </NavLink>
        </li>
      </ul>
    </section>
  );
}
