import { Logo } from "./Logo";
import { NewNoteBtn } from "./NewNoteBtn";
import { RecentNote } from "./RecentNote";
import { FolderLists } from "./FolderLists";
import { MoreMenu } from "./MoreMenu";
import { useState } from "react";

export function SideBar() {
  const [toggleSearch, setToggleSearch] = useState(false);

  return (
    <aside
      className="bg-gray-200 text-black dark:bg-[#181818] dark:text-[#FFFFFF]
      flex-20 flex flex-col gap-4 py-4 overflow-auto
      [scrollbar-color:#d1d5db_#e5e7eb] dark:[scrollbar-color:rgba(255,255,255,0.4)_rgba(24,24,24,1)]"
    >
      <Logo toggleSearch={toggleSearch} setToggleSearch={setToggleSearch} />
      <NewNoteBtn toggleSearch={toggleSearch} />

      <RecentNote />

      <FolderLists />

      <MoreMenu />
    </aside>
  );
}
