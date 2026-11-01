import folderOpenLogo from "../assets/open-folder-logo.svg";
import addFolderLogo from "../assets/add-folder-logo.svg";
import React, { useState, useEffect } from "react";
import { createFolder, getFolders } from "../api/folderApi";
import { toast } from "sonner";
import { FolderCard } from "./FolderCard";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const FolderLists = React.memo(function FolderLists() {

  const [folderName, setFolderName] = useState("");
  const [openCreateFolderInput, setOpenCreateFolderInput] = useState(false);
  const [editFolderId, setEditFolderId] = useState("");
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target;

      if (!(target instanceof Element)) return;

      if (
        target.closest("[data-menu-trigger]") ||
        target.closest("[data-menu-content]")
      )
        return;

      setOpenCreateFolderInput(false);
      setEditFolderId("");
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  const {
    data: folderList,
    isLoading: loading,
    error: err,
  } = useQuery({
    queryKey: ["folders"],
    queryFn: ({ signal }) => getFolders(signal),
  });

  const createFolderMutation = useMutation({
    mutationFn: () => createFolder(folderName.trim()),

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

      toast.error("failed to create folder");
    },
  });

  if (loading)
    return (
      <p className="px-[6%] py-2 text-black dark:text-[rgba(255,255,255,0.6)] text-[14px]">
        loading...
      </p>
    );

  if (err)
    return (
      <p className="px-[6%] py-2 text-red-400 text-[14px]">{err.message}</p>
    );

  return (
    <section className="h-[30%] flex flex-col">
      <div className="px-[6%] py-2 flex justify-between">
        <h2 className="text-black dark:text-[rgba(255,255,255,0.6)] text-[14px]">
          Folders
        </h2>
        <img
          src={addFolderLogo}
          alt="add-folder-logo"
          className="cursor-pointer invert dark:invert-0"
          data-menu-trigger
          onClick={() => {
            setOpenCreateFolderInput(true);
            setFolderName("");
            setEditFolderId("");
          }}
        />
      </div>

      {openCreateFolderInput && (
        <div
          className="bg-white dark:bg-[rgba(255,255,255,0.03)] px-[6%] py-2 flex items-center gap-4"
          data-menu-content
        >
          <img
            src={folderOpenLogo}
            alt="folder-open-logo"
            className="invert dark:invert-0"
          />
          <input
            className="text-black dark:text-[rgba(255,255,255,1)] border border-black dark:border-[rgba(255,255,255,0.4)] outline-none text-[16px] w-[50%]"
            value={folderName}
            autoFocus
            onChange={(e) => {
              setFolderName(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                if (folderName.trim() === "") return;
                setOpenCreateFolderInput(false);
                createFolderMutation.mutate();
              }
            }}
          />
        </div>
      )}

      <ul className="flex-1 overflow-auto [scrollbar-color:#d1d5db_#e5e7eb] dark:[scrollbar-color:rgba(255,255,255,0.4)_rgba(24,24,24,1)]">
        {folderList?.map((folder) => (
          <FolderCard
            key={folder.id}
            setOpenCreateFolderInput={setOpenCreateFolderInput}
            setEditFolderId={setEditFolderId}
            editFolderId={editFolderId}
            folder={folder}
          />
        ))}
      </ul>
    </section>
  );
});
