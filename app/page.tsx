import { ProjectsOverview } from "@/components/projects-overview"
import { getProjects } from "@/lib/actions"

export default async function Home() {
  const projects = await getProjects()

  return (
    <main className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Project Time Management</h1>
      <ProjectsOverview projects={projects} />
    </main>
  )
}

