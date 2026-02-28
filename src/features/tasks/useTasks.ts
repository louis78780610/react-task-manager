import { useEffect, useMemo, useState } from "react";
import type { Task, TaskStatus } from "./types";
import { loadTasks, saveTasks } from "./storage";

const uuid = () =>
  (typeof crypto !== "undefined" && "randomUUID" in crypto)
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>(() => loadTasks());
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<TaskStatus | "all">("all");

  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tasks.filter((t) => {
      const matchesQuery = !q || t.title.toLowerCase().includes(q);
      const matchesStatus = status === "all" || t.status === status;
      return matchesQuery && matchesStatus;
    });
  }, [tasks, query, status]);

  const addTask = (title: string) => {
    const trimmed = title.trim();
    if (!trimmed) return;
    const now = new Date().toISOString();
    const newTask: Task = { id: uuid(), title: trimmed, status: "todo", createdAt: now };
    setTasks((prev) => [newTask, ...prev]);
  };

  const updateStatus = (id: string, next: TaskStatus) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status: next } : t)));
  };

  const removeTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  return {
    tasks: filtered,
    query,
    setQuery,
    status,
    setStatus,
    addTask,
    updateStatus,
    removeTask,
  };
};