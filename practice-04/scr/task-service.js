// Перед началом ПР4 перенести проверенную реализацию функций ПР2–ПР3.
// Затем добавить updateTask по контракту ПР4.
// Для предусмотренных ошибок возвращается { ok: false, error: "..." }.
// DOM, localStorage и внешнее состояние в этом модуле не используются.

export function createTask(id, title, priority = "medium") {
  if (!Number.isSafeInteger(id) || id <= 0) {
    return { ok: false, error: "ID должен быть положительным целым числом" };
  }
  if (typeof title !== "string" || title.trim().length === 0 || title.length > 100) {
    return { ok: false, error: "Некорректное название задачи" };
  }
  if (!["low", "medium", "high"].includes(priority)) {
    return { ok: false, error: "Недопустимый приоритет" };
  }

  return {
    ok: true,
    task: {
      id,
      title: title.trim(),
      completed: false,
      priority
    }
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
  
  if (tasks.some((task) => task.id === id)) {
    return { ok: false, error: "Задача с таким id уже существует" };
  }

  const created = createTask(id, title, priority);
  if (!created.ok) return created;

  return { ok: true, tasks: [...tasks, created.task] };
}

export function setTaskCompleted(tasks, id, completed) {
  if (!Array.isArray(tasks)) {
    return { ok: false, error: "Список задач должен быть массивом" };
  }
  
  const index = tasks.findIndex((task) => task.id === id);
  if (index === -1) {
    return { ok: false, error: "Задача с таким id не найдена" };
  }

  // Если completed не передан (undefined), инвертируем текущий статус
  const nextValue = typeof completed === "boolean" ? completed : !tasks[index].completed;

  const nextTasks = tasks.map((task, i) =>
    i === index ? { ...task, completed: nextValue } : task
  );

  return { ok: true, tasks: nextTasks };
}

export function renameTask(tasks, id, title) {
  if (!Array.isArray(tasks)) {
    return { ok: false, error: "Список задач должен быть массивом" };
  }
  
  const index = tasks.findIndex((task) => task.id === id);
  if (index === -1) {
    return { ok: false, error: "Задача с таким id не найдена" };
  }

  if (typeof title !== "string" || title.trim().length === 0 || title.length > 100) {
    return { ok: false, error: "Некорректное название задачи" };
  }

  const nextTasks = tasks.map((task, i) =>
    i === index ? { ...task, title: title.trim() } : task
  );

  return { ok: true, tasks: nextTasks };
}

export function removeTask(tasks, id) {
  if (!Array.isArray(tasks)) {
    return { ok: false, error: "Список задач должен быть массивом" };
  }
  
  const index = tasks.findIndex((task) => task.id === id);
  if (index === -1) {
    return { ok: false, error: "Задача с таким id не найдена" };
  }

  return { ok: true, tasks: tasks.filter((task) => task.id !== id) };
}

export function updateTask(tasks, id, title, priority) {
  if (!Array.isArray(tasks)) {
    return { ok: false, error: "Список задач должен быть массивом" };
  }

  if (!Number.isSafeInteger(id) || id <= 0) {
    return { ok: false, error: "Некорректный идентификатор задачи" };
  }

  const taskIndex = tasks.findIndex((task) => task.id === id);
  if (taskIndex === -1) {
    return { ok: false, error: "Задача с таким id не найдена" };
  }

  // Проверяем поля напрямую, чтобы не сбросить статус completed
  if (typeof title !== "string" || title.trim().length === 0 || title.length > 100) {
    return { ok: false, error: "Некорректное название задачи" };
  }
  if (!["low", "medium", "high"].includes(priority)) {
    return { ok: false, error: "Недопустимый приоритет" };
  }

  const updatedTasks = [...tasks];
  updatedTasks[taskIndex] = {
    ...updatedTasks[taskIndex],
    title: title.trim(),
    priority: priority,
  };

  return { ok: true, tasks: updatedTasks };
}