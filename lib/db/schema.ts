import { relations } from "drizzle-orm";
import { pgTable, varchar, text, timestamp, integer, uuid } from "drizzle-orm/pg-core";

export const projects = pgTable("projects", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const projectsRelations = relations(projects, ({ many }) => ({
  subtasks: many(subtasks),
}));

export const subtasks = pgTable("subtasks", {
  id: uuid("id").defaultRandom().primaryKey(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  totalTime: integer("total_time").default(0).notNull(), // Keep this for calculated total time
});

export const subtasksRelations = relations(subtasks, ({ one, many }) => ({
  project: one(projects, {
    fields: [subtasks.projectId],
    references: [projects.id],
  }),
  tasks: many(tasks),
}));

export const tasks = pgTable("tasks", {
  id: uuid("id").defaultRandom().primaryKey(),
  subtaskId: uuid("subtask_id")
    .notNull()
    .references(() => subtasks.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  totalTime: integer("total_time").default(0).notNull(), // Keep this for manual time entry
});

export const tasksRelations = relations(tasks, ({ one }) => ({
  subtask: one(subtasks, {
    fields: [tasks.subtaskId],
    references: [subtasks.id],
  }),
}))

