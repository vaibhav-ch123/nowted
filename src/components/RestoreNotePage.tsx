import restoreFileImg from "../assets/restore-file.svg";

export function RestoreNotePage() {
  return (
    <section className="bg-[#181818] flex flex-col justify-center items-center gap-2 flex-55 py-10 px-8 text-center overflow-auto">
      <img src={restoreFileImg} alt="file-logo" className="h-20 w-20" />
      <h1 className="text-[#FFFFFF] text-[28px]">
        Restore "Reflection on the Month of June"
      </h1>
      <p className="text-[rgba(255,255,255,0.6)] text-[16px]">
        Don't want to lose this note? It's not to late! Just click the 'Restore'
        button and it will be added back to your list. It's that simple.
      </p>
      <button className="bg-[rgba(49,46,181,1)] text-[#FFFFFF] text-[16px] rounded-md px-6 py-2">Restore</button>
    </section>
  );
}
