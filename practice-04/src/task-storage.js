export const STORAGE_VERSION = 1;

export function isValidTaskList(value) {
  if (!Array.isArray(value)) return false;

  const ids = new Set();
  const validPriorities = ["low", "medium", "high"];

  for (const task of value) {
    if (!task || typeof task !== "object") return false;
    
    if (!Number.isSafeInteger(task.id) || task.id <= 0) return false;
    if (ids.has(task.id)) return false;
    ids.add(task.id);

    if (typeof task.title !== "string" || task.title.trim().length === 0 || task.title.length > 100) {
      return false;
    }

    if (typeof task.completed !== "boolean") return false;

    if (!validPriorities.includes(task.priority)) return false;
  }

  return true;
}

export function loadTasks(storage, key, fallbackTasks) {
  const fallbackCopy = JSON.parse(JSON.stringify(fallbackTasks));

  try {
    const raw = storage.getItem(key);
    
    if (raw === null) {
      return { ok: true, source: "initial", tasks: fallbackCopy };
    }

    const parsed = JSON.parse(raw);

    if (!parsed || typeof parsed !== "object" || parsed.version !== STORAGE_VERSION || !isValidTaskList(parsed.tasks)) {
      return { 
        ok: false, 
        source: "fallback", 
        error: "Некорректный формат сохраненных данных", 
        tasks: fallbackCopy 
      };
    }

    return { 
      ok: true, 
      source: "storage", 
      tasks: JSON.parse(JSON.stringify(parsed.tasks)) 
    };

  } catch (error) {
    return { 
      ok: false, 
      source: "fallback", 
      error: "Ошибка чтения данных: " + error.message, 
      tasks: fallbackCopy 
    };
  }
}

export function saveTasks(storage, key, tasks) {
  if (!isValidTaskList(tasks)) {
    return { ok: false, error: "Попытка сохранить некорректный список задач" };
  }

  try {
    const wrapper = {
      version: STORAGE_VERSION,
      tasks: tasks
    };
    storage.setItem(key, JSON.stringify(wrapper));
    return { ok: true };
  } catch (error) {
    return { ok: false, error: "Ошибка записи: " + error.message };
  }
}

export function removeSavedTasks(storage, key) {
  try {
    storage.removeItem(key);
    return { ok: true };
  } catch (error) {
    return { ok: false, error: "Ошибка удаления: " + error.message };
  }
}