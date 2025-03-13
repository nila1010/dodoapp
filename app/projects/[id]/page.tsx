import { notFound } from "next/navigation";
import { ProjectDetails } from "@/components/project-details";
import { SubtasksList } from "@/components/subtasks-list";
import { getProjectById, getSubtasksByProjectId } from "@/lib/actions";

export default async function ProjectPage({
  params,
}: {
  params: { id: string };
}) {
  const resolvedParams = await params;
  const project = await getProjectById(resolvedParams.id);

  if (!project) {
    notFound();
  }

  const subtasks = await getSubtasksByProjectId(resolvedParams.id);

  return (
    <div className="container mx-auto py-8 px-4">
      <ProjectDetails project={project} />
      <SubtasksList
        projectId={resolvedParams.id}
        subtasks={subtasks}
      />
    </div>
  );
}
