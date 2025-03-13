"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Edit, Trash, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatDuration } from "@/lib/utils";
import { EditSubtaskDialog } from "./edit-subtask-dialog";
import { DeleteSubtaskDialog } from "./delete-subtask-dialog";

// Simplified Subtask type
type Subtask = {
  id: string;
  name: string;
  description: string | null;
  totalTime: number;
  totalTasks: number;
};

export function SubtaskDetails({
  projectId,
  projectName,
  subtask,
}: {
  projectId: string;
  projectName: string;
  subtask: Subtask;
}) {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [currentSubtask, setCurrentSubtask] = useState(subtask);

  return (
    <div className="space-y-6 mb-8">
      <div className="flex items-center gap-2">
        <Link href={`/projects/${projectId}`}>
          <Button
            variant="ghost"
            size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to {projectName}
          </Button>
        </Link>
      </div>

      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">{currentSubtask.name}</h1>
          <p className="text-muted-foreground mt-1">
            {currentSubtask.description}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowEditDialog(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setShowDeleteDialog(true)}>
            <Trash className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <span className="text-lg font-medium">
                {formatDuration(currentSubtask.totalTime)}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">Total Time</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <span className="text-lg font-medium">
                {currentSubtask.totalTasks}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">Total Tasks</p>
          </CardContent>
        </Card>
      </div>

      <EditSubtaskDialog
        subtask={currentSubtask}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        onUpdate={(updatedSubtask) => setCurrentSubtask(updatedSubtask)}
      />

      <DeleteSubtaskDialog
        projectId={projectId}
        subtaskId={currentSubtask.id}
        subtaskName={currentSubtask.name}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
      />
    </div>
  );
}
