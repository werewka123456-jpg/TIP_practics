"use strict";

const ALLOWED_PRIORITIES = new Set(["low", "medium", "high"]);

function normalizeTitle(title) {
  if (typeof title !== "string") {
    return { ok: false, error: "Название должно быть строкой" };
  }
  const trimmed = title.trim();
  if (trimmed.length === 0) {
    return { ok: false, error: "Название не может быть пустым" };
  }
  if (trimmed.length > 100) {
    return { ok: false, error: "Название не должно превышать 100 символов" };
  }
  return { ok: true, title: trimmed };
}

function checkId(id) {
  if (!Number.isSafeInteger(id) || id <= 0) {
    return { ok: false, error: "ID должен быть положительным целым числом" };
  }
  return { ok: true };
}

export function createTask(id, title, priority = "medium") {
  const idCheck = checkId(id);
  if (!idCheck.ok) return idCheck;

  const titleCheck = normalizeTitle(title);
  if (!titleCheck.ok) return titleCheck;

  if (!ALLOWED_PRIORITIES.has(priority)) {
    return { ok: false, error: "Недопустимый приоритет" };
  }

  return {
    ok: true,
    task: { id, title: titleCheck.title, completed: false, priority },
  };
}

export function findTaskById(tasks, id) {
  if (!Array.isArray(tasks)) return undefined;
  return tasks.find((task) => task.id === id);
}

export function getPendingTasks(tasks) {
  if (!Array.isArray(tasks)) return [];
  return tasks.filter((task) => !task.completed);
}

export function getTaskTitles(tasks) {
  if (!Array.isArray(tasks)) return [];
  return tasks.map((task) => task.title);
}

export function getTaskStats(tasks) {
  const list = Array.isArray(tasks) ? tasks : [];
  const total = list.length;
  const completed = list.filter((task) => task.completed).length;
  const pending = total - completed;
  const progress = total === 0 ? 0 : (completed / total) * 100;
  return { total, completed, pending, progress };
}

export function addTask(tasks, id, title, priority = "medium") {
  if (!Array.isArray(tasks)) {
    return { ok: false, error: "Список задач должен быть массивом" };
  }
  const idCheck = checkId(id);
  if (!idCheck.ok) return idCheck;

  if (tasks.some((task) => task.id === id)) {
    return { ok: false, error: "Задача с таким ID уже существует" };
  }

  const created = createTask(id, title, priority);
  if (!created.ok) return created;

  return { ok: true, tasks: [...tasks, created.task] };
}

export function setTaskCompleted(tasks, id, completed) {
  if (!Array.isArray(tasks)) {
    return { ok: false, error: "Список задач должен быть массивом" };
  }
  const idCheck = checkId(id);
  if (!idCheck.ok) return idCheck;

  const index = tasks.findIndex((task) => task.id === id);
  if (index === -1) {
    return { ok: false, error: "Задача с таким id не найдена" };
  }

  const nextValue =
    typeof completed === "boolean" ? completed : !tasks[index].completed;

  const nextTasks = tasks.map((task, i) =>
    i === index ? { ...task, completed: nextValue } : task,
  );

  return { ok: true, tasks: nextTasks };
}

export function renameTask(tasks, id, title) {
  if (!Array.isArray(tasks)) {
    return { ok: false, error: "Список задач должен быть массивом" };
  }
  const idCheck = checkId(id);
  if (!idCheck.ok) return idCheck;

  const index = tasks.findIndex((task) => task.id === id);
  if (index === -1) {
    return { ok: false, error: "Задача с таким id не найдена" };
  }

  const titleCheck = normalizeTitle(title);
  if (!titleCheck.ok) return titleCheck;

  const nextTasks = tasks.map((task, i) =>
    i === index ? { ...task, title: titleCheck.title } : task,
  );

  return { ok: true, tasks: nextTasks };
}

export function removeTask(tasks, id) {
  if (!Array.isArray(tasks)) {
    return { ok: false, error: "Список задач должен быть массивом" };
  }
  const idCheck = checkId(id);
  if (!idCheck.ok) return idCheck;

  if (!tasks.some((task) => task.id === id)) {
    return { ok: false, error: "Задача с таким id не найдена" };
  }

  return { ok: true, tasks: tasks.filter((task) => task.id !== id) };
}

export function updateTask(tasks, id, title, priority) {
  if (!Array.isArray(tasks)) {
    return { ok: false, error: "Список задач должен быть массивом" };
  }
  const idCheck = checkId(id);
  if (!idCheck.ok) return idCheck;

  const index = tasks.findIndex((task) => task.id === id);
  if (index === -1) {
    return { ok: false, error: "Задача с таким id не найдена" };
  }

  const titleCheck = normalizeTitle(title);
  if (!titleCheck.ok) return titleCheck;

  if (!ALLOWED_PRIORITIES.has(priority)) {
    return { ok: false, error: "Недопустимый приоритет" };
  }

  const nextTasks = tasks.map((task, i) =>
    i === index ? { ...task, title: titleCheck.title, priority } : task,
  );

  return { ok: true, tasks: nextTasks };
}