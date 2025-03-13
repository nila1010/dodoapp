"use client";

import { useState } from "react";
import Link from "next/link";
import { PlusCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDuration } from "@/lib/utils";
import { NewSubtaskDialog } from "./new-subtask-dialog";

type Subtask = {
  id: string;
  name: string;
  description: string | null;
  totalTime: number;
  totalTasks: number;
};

export function SubtasksList({
  projectId,
  subtasks,
}: {
  projectId: string;
  subtasks: Subtask[];
}) {
  const [showNewSubtaskDialog, setShowNewSubtaskDialog] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Subtasks</h2>
        <Button onClick={() => setShowNewSubtaskDialog(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Subtask
        </Button>
      </div>

      {subtasks.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-muted/20">
          <h3 className="text-lg font-medium">No subtasks yet</h3>
          <p className="text-muted-foreground mt-1">
            Create your first subtask to get started
          </p>
          <Button
            className="mt-4"
            onClick={() => setShowNewSubtaskDialog(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Subtask
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subtasks.map((subtask) => (
            <Link
              href={`/projects/${projectId}/subtasks/${subtask.id}`}
              key={subtask.id}
              className="block">
              <Card className="h-full hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle>{subtask.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    <h3 className="font-medium">{subtask.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {subtask.description}
                    </p>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{formatDuration(subtask.totalTime)}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Tasks</span>
                      <span>{subtask.totalTasks} tasks</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      <NewSubtaskDialog
        projectId={projectId}
        open={showNewSubtaskDialog}
        onOpenChange={setShowNewSubtaskDialog}
      />
    </div>
  );
}
