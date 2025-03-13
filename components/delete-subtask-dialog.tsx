"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { deleteSubtask } from "@/lib/actions";

type DeleteSubtaskDialogProps = {
  projectId: string;
  subtaskId: string;
  subtaskName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function DeleteSubtaskDialog({
  projectId,
  subtaskId,
  subtaskName,
  open,
  onOpenChange,
}: DeleteSubtaskDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteSubtask(subtaskId, projectId);
    } catch (error) {
      console.error("Failed to delete subtask:", error);
      setIsDeleting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Subtask</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete &quot;{subtaskName}&quot;? This
            action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}>
            {isDeleting ? "Deleting..." : "Delete Subtask"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
