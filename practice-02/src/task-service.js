// ============================================================
// Внутренние помощники (НЕ экспортируются, объявлены СНАРУЖИ)
// ============================================================

function isValidId(id) {
  return typeof id === "number" && Number.isSafeInteger(id) && id > 0;
}

function normalizeTitle(title) {
  if (typeof title !== "string") {
    return { ok: false, error: "Название должно быть строкой" };
  }
  const trimmed = title.trim();
  if (trimmed.length < 1 || trimmed.length > 100) {
    return { ok: false, error: "Длина названия должна быть от 1 до 100 символов" };
  }
  return { ok: true, title: trimmed };
}

function isValidPriority(priority) {
  return priority === "low" || priority === "medium" || priority === "high";
}

// ============================================================
// Задание 2. createTask
// ============================================================

export function createTask(id, title, priority = "medium") {
  if (!isValidId(id)) {
    return { ok: false, error: "id должен быть положительным целым числом" };
  }

  const titleResult = normalizeTitle(title);
  if (!titleResult.ok) {
    return titleResult;
  }

  if (!isValidPriority(priority)) {
    return { ok: false, error: 'Приоритет должен быть "low", "medium" или "high"' };
  }

  return {
    ok: true,
    task: {
      id,
      title: titleResult.title,
      completed: false,
      priority,
    },
  };
}

// ============================================================
// Задание 3 (пока заглушки — реализуем позже)
// ============================================================

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
  const completed = tasks.filter((task) => task.completed === true).length;
  const pending = total - completed;
  const progress = total > 0 ? (completed / total) * 100 : 0;
  return { total, completed, pending, progress };
}

// ============================================================
//                      Задание 4 
// ============================================================

export function addTask(tasks, id, title, priority = "medium") {
  if (!isValidId(id)) {
    return { ok: false, error: "id должен быть положительным целым числом" };
  }

  const exists = tasks.find((task) => task.id === id);
  if (exists !== undefined) {
    return { ok: false, error: `Задача с id = ${id} уже существует` };
  }

  const created = createTask(id, title, priority);
  if (!created.ok) {
    return created;
  }

  return { ok: true, tasks: [...tasks, created.task] };
}

export function setTaskCompleted(tasks, id, completed) {
  if (!isValidId(id)) {
    return { ok: false, error: "id должен быть положительным целым числом" };
  }

  if (typeof completed !== "boolean") {
    return { ok: false, error: "completed должен быть true или false" };
  }

  const target = tasks.find((task) => task.id === id);
  if (target === undefined) {
    return { ok: false, error: `Задача с id = ${id} не найдена` };
  }

  const newTasks = tasks.map((task) =>
    task.id === id ? { ...task, completed } : task
  );

  return { ok: true, tasks: newTasks };
}

export function renameTask(tasks, id, title) {
  if (!isValidId(id)) {
    return { ok: false, error: "id должен быть положительным целым числом" };
  }

  const titleResult = normalizeTitle(title);
  if (!titleResult.ok) {
    return titleResult;
  }

  const target = tasks.find((task) => task.id === id);
  if (target === undefined) {
    return { ok: false, error: `Задача с id = ${id} не найдена` };
  }

  const newTasks = tasks.map((task) =>
    task.id === id ? { ...task, title: titleResult.title } : task
  );

  return { ok: true, tasks: newTasks };
}

export function removeTask(tasks, id) {
  if (!isValidId(id)) {
    return { ok: false, error: "id должен быть положительным целым числом" };
  }

  const target = tasks.find((task) => task.id === id);
  if (target === undefined) {
    return { ok: false, error: `Задача с id = ${id} не найдена` };
  }

  const newTasks = tasks.filter((task) => task.id !== id);

  return { ok: true, tasks: newTasks };
}