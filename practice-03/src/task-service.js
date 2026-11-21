const PRIORITIES = ["low", "medium", "high"];

function fail(message) {
  return { ok: false, error: message };
}

function isValidId(id) {
  return Number.isSafeInteger(id) && id > 0;
}

function normalizeTitle(title) {
  if (typeof title !== "string") return null;
  const trimmed = title.trim();
  if (trimmed.length < 1 || trimmed.length > 100) return null;
  return trimmed;
}

function isValidPriority(priority) {
  return PRIORITIES.includes(priority);
}

export function createTask(id, title, priority = "medium") {
  if (!isValidId(id)) return fail("Некорректный идентификатор задачи.");
  const normalized = normalizeTitle(title);
  if (normalized === null) return fail("Название должно быть непустой строкой до 100 символов.");
  if (!isValidPriority(priority)) return fail("Недопустимый приоритет задачи.");
  return { ok: true, task: { id, title: normalized, completed: false, priority } };
}

export function findTaskById(tasks, id) {
  return tasks.find((task) => task.id === id);
}

export function getPendingTasks(tasks) {
  return tasks.filter((task) => task.completed === false);
}

export function getTaskTitles(tasks) {
  return tasks.map((task) => task.title);
}

export function getTaskStats(tasks) {
  const total = tasks.length;
  const completed = tasks.filter((task) => task.completed).length;
  const pending = total - completed;
  const progress = total === 0 ? 0 : (completed / total) * 100;
  return { total, completed, pending, progress };
}

export function addTask(tasks, id, title, priority = "medium") {
  if (findTaskById(tasks, id)) {
    return fail("Задача с таким идентификатором уже существует.");
  }
  const created = createTask(id, title, priority);
  if (!created.ok) return created;
  return { ok: true, tasks: [...tasks, created.task] };
}

export function setTaskCompleted(tasks, id, completed) {
  if (!isValidId(id)) return fail("Некорректный идентификатор задачи.");
  if (typeof completed !== "boolean") return fail("Статус должен быть логическим значением.");
  const index = tasks.findIndex((task) => task.id === id);
  if (index === -1) return fail("Задача не найдена.");
  const next = tasks.map((task, i) =>
    i === index ? { ...task, completed } : task,
  );
  return { ok: true, tasks: next };
}

export function renameTask(tasks, id, title) {
  if (!isValidId(id)) return fail("Некорректный идентификатор задачи.");
  const normalized = normalizeTitle(title);
  if (normalized === null) return fail("Название должно быть непустой строкой до 100 символов.");
  const index = tasks.findIndex((task) => task.id === id);
  if (index === -1) return fail("Задача не найдена.");
  const next = tasks.map((task, i) =>
    i === index ? { ...task, title: normalized } : task,
  );
  return { ok: true, tasks: next };
}

export function removeTask(tasks, id) {
  if (!isValidId(id)) return fail("Некорректный идентификатор задачи.");
  if (!findTaskById(tasks, id)) return fail("Задача не найдена.");
  const next = tasks.filter((task) => task.id !== id);
  return { ok: true, tasks: next };
}