import { notFound } from "next/navigation";
import { SubtaskDetails } from "@/components/subtask-details";
import { TasksList } from "@/components/tasks-list";
import {
  getProjectById,
  getSubtaskById,
  getTasksBySubtaskId,
} from "@/lib/actions";

export default async function SubtaskPage({
  params,
}: {
  params: { id: string; subtaskId: string };
}) {
  const resolvedParams = await params;
  const [project, subtask] = await Promise.all([
    getProjectById(resolvedParams.id),
    getSubtaskById(resolvedParams.subtaskId),
  ]);

  if (!project || !subtask) {
    notFound();
  }

  const tasks = await getTasksBySubtaskId(resolvedParams.subtaskId);

  return (
    <div className="container mx-auto py-8 px-4">
      <SubtaskDetails
        projectId={resolvedParams.id}
        projectName={project.name}
        subtask={subtask}
      />
      <TasksList
        subtaskId={resolvedParams.subtaskId}
        tasks={tasks}
      />
    </div>
  );
}
