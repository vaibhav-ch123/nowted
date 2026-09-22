import nowtedLogo from "../assets/nowted-logo.svg";
import searchIcon from "../assets/search-icon.svg";
import fileLogo from "../assets/file-logo.svg";
import folderLogo from "../assets/folder-logo.svg";
import folderOpenLogo from "../assets/open-folder-logo.svg";
import favoritesLogo from "../assets/archived-logo.svg";
import trashLogo from "../assets/bin-logo.svg";
import archivedLogo from "../assets/archived-logo.svg";
import addFolderLogo from "../assets/add-folder-logo.svg";

export function SideBar() {
  return (
    <aside className="bg-[#181818] text-[#FFFFFF] flex-20 flex flex-col gap-4 py-4 overflow-auto">
      <div className="flex justify-between px-[6%] py-2">
        <img src={nowtedLogo} alt="nowted-logo" />
        <img src={searchIcon} alt="search-icon" />
      </div>

      <div className="px-[6%]">
        <button className="w-full rounded-[3px] bg-[rgba(255,255,255,0.05)] text-[#FFFFFF] text-[16px] py-2">+ New Note</button>
      </div>

      <section>
        <h2 className="px-[6%] py-2 text-[rgba(255,255,255,0.6)] text-[14px]">Recents</h2>
        <ul>
            <li className="px-[6%] py-2 bg-[rgba(49,46,181,1)] flex items-center gap-4">
                <img src={fileLogo} alt="file-logo" />
                <a href="#" className="text-[rgba(255,255,255,1)] text-[16px]">Reflection on the Month of June</a>
            </li>
            <li className="px-[6%] py-2 flex items-center gap-4">
                <img src={fileLogo} alt="file-logo"/>
                <a href="#" className="text-[rgba(255,255,255,0.6)] text-[16px]">Project Proposal</a>
            </li>
            <li className="px-[6%] py-2 flex items-center gap-4">
                <img src={fileLogo} alt="file-logo" />
                <a href="#" className="text-[rgba(255,255,255,0.6)] text-[16px]">Travel itinerary</a>
            </li>
        </ul>
      </section>

      <section>
        <div className="px-[6%] py-2 flex justify-between">
          <h2 className="text-[rgba(255,255,255,0.6)] text-[14px]">Folders</h2>
          <img src={addFolderLogo} alt="add-folder-logo" />
        </div>
        <ul>
            <li className="bg-[rgba(255,255,255,0.03)] px-[6%] py-2 flex items-center gap-4">
                <img src={folderOpenLogo} alt="folder-open-logo" />
                <a href="#" className="text-[rgba(255,255,255,1)] text-[16px]">Personal</a>
            </li>
            <li className="px-[6%] py-2 flex items-center gap-4">
                <img src={folderLogo} alt="folder-logo" />
                <a href="#" className="text-[rgba(255,255,255,0.6)] text-[16px]">Work</a>
            </li>
            <li className="px-[6%] py-2 flex items-center gap-4">
                <img src={folderLogo} alt="folder-logo" />
                <a href="#" className="text-[rgba(255,255,255,0.6)] text-[16px]">Travel</a>
            </li>
            <li className="px-[6%] py-2 flex items-center gap-4">
                <img src={folderLogo} alt="folder-logo" />
                <a href="#" className="text-[rgba(255,255,255,0.6)] text-[16px]">Events</a>
            </li>
            <li className="px-[6%] py-2 flex items-center gap-4">
                <img src={folderLogo} alt="folder-logo" />
                <a href="#" className="text-[rgba(255,255,255,0.6)] text-[16px]">Finances</a>
            </li>
        </ul>
      </section>

      <section>
        <h2 className="px-[6%] py-2 text-[rgba(255,255,255,0.6)] text-[14px]">More</h2>
        <ul>
            <li className="px-[6%] py-2 flex items-center gap-4">
                <img src={favoritesLogo} alt="favorites-logo" />
                <a href="#" className="text-[rgba(255,255,255,0.6)] text-[16px]">Favorites</a>
            </li>
            <li className="px-[6%] py-2 flex items-center gap-4">
                <img src={trashLogo} alt="trash-logo"/>
                <a href="#" className="text-[rgba(255,255,255,0.6)] text-[16px]">Trash</a>
            </li>
            <li className="px-[6%] py-2 flex items-center gap-4">
                <img src={archivedLogo} alt="archived-logo" />
                <a href="#" className="text-[rgba(255,255,255,0.6)] text-[16px]">Archived Notes</a>
            </li>
        </ul>
      </section>
    </aside>
  );
}
