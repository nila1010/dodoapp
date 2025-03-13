"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Clock, Edit, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate, formatDuration } from "@/lib/utils";
import { EditProjectDialog } from "./edit-project-dialog";
import { DeleteProjectDialog } from "./delete-project-dialog";

type Project = {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
  totalTime: number;
  totalTasks: number;
};

export function ProjectDetails({ project }: { project: Project }) {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  return (
    <div className="space-y-6 mb-8">
      <div className="flex items-center gap-2">
        <Link href="/">
          <Button
            variant="ghost"
            size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Projects
          </Button>
        </Link>
      </div>

      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">{project.name}</h1>
          <p className="text-muted-foreground mt-1">{project.description}</p>
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <span className="text-lg font-medium">
                {formatDuration(project.totalTime)}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">Total Time</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <span className="text-lg font-medium">{project.totalTasks}</span>
            </div>
            <p className="text-sm text-muted-foreground">Total Tasks</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <span className="text-lg font-medium">
                {formatDate(project.createdAt)}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">Created On</p>
          </CardContent>
        </Card>
      </div>

      <EditProjectDialog
        project={project}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
      />

      <DeleteProjectDialog
        projectId={project.id}
        projectName={project.name}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
      />
    </div>
  );
}
