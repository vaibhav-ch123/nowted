import restoreFileImg from "../assets/restore-file.svg";
import { useNavigate, useParams } from "react-router";
import { getNote, restoreNote } from "../api/notesApi";
import { toast } from "sonner";
import { getFolders, restoreFolder } from "../api/folderApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchContext } from "../context/SearchContext";

export function RestoreNotePage() {
 
  const { noteId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { searchValue } = useSearchContext();

  const {
    data: note,
    isLoading: noteLoading,
    error: noteErr,
  } = useQuery({
    queryKey: ["notes", noteId],
    queryFn: ({ signal }) => getNote(noteId!, signal),
    enabled: !!noteId,
  });

  const {
    data: folderList,
    isLoading: folderLoading,
    error: folderErr,
  } = useQuery({
    queryKey: ["folders"],
    queryFn: ({ signal }) => getFolders(signal),
  });

  async function handleRestoreFolderAndNote(folderId: string, noteId: string) {
    let hasFolderDeleted = true;

    folderList?.forEach((folder) => {
      if (folder.id === folderId) hasFolderDeleted = false;
    });

    if (hasFolderDeleted) {
      restoreFolderMutation.mutate(folderId);
    }

    restoreNoteMutation.mutate(noteId);
  }

  const restoreFolderMutation = useMutation({
    mutationFn: (folderId: string) => restoreFolder(folderId),
    onSuccess: (message) => {
      toast.success(message);
      queryClient.invalidateQueries({
        queryKey: ["folders"],
      });
    },
    onError: (err) => {
      if (err instanceof Error) {
        console.log(err.message);
      }
      toast.error("failed to restore folder");
    },
  });

  const restoreNoteMutation = useMutation({
    mutationFn: (noteId: string) => restoreNote(noteId),
    onSuccess: (message) => {
      toast.success(message);
      queryClient.invalidateQueries({
        queryKey: ["recentNotes"],
      });
      queryClient.invalidateQueries({
        queryKey: ["folderNotes", "trash", searchValue],
      });
      navigate("../");
    },
    onError: (err) => {
      if(err instanceof Error){
        console.log(err.message);
      }
      toast.error("failed to restore note");
    }
  });

  if (noteLoading || folderLoading)
    return (
      <p className="bg-gray-200 dark:bg-[#181818] text-black dark:text-[#FFFFFF] flex flex-col flex-55 gap-6 px-8 py-10">
        Loading..
      </p>
    );

  if (noteErr)
    return (
      <p className="bg-gray-200 dark:bg-[#181818] text-red-400 flex flex-col flex-55 gap-6 px-8 py-10">
        {noteErr.message}
      </p>
    );

  if (folderErr)
    return (
      <p className="bg-gray-200 dark:bg-[#181818] text-red-400 flex flex-col flex-55 gap-6 px-8 py-10">
        {folderErr.message}
      </p>
    );

  return (
    <section className="bg-gray-200 dark:bg-[#181818] flex flex-col justify-center items-center gap-2 flex-55 py-10 px-8 text-center overflow-auto">
      <img
        src={restoreFileImg}
        alt="file-logo"
        className="h-20 w-20 invert dark:invert-0"
      />
      <h1 className="text-black dark:text-[#FFFFFF] text-[28px]">
        Restore "{note?.title}"
      </h1>
      <p className="text-black dark:text-[rgba(255,255,255,0.6)] text-[16px]">
        Don't want to lose this note? It's not to late! Just click the 'Restore'
        button and it will be added back to your list. It's that simple.
      </p>
      <button
        className="bg-[rgba(49,46,181,1)] text-black dark:text-[#FFFFFF] text-[16px] rounded-md px-6 py-2"
        onClick={() => {
          if (!note) return;
          handleRestoreFolderAndNote(note.folderId, note.id);
        }}
      >
        Restore
      </button>
    </section>
  );
}
