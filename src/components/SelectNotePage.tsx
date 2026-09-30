import selectFileImg from "../assets/select-file.svg"

export function SelectNotePage () {
  
    return (
      <section className="bg-gray-200 dark:bg-[#181818] flex flex-col justify-center items-center gap-2 flex-55 py-10 px-8 text-center overflow-auto">
        <img src={selectFileImg} alt="file-logo" className="h-20 w-20 invert dark:invert-0" />
        <h1 className="text-black dark:text-[#FFFFFF] text-[28px]">Select a note to view</h1>
        <p className="text-black dark:text-[rgba(255,255,255,0.6)] text-[16px]">Choose a note from the list on the left to view its contents, or create a new note to add to your collection.</p>
      </section>
    );
}