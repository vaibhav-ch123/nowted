import favoritesLogo from "../assets/archived-logo.svg";
import trashLogo from "../assets/bin-logo.svg";
import archivedLogo from "../assets/archived-logo.svg";
import { NavLink } from "react-router";
import { useFolderId } from "../context/FolderContext";

export function MoreMenu() {
  
  const {setFolderId} = useFolderId();

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
            onClick={() => {setFolderId("favorite")}}
          >
            {({ isActive }) => (
              <>
                <img src={favoritesLogo} alt="favorites-logo" />
                <p className={`${isActive ? "text-[rgba(255,255,255,1)]" : "text-[rgba(255,255,255,0.6)]"} text-[16px]`}>
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
            onClick={() => {setFolderId("trash")}}
          >
            {({ isActive }) => (
              <>
                <img src={trashLogo} alt="trash-logo" />
                <p className={`${isActive ? "text-[rgba(255,255,255,1)]" : "text-[rgba(255,255,255,0.6)]"} text-[16px]`}>
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
            onClick={() => {setFolderId("archived")}}
          >
            {({ isActive }) => (
              <>
                <img src={archivedLogo} alt="archived-logo" />
                <p className={`${isActive ? "text-[rgba(255,255,255,1)]" : "text-[rgba(255,255,255,0.6)]"} text-[16px]`}>
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
