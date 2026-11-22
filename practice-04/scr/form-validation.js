const ALLOWED_PRIORITIES = new Set(["low", "medium", "high"]);

// Чистая проверка данных формы. DOM и показ сообщений выполняются в main.js.
// draft: { id, title, priority }; editingId: null либо id редактируемой задачи.
export function validateTaskDraft(draft, tasks, editingId = null) {
  const errors = {};
  let id;
  let title;
  let priority;

  // 1. Проверка ID
  if (editingId !== null) {
    id = editingId;
    const taskExists = tasks.some(task => task.id === id);
    if (!taskExists) {
      errors.id = "Редактируемая задача не найдена";
    }
  } else {
    const rawId = draft.id;
    if (rawId === "" || rawId === null || rawId === undefined) {
      errors.id = "ID не может быть пустым";
    } else {
      id = Number(rawId);
      if (!Number.isSafeInteger(id) || id <= 0) {
        errors.id = "ID должен быть положительным целым числом";
      } else if (tasks.some(task => task.id === id)) {
        errors.id = "Задача с таким ID уже существует";
      }
    }
  }

  // 2. Проверка названия (title)
  if (typeof draft.title !== "string") {
    errors.title = "Название должно быть строкой";
  } else {
    title = draft.title.trim();
    if (title.length === 0) {
      errors.title = "Название не может быть пустым";
    } else if (title.length > 100) {
      errors.title = "Название не должно превышать 100 символов";
    }
  }

  // 3. Проверка приоритета (priority)
  if (!ALLOWED_PRIORITIES.has(draft.priority)) {
    errors.priority = "Недопустимый приоритет";
  } else {
    priority = draft.priority;
  }

  // 4. Возврат результата
  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    value: { id, title, priority }
  };
}