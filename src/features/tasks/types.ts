export type TaskStatus = "todo" | "doing" | "done";

export type Task = {
  id: string;
  title: string;
  status: TaskStatus;
  createdAt: string; // ISO string
};