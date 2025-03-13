"use client";

import Link from "next/link";
import { PlusCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate, formatDuration } from "@/lib/utils";
import { useState } from "react";
import { NewProjectDialog } from "./new-project-dialog";

type Project = {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
  totalTime: number;
  totalTasks: number;
};

export function ProjectsOverview({ projects }: { projects: Project[] }) {
  const [showNewProjectDialog, setShowNewProjectDialog] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Projects Overview</h2>
        <Button onClick={() => setShowNewProjectDialog(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Link
            href={`/projects/${project.id}`}
            key={project.id}
            className="block">
            <Card className="h-full hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle>{project.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  {project.description}
                </p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-muted-foreground">Created</p>
                    <p>{formatDate(project.createdAt)}</p>
                  </div>
                  <div className="flex items-start gap-1">
                    <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <p>{formatDuration(project.totalTime)}</p>
                  </div>
                </div>
              </CardContent>
              <div className="px-6 pb-6">
                <div className="flex justify-between text-sm mb-1">
                  <span>Tasks</span>
                  <span>{project.totalTasks} tasks</span>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <NewProjectDialog
        open={showNewProjectDialog}
        onOpenChange={setShowNewProjectDialog}
      />
    </div>
  );
}
