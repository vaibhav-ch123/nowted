import { useEffect, useState } from "react";
import restoreFileImg from "../assets/restore-file.svg";
import { useNavigate, useParams } from "react-router";
import { getNote, restoreNote } from "../api/notesApi";
import type { CreateNote } from "../types/note";
import { toast } from "sonner";
import { useRefreshFileContext } from "../context/FileContext";
import { useRefreshFolderContext } from "../context/FolderContext";

export function RestoreNotePage() {
  const [note, setNote] = useState<CreateNote>({
    folderId: "",
    title: "",
    content: "",
    isFavorite: false,
    isArchived: false,
  });
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const { noteId } = useParams();
  const { setRefreshFile } = useRefreshFileContext();
  const { setRefreshFolder } = useRefreshFolderContext();
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    async function loadNote() {
      if (!noteId) return;

      try {
        const noteData = await getNote(noteId);

        if (cancelled) return;
        setNote({
          folderId: noteData.folderId ? noteData.folderId : "",
          title: noteData.title,
          content: noteData.content ? noteData.content : "",
          isFavorite: noteData.isFavorite,
          isArchived: noteData.isArchived,
        });
      } catch (e) {
        if (!cancelled) {
          setErr("failed to load note!");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadNote();

    return () => {
      cancelled = true;
    };
  }, [noteId]);

  async function handleRestoreNote(noteId: string) {
    try {
      const message = await restoreNote(noteId);
      toast.success(message);
      setRefreshFile(prev => prev+1);
      setRefreshFolder(prev => prev+1);
      navigate("../");
    } catch (err) {
      console.log(err);
      toast.error("failed to restore note");
    }
  }

  if (loading)
    return (
      <p className="bg-[#181818] text-[#FFFFFF] flex flex-col flex-55 gap-6 px-8 py-10">
        Loading..
      </p>
    );

  if (err)
    return (
      <p className="bg-[#181818] text-red-400 flex flex-col flex-55 gap-6 px-8 py-10">
        {err}
      </p>
    );

  return (
    <section className="bg-[#181818] flex flex-col justify-center items-center gap-2 flex-55 py-10 px-8 text-center overflow-auto">
      <img src={restoreFileImg} alt="file-logo" className="h-20 w-20" />
      <h1 className="text-[#FFFFFF] text-[28px]">Restore "{note.title}"</h1>
      <p className="text-[rgba(255,255,255,0.6)] text-[16px]">
        Don't want to lose this note? It's not to late! Just click the 'Restore'
        button and it will be added back to your list. It's that simple.
      </p>
      <button
        className="bg-[rgba(49,46,181,1)] text-[#FFFFFF] text-[16px] rounded-md px-6 py-2"
        onClick={() => {
          if (!noteId) return;
          handleRestoreNote(noteId);
        }}
      >
        Restore
      </button>
    </section>
  );
}
