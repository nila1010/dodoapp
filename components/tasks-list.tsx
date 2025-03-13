"use client";

import { useState } from "react";
import { PlusCircle, Clock, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatDuration } from "@/lib/utils";
import { NewTaskDialog } from "./new-task-dialog";
import { EditTaskDialog } from "./edit-task-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteTask } from "@/lib/actions";

type Task = {
  id: string;
  name: string;
  description: string | null;
  totalTime: number;
};

export function TasksList({
  subtaskId,
  tasks: initialTasks,
}: {
  subtaskId: string;
  tasks: Task[];
}) {
  const [showNewTaskDialog, setShowNewTaskDialog] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [tasks, setTasks] = useState(initialTasks);

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId);
      setTasks(tasks.filter((task) => task.id !== taskId));
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Tasks</h2>
        <Button onClick={() => setShowNewTaskDialog(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Task
        </Button>
      </div>

      {tasks.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-muted/20">
          <h3 className="text-lg font-medium">No tasks yet</h3>
          <p className="text-muted-foreground mt-1">
            Create your first task to get started
          </p>
          <Button
            className="mt-4"
            onClick={() => setShowNewTaskDialog(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Task
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {tasks.map((task) => (
            <Card key={task.id}>
              <CardContent className="p-4">
                <div className="grid grid-cols-[1fr_auto] gap-4 items-start">
                  <div className="space-y-1">
                    <h3 className="font-medium">{task.name}</h3>
                    {task.description && (
                      <p className="text-sm text-muted-foreground">
                        {task.description}
                      </p>
                    )}
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mt-2">
                      <Clock className="h-4 w-4" />
                      <span>{formatDuration(task.totalTime)}</span>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setEditingTask(task)}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleDeleteTask(task.id)}>
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <NewTaskDialog
        subtaskId={subtaskId}
        open={showNewTaskDialog}
        onOpenChange={setShowNewTaskDialog}
        onAdd={(newTask) => setTasks([...tasks, newTask])}
      />

      {editingTask && (
        <EditTaskDialog
          task={editingTask}
          open={!!editingTask}
          onOpenChange={(open) => !open && setEditingTask(null)}
          onUpdate={(updatedTask) => {
            setTasks(
              tasks.map((task) =>
                task.id === updatedTask.id ? updatedTask : task
              )
            );
            setEditingTask(null);
          }}
        />
      )}
    </div>
  );
}
