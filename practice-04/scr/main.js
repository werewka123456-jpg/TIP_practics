import { demoTasks, variantTasks, variantNumber } from "./data.js";
import {
  addTask,
  findTaskById,
  removeTask,
  setTaskCompleted,
  updateTask,
} from "./task-service.js";
import { getVisibleTasks } from "./task-selectors.js";
import { renderEmptyState, renderSummary, renderTaskList } from "./task-view.js";
import { validateTaskDraft } from "./form-validation.js";
import { loadTasks, removeSavedTasks, saveTasks } from "./task-storage.js";

const elements = {
  list: document.querySelector("#task-list"),
  filters: document.querySelector("#task-filters"),
  summary: document.querySelector("#task-summary"),
  empty: document.querySelector("#empty-message"),
  message: document.querySelector("#operation-message"),
  datasetLabel: document.querySelector("#dataset-label"),
  storageStatus: document.querySelector("#storage-status"),
  form: document.querySelector("#task-form"),
  formHeading: document.querySelector("#form-heading"),
  formMode: document.querySelector("#form-mode"),
  formMessage: document.querySelector("#form-message"),
  idInput: document.querySelector("#task-id"),
  titleInput: document.querySelector("#task-title"),
  priorityInput: document.querySelector("#task-priority"),
  submitButton: document.querySelector("#form-submit"),
  cancelButton: document.querySelector("#cancel-edit"),
  resetButton: document.querySelector("#reset-data"),
};

const params = new URLSearchParams(window.location.search);
const isVariant = params.get("dataset") === "variant";
const isCheckRun = params.get("mode") === "check";
const initialTasks = isVariant ? variantTasks : demoTasks;
const datasetName = isVariant ? "variant" : "demo";
const storageKey = isCheckRun
  ? `tip-js-practice-04:checks:${datasetName}`
  : `tip-js-practice-04:${datasetName}`;

let loaded;
try {
  loaded = loadTasks(window.localStorage, storageKey, initialTasks);
} catch (error) {
  loaded = {
    ok: false,
    source: "fallback",
    tasks: initialTasks.map((task) => ({ ...task })),
    error: `Хранилище не инициализировано: ${error.message}`,
  };
}
let currentTasks = loaded.tasks;
let currentFilter = "all";
let editingId = null;

elements.datasetLabel.textContent = isVariant
  ? `Индивидуальный вариант: ${variantNumber ?? "не указан"}`
  : "Общий контрольный набор";

if (loaded.source === "storage") {
  elements.storageStatus.textContent = "Данные восстановлены из localStorage.";
} else if (loaded.ok) {
  elements.storageStatus.textContent = "Используется исходный набор; сохранённых данных пока нет.";
} else {
  elements.storageStatus.textContent = loaded.error;
  elements.storageStatus.classList.add("is-warning");
}

function renderApp() {
  const visibleTasks = getVisibleTasks(currentTasks, currentFilter);
  renderTaskList(elements.list, visibleTasks);
  
  renderSummary(elements.summary, currentTasks, visibleTasks.length);
  renderEmptyState(elements.empty, currentTasks.length, visibleTasks.length);

  // Обновление кнопок фильтра
  const filterButtons = elements.filters.querySelectorAll("[data-filter]");
  filterButtons.forEach((btn) => {
    const isActive = btn.dataset.filter === currentFilter;
    btn.setAttribute("aria-pressed", String(isActive));
    if (isActive) btn.classList.add("is-active");
    else btn.classList.remove("is-active");
  });
}

function clearFieldError(name) {
  const input = elements.form.elements.namedItem(name);
  const message = document.querySelector(`#${name}-error`);
  if (input) {
    input.setCustomValidity("");
    input.removeAttribute("aria-invalid");
  }
  if (message) message.textContent = "";
}

function clearFormErrors() {
  for (const name of ["id", "title", "priority"]) clearFieldError(name);
  elements.formMessage.textContent = "";
}

function showFormErrors(errors) {
  clearFormErrors();
  for (const [name, text] of Object.entries(errors)) {
    const input = elements.form.elements.namedItem(name);
    const message = document.querySelector(`#${name}-error`);
    if (input) {
      input.setCustomValidity(text);
      input.setAttribute("aria-invalid", "true");
    }
    if (message) message.textContent = text;
  }
  elements.form.reportValidity();
}

function setFormMode(id = null) {
  if (id === null) {
    editingId = null;
    elements.form.reset();
    clearFormErrors();
    elements.idInput.disabled = false;
    elements.formHeading.textContent = "Добавление задачи";
    elements.submitButton.textContent = "Добавить задачу";
    elements.cancelButton.hidden = true;
    elements.idInput.focus();
  } else {
    const task = findTaskById(currentTasks, id);
    if (!task) {
      elements.formMessage.textContent = "Задача не найдена.";
      return;
    }

    editingId = id;
    clearFormErrors();
    
    elements.idInput.value = task.id;
    elements.titleInput.value = task.title;
    elements.priorityInput.value = task.priority;
    
    elements.idInput.disabled = true;
    elements.formHeading.textContent = "Редактирование задачи";
    elements.submitButton.textContent = "Сохранить изменения";
    elements.cancelButton.hidden = false;
    elements.titleInput.focus();
  }
}

function persistCurrentTasks(successMessage) {
  const saved = saveTasks(window.localStorage, storageKey, currentTasks);
  elements.storageStatus.classList.toggle("is-warning", !saved.ok);
  elements.storageStatus.textContent = saved.ok
    ? "Изменения сохранены в localStorage."
    : saved.error;
  elements.message.textContent = saved.ok ? successMessage : `${successMessage} ${saved.error}`;
  renderApp();
  return saved;
}

function restoreTaskFocus(id, action) {
  const actionButton = elements.list.querySelector(
    `[data-task-id="${id}"] button[data-action="${action}"]`,
  );
  const filterButton = elements.filters.querySelector(`[data-filter="${currentFilter}"]`);
  (actionButton ?? filterButton)?.focus();
}

function handleFormSubmit(event) {
  event.preventDefault();

  const formData = new FormData(elements.form);
  const rawId = editingId !== null ? editingId : formData.get("id");
  
  const draft = {
    id: rawId,
    title: formData.get("title"),
    priority: formData.get("priority")
  };

  const validation = validateTaskDraft(draft, currentTasks, editingId);

  if (!validation.ok) {
    showFormErrors(validation.errors);
    return;
  }

  clearFormErrors();

  let result;
  if (editingId === null) {
    result = addTask(currentTasks, validation.value.id, validation.value.title, validation.value.priority);
  } else {
    result = updateTask(currentTasks, editingId, validation.value.title, validation.value.priority);
  }

  if (!result.ok) {
    showFormErrors({ id: result.error });
    return;
  }

  currentTasks = result.tasks;
  const successMsg = editingId === null ? "Задача добавлена." : "Задача обновлена.";
  
  setFormMode(null); 
  persistCurrentTasks(successMsg); 
}

function handleTaskListClick(event) {
  const btn = event.target.closest("button[data-action]");
  if (!btn) return;

  const action = btn.dataset.action;
  const taskId = Number(btn.closest("[data-task-id]").dataset.taskId);

  if (action === "edit") {
    setFormMode(taskId);
    return;
  }

  if (action === "toggle") {
    const task = currentTasks.find((t) => t.id === taskId);
    const result = task
      ? setTaskCompleted(currentTasks, taskId, !task.completed)
      : { ok: false };
    if (result.ok) {
      currentTasks = result.tasks;
      persistCurrentTasks("Статус задачи изменён.");
      restoreTaskFocus(taskId, action);
    }
  } 
  else if (action === "delete") {
    const result = removeTask(currentTasks, taskId);
    if (result.ok) {
      currentTasks = result.tasks;
      if (editingId === taskId) setFormMode(null);
      persistCurrentTasks("Задача удалена.");
      restoreTaskFocus(taskId, action);
    }
  }
}

function handleFilterClick(event) {
  const btn = event.target.closest("[data-filter]");
  if (!btn) return;
  
  currentFilter = btn.dataset.filter;
  renderApp();
}

function handleResetClick() {
  const removed = removeSavedTasks(window.localStorage, storageKey);
  
  if (!removed.ok) {
    elements.storageStatus.textContent = removed.error;
    elements.storageStatus.classList.add("is-warning");
    return;
  }

  currentTasks = initialTasks.map((task) => ({ ...task }));
  currentFilter = "all";
  
  elements.storageStatus.classList.remove("is-warning");
  elements.storageStatus.textContent = "Сохранённые данные удалены. Загружен исходный набор.";
  elements.message.textContent = "Данные сброшены.";
  
  setFormMode(null);
  renderApp();
}

elements.form.addEventListener("submit", handleFormSubmit);
elements.form.addEventListener("input", (event) => {
  if (event.target instanceof HTMLInputElement || event.target instanceof HTMLSelectElement) {
    clearFieldError(event.target.name);
  }
});
elements.list.addEventListener("click", handleTaskListClick);
elements.filters.addEventListener("click", handleFilterClick);
elements.cancelButton.addEventListener("click", () => setFormMode());
elements.resetButton.addEventListener("click", handleResetClick);

try {
  setFormMode();
  renderApp();
} catch (error) {
  elements.message.textContent = `Ошибка запуска: ${error.message}`;
  console.error(error);
}