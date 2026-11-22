// Перед началом ПР4 перенести проверенную реализацию функций ПР2–ПР3.
// Затем добавить updateTask по контракту ПР4.
// Для предусмотренных ошибок возвращается { ok: false, error: "..." }.
// DOM, localStorage и внешнее состояние в этом модуле не используются.

export function createTask(id, title, priority = "medium") {
  // TODO: перенести проверенную реализацию из предыдущей работы.
  throw new Error("Не реализовано: createTask");
}

export function findTaskById(tasks, id) {
  // TODO: перенести проверенную реализацию из предыдущей работы.
  throw new Error("Не реализовано: findTaskById");
}

export function getPendingTasks(tasks) {
  // TODO: перенести проверенную реализацию из предыдущей работы.
  throw new Error("Не реализовано: getPendingTasks");
}

export function getTaskTitles(tasks) {
  // TODO: перенести проверенную реализацию из предыдущей работы.
  throw new Error("Не реализовано: getTaskTitles");
}

export function getTaskStats(tasks) {
  // TODO: перенести проверенную реализацию из предыдущей работы.
  throw new Error("Не реализовано: getTaskStats");
}

export function addTask(tasks, id, title, priority = "medium") {
  // TODO: перенести проверенную реализацию из предыдущей работы.
  throw new Error("Не реализовано: addTask");
}

export function setTaskCompleted(tasks, id, completed) {
  // TODO: перенести проверенную реализацию из предыдущей работы.
  throw new Error("Не реализовано: setTaskCompleted");
}

export function renameTask(tasks, id, title) {
  // TODO: перенести проверенную реализацию из предыдущей работы.
  throw new Error("Не реализовано: renameTask");
}

export function removeTask(tasks, id) {
  // TODO: перенести проверенную реализацию из предыдущей работы.
  throw new Error("Не реализовано: removeTask");
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

  const validation = createTask(1, title, priority);
  if (!validation.ok) {
    return { ok: false, error: validation.error };
  }

  const updatedTasks = [...tasks];

  updatedTasks[taskIndex] = {
    ...updatedTasks[taskIndex], 
    title: validation.task.title, 
    priority: validation.task.priority,
  };

  return { ok: true, tasks: updatedTasks };
}
  throw new Error("Не реализовано: updateTask");
}