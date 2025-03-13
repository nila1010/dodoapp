"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "./db";
import { projects, subtasks, tasks } from "./db/schema";
import { eq } from "drizzle-orm";

// Project actions
export async function getProjects() {
  try {
    const projectsData = await db.query.projects.findMany({
      with: {
        subtasks: {
          with: {
            tasks: true,
          },
        },
      },
    });

    return projectsData.map((project) => {
      const allTasks = project.subtasks.flatMap((subtask) => subtask.tasks);
      const totalTasks = allTasks.length;
      const totalTime = project.subtasks.reduce((sum, subtask) => {
        // Calculate total time from tasks
        const subtaskTotalTime = subtask.tasks.reduce((taskSum, task) => taskSum + task.totalTime, 0);
        return sum + subtaskTotalTime;
      }, 0);

      return {
        id: project.id,
        name: project.name,
        description: project.description,
        createdAt: project.createdAt,
        totalTime,
        totalTasks,
      };
    });
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    return [];
  }
}

export async function getProjectById(id: string) {
  try {
    const project = await db.query.projects.findFirst({
      where: eq(projects.id, id),
      with: {
        subtasks: {
          with: {
            tasks: true,
          },
        },
      },
    });

    if (!project) return null;

    const allTasks = project.subtasks.flatMap((subtask) => subtask.tasks);
    const totalTasks = allTasks.length;
    const totalTime = project.subtasks.reduce((sum, subtask) => {
      // Calculate total time from tasks
      const subtaskTotalTime = subtask.tasks.reduce((taskSum, task) => taskSum + task.totalTime, 0);
      return sum + subtaskTotalTime;
    }, 0);

    return {
      id: project.id,
      name: project.name,
      description: project.description,
      createdAt: project.createdAt,
      totalTime,
      totalTasks,
    };
  } catch (error) {
    console.error("Failed to fetch project:", error);
    return null;
  }
}

export async function createProject(data: { name: string; description: string; }) {
  try {
    const [newProject] = await db
      .insert(projects)
      .values({
        name: data.name,
        description: data.description,
      })
      .returning({ id: projects.id });

    revalidatePath("/");
    return newProject.id;
  } catch (error) {
    console.error("Failed to create project:", error);
    throw new Error("Failed to create project");
  }
}

export async function updateProject(id: string, data: { name: string; description: string; }) {
  try {
    await db
      .update(projects)
      .set({
        name: data.name,
        description: data.description,
      })
      .where(eq(projects.id, id));

    revalidatePath(`/projects/${id}`);
    return true;
  } catch (error) {
    console.error("Failed to update project:", error);
    throw new Error("Failed to update project");
  }
}

export async function deleteProject(id: string) {
  try {
    await db.delete(projects).where(eq(projects.id, id));
    revalidatePath("/");
    redirect("/");
  } catch (error) {
    console.error("Failed to delete project:", error);
    throw new Error("Failed to delete project");
  }
}

// Subtask actions
export async function getSubtasksByProjectId(projectId: string) {
  try {
    const subtasksData = await db.query.subtasks.findMany({
      where: eq(subtasks.projectId, projectId),
      with: {
        tasks: true,
      },
    });

    return subtasksData.map((subtask) => {
      const totalTasks = subtask.tasks.length;
      // Calculate total time from tasks
      const totalTime = subtask.tasks.reduce((sum, task) => sum + task.totalTime, 0);

      return {
        id: subtask.id,
        name: subtask.name,
        description: subtask.description,
        totalTime,
        totalTasks,
      };
    });
  } catch (error) {
    console.error("Failed to fetch subtasks:", error);
    return [];
  }
}

export async function getSubtaskById(id: string) {
  try {
    const subtask = await db.query.subtasks.findFirst({
      where: eq(subtasks.id, id),
      with: {
        tasks: true,
      },
    });

    if (!subtask) return null;

    const totalTasks = subtask.tasks.length;
    // Calculate total time from tasks
    const totalTime = subtask.tasks.reduce((sum, task) => sum + task.totalTime, 0);

    return {
      id: subtask.id,
      name: subtask.name,
      description: subtask.description,
      totalTime,
      totalTasks,
    };
  } catch (error) {
    console.error("Failed to fetch subtask:", error);
    return null;
  }
}

export async function createSubtask(data: {
  projectId: string;
  name: string;
  description: string;
}) {
  try {
    const [newSubtask] = await db
      .insert(subtasks)
      .values({
        projectId: data.projectId,
        name: data.name,
        description: data.description,
      })
      .returning({ id: subtasks.id });

    revalidatePath(`/projects/${data.projectId}`);
    return newSubtask.id;
  } catch (error) {
    console.error("Failed to create subtask:", error);
    throw new Error("Failed to create subtask");
  }
}

export async function updateSubtask(
  id: string,
  data: {
    name: string;
    description: string;
  },
) {
  try {
    const [updatedSubtask] = await db
      .update(subtasks)
      .set({
        name: data.name,
        description: data.description,
      })
      .where(eq(subtasks.id, id))
      .returning({
        id: subtasks.id,
        name: subtasks.name,
        description: subtasks.description,
        projectId: subtasks.projectId,
      });

    const subtaskWithTasks = await db.query.subtasks.findFirst({
      where: eq(subtasks.id, id),
      with: {
        tasks: true,
      },
    });

    const totalTasks = subtaskWithTasks?.tasks.length || 0;
    // Calculate total time from tasks
    const totalTime = subtaskWithTasks?.tasks.reduce((sum, task) => sum + task.totalTime, 0) || 0;

    revalidatePath(`/projects/${updatedSubtask.projectId}/subtasks/${id}`);

    return {
      ...updatedSubtask,
      totalTime,
      totalTasks,
    };
  } catch (error) {
    console.error("Failed to update subtask:", error);
    throw new Error("Failed to update subtask");
  }
}

export async function deleteSubtask(id: string, projectId: string) {
  try {
    await db.delete(subtasks).where(eq(subtasks.id, id));
    revalidatePath(`/projects/${projectId}`);
    redirect(`/projects/${projectId}`);
  } catch (error) {
    console.error("Failed to delete subtask:", error);
    throw new Error("Failed to delete subtask");
  }
}

// Task actions
export async function getTasksBySubtaskId(subtaskId: string) {
  try {
    const tasksData = await db.query.tasks.findMany({
      where: eq(tasks.subtaskId, subtaskId),
    });

    return tasksData;
  } catch (error) {
    console.error("Failed to fetch tasks:", error);
    return [];
  }
}

export async function createTask(data: {
  subtaskId: string;
  name: string;
  description: string;
  totalTime?: number;
}) {
  try {
    const [newTask] = await db
      .insert(tasks)
      .values({
        subtaskId: data.subtaskId,
        name: data.name,
        description: data.description,
        totalTime: data.totalTime || 0,
      })
      .returning({
        id: tasks.id,
        name: tasks.name,
        description: tasks.description,
        totalTime: tasks.totalTime,
      });

    // Get the subtask to get the project ID for path revalidation
    const subtask = await db.query.subtasks.findFirst({
      where: eq(subtasks.id, data.subtaskId),
      columns: {
        projectId: true,
      },
    });

    if (subtask) {
      revalidatePath(`/projects/${subtask.projectId}/subtasks/${data.subtaskId}`);
    }

    return newTask;
  } catch (error) {
    console.error("Failed to create task:", error);
    throw new Error("Failed to create task");
  }
}

export async function updateTask(
  id: string,
  data: {
    name: string;
    description: string;
    totalTime?: number;
  },
) {
  try {
    // Create update object with optional totalTime
    const updateData: {
      name: string;
      description: string;
      totalTime?: number;
    } = {
      name: data.name,
      description: data.description,
    };

    // Add totalTime if provided
    if (data.totalTime !== undefined) {
      updateData.totalTime = data.totalTime;
    }

    const [updatedTask] = await db.update(tasks).set(updateData).where(eq(tasks.id, id)).returning({
      id: tasks.id,
      name: tasks.name,
      description: tasks.description,
      totalTime: tasks.totalTime,
      subtaskId: tasks.subtaskId,
    });

    // Get the subtask to get the project ID for path revalidation
    const subtask = await db.query.subtasks.findFirst({
      where: eq(subtasks.id, updatedTask.subtaskId),
      columns: {
        projectId: true,
      },
    });

    if (subtask) {
      revalidatePath(`/projects/${subtask.projectId}/subtasks/${updatedTask.subtaskId}`);
    }

    return updatedTask;
  } catch (error) {
    console.error("Failed to update task:", error);
    throw new Error("Failed to update task");
  }
}

export async function deleteTask(id: string) {
  try {
    const task = await db.query.tasks.findFirst({
      where: eq(tasks.id, id),
      columns: {
        subtaskId: true,
      },
    });

    if (!task) {
      throw new Error("Task not found");
    }

    await db.delete(tasks).where(eq(tasks.id, id));

    // Get the subtask to get the project ID for path revalidation
    const subtask = await db.query.subtasks.findFirst({
      where: eq(subtasks.id, task.subtaskId),
      columns: {
        projectId: true,
      },
    });

    if (subtask) {
      revalidatePath(`/projects/${subtask.projectId}/subtasks/${task.subtaskId}`);
    }

    return true;
  } catch (error) {
    console.error("Failed to delete task:", error);
    throw new Error("Failed to delete task");
  }
}

