import { Logo } from "./Logo";
import { NewNoteBtn } from "./NewNoteBtn";
import { RecentNote } from "./RecentNote";
import { FolderLists } from "./FolderLists";
import { MoreMenu } from "./MoreMenu";

export function SideBar() {
  return (
    <aside className="bg-[#181818] text-[#FFFFFF] flex-20 flex flex-col gap-4 py-4 overflow-auto">
      
      <Logo /> 
      <NewNoteBtn />

      <RecentNote />

      <FolderLists />  

      <MoreMenu />
      
    </aside>
  );
}
