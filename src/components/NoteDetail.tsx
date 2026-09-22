import optionLogo from "../assets/option-logo.svg";
import dateLogo from "../assets/date-logo.svg";
import folderLogo from "../assets/add-folder-logo.svg";
import archiveLogo from "../assets/archived-logo.svg";
import favLogo from "../assets/fav-logo.svg";
import binLogo from "../assets/bin-logo.svg";
import { useState } from "react";

export function NoteDetail() {
  
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  
  function handleMenuToggle(): void {
    setIsMenuOpen(!isMenuOpen);
  }

  return (
    <article className="bg-[#181818] text-[#FFFFFF] flex flex-col flex-55 gap-6 px-8 py-10 overflow-auto">
      <section className="flex justify-between items-center">
        <h1 className="text-[32px] text-[rgba(255,255,255,1)]">Reflection on the month of June</h1>
        <div className="relative">
          <img src={optionLogo} alt="option-logo" onClick={handleMenuToggle} className="" />
          { isMenuOpen && (<div className="absolute top-12 right-0 bg-[#333333] w-50 rounded-md">
            <ul className="flex flex-col">
                <li className="flex gap-4 px-4 py-2 hover:bg-[rgba(255,255,255,0.03)]">
                    <img src={favLogo} alt="favorite-logo" />
                    <a href="#">Add to favorites</a>
                </li>
                <li className="flex gap-4 px-4 py-2 hover:bg-[rgba(255,255,255,0.03)]">
                    <img src={archiveLogo} alt="archived-logo" />
                    <a href="#">Archived</a>
                </li>
                <li className="px-4 py-2">
                    <hr className="text-[rgba(255,255,255,0.05)]" />
                </li>
                <li className="flex gap-4 px-4 py-2 hover:bg-[rgba(255,255,255,0.03)]">
                    <img src={binLogo} alt="bin-logo" />
                    <a href="#">Delete</a>
                </li>
            </ul>
          </div>) }
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex gap-6">
          <img src={dateLogo} alt="date-logo" />
          <div className="flex gap-24">
            <p className="text-[14px] text-[rgba(255,255,255,0.6)]">Date</p>
            <p className="text-[14px] text-[rgba(255,255,255,1)]">21/06/2026</p>
          </div>
        </div>
        <hr className="border-0 border-t border-t-[rgba(255,255,255,0.1)]" />
        <div className="flex gap-6">
          <img src={folderLogo} alt="folder-logo" />
          <div className="flex gap-24">
            <p className="text-[14px] text-[rgba(255,255,255,0.6)]">Folder</p>
            <p className="text-[14px] text-[rgba(255,255,255,1)]">Personal</p>
          </div>
        </div>
      </section>

      <section >
        <p>It's hard to believe that June is already over!</p>

        <p>
          One of the best things that happened was getting promoted at work...
        </p>

        <p>I also had a great time on my vacation to Hawaii...</p>
      </section>
    </article>
  );
}
