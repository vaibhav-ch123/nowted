import optionLogo from "../assets/option-logo.svg";
import dateLogo from "../assets/date-logo.svg";
import folderLogo from "../assets/add-folder-logo.svg";

export function NoteDetail() {
  return (
    <article className="bg-[#181818] text-[#FFFFFF] flex flex-col flex-55 gap-6 px-8 py-10 overflow-auto">
      <section className="flex justify-between">
        <h1 className="text-[32px] text-[rgba(255,255,255,1)]">Reflection on the month of June</h1>
        <img src={optionLogo} alt="option-logo" />
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
