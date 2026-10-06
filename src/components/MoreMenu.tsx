import favoritesLogo from "../assets/archived-logo.svg";
import trashLogo from "../assets/bin-logo.svg";
import archivedLogo from "../assets/archived-logo.svg";
import { NavLink, useLocation, useNavigate } from "react-router";

export function MoreMenu() {
  const location = useLocation();
  const navigator = useNavigate();
  return (
    <section>
      <h2 className="px-[6%] py-2 text-black dark:text-[rgba(255,255,255,0.6)] text-[14px]">
        More
      </h2>
      <ul>
        <li>
          <NavLink
            to="/dashboard/Favorite/favorite"
            className={({ isActive }) =>
              `px-[6%] py-2 flex items-center gap-4 hover:bg-gray-100 dark:hover:bg-[rgba(255,255,255,0.03)] ${isActive ? "dark:bg-[rgba(255,255,255,0.03)] bg-gray-100" : ""}`
            }
            onClick={(e) => {
              const pathFolderId = location.pathname.split("/")[3];
              if (pathFolderId === "favorite") {
                e.preventDefault();
                navigator(`/dashboard/All Notes/all-notes`);
              }
            }}
          >
            {({ isActive }) => (
              <>
                <img
                  src={favoritesLogo}
                  alt="favorites-logo"
                  className="invert dark:invert-0"
                />
                <p
                  className={`${isActive ? "dark:text-[rgba(255,255,255,1)]" : "dark:text-[rgba(255,255,255,0.6)]"} text-black text-[16px]`}
                >
                  Favorites
                </p>
              </>
            )}
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/dashboard/Trash/trash"
            className={({ isActive }) =>
              `px-[6%] py-2 flex items-center gap-4 hover:bg-gray-100 dark:hover:bg-[rgba(255,255,255,0.03)] ${isActive ? "dark:bg-[rgba(255,255,255,0.03)] bg-gray-100" : ""}`
            }
            onClick={(e) => {
              const pathFolderId = location.pathname.split("/")[3];
              if (pathFolderId === "trash") {
                e.preventDefault();
                navigator(`/dashboard/All Notes/all-notes`);
              }
            }}
          >
            {({ isActive }) => (
              <>
                <img
                  src={trashLogo}
                  alt="trash-logo"
                  className="invert dark:invert-0"
                />
                <p
                  className={`${isActive ? "dark:text-[rgba(255,255,255,1)]" : "dark:text-[rgba(255,255,255,0.6)]"} text-black text-[16px]`}
                >
                  Trash
                </p>
              </>
            )}
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/dashboard/Archived/archived"
            className={({ isActive }) =>
              `px-[6%] py-2 flex items-center gap-4 hover:bg-gray-100 dark:hover:bg-[rgba(255,255,255,0.03)] ${isActive ? "dark:bg-[rgba(255,255,255,0.03)] bg-gray-100" : ""}`
            }
            onClick={(e) => {
              const pathFolderId = location.pathname.split("/")[3];
              if (pathFolderId === "archived") {
                e.preventDefault();
                navigator(`/dashboard/All Notes/all-notes`);
              }
            }}
          >
            {({ isActive }) => (
              <>
                <img
                  src={archivedLogo}
                  alt="archived-logo"
                  className="invert dark:invert-0"
                />
                <p
                  className={`${isActive ? "dark:text-[rgba(255,255,255,1)]" : "dark:text-[rgba(255,255,255,0.6)]"} text-black text-[16px]`}
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
