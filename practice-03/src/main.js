"use strict";

import { demoTasks } from "./data.js";
import { findTaskById, setTaskCompleted, removeTask } from "./task-service.js";
import { getVisibleTasks } from "./task-selectors.js";
import {
  renderTaskList,
  renderSummary,
  renderEmptyState,
} from "./task-view.js";

let currentTasks = demoTasks.map((task) => ({ ...task }));
let currentFilter = "all";

const listElement = document.querySelector("#task-list");
const summaryElement = document.querySelector("#task-summary");
const emptyMessageElement = document.querySelector("#empty-message");
const operationMessageElement = document.querySelector("#operation-message");
const filtersContainer = document.querySelector("#task-filters");

function renderApp() {
  const visibleTasks = getVisibleTasks(currentTasks, currentFilter);

  renderTaskList(listElement, visibleTasks);
  renderSummary(summaryElement, currentTasks, visibleTasks.length);
  renderEmptyState(emptyMessageElement, currentTasks.length, visibleTasks.length);
}

function isValidId(id) {
  return typeof id === "number" && Number.isSafeInteger(id) && id > 0;
}

function handleTaskListClick(event) {
  if (!(event.target instanceof Element)) return;

  const button = event.target.closest("button[data-action]");
  if (!button || !listElement.contains(button)) return;

  const action = button.dataset.action;
  if (action !== "toggle" && action !== "delete") return;

  const card = button.closest("li[data-task-id]");
  if (!card) return;

  const rawId = card.dataset.taskId;
  const id = Number(rawId);

  if (!isValidId(id)) {
    operationMessageElement.textContent = `Некорректный идентификатор: ${rawId}`;
    operationMessageElement.hidden = false;
    return;
  }

  let result;

  if (action === "toggle") {
    const task = findTaskById(currentTasks, id);
    if (!task) {
      operationMessageElement.textContent = `Задача с id = ${id} не найдена`;
      operationMessageElement.hidden = false;
      return;
    }
    result = setTaskCompleted(currentTasks, id, !task.completed);
  } else {
    result = removeTask(currentTasks, id);
  }

  if (!result.ok) {
    operationMessageElement.textContent = result.error;
    operationMessageElement.hidden = false;
    return;
  }

  currentTasks = result.tasks;
  operationMessageElement.textContent = "";
  operationMessageElement.hidden = true;
  renderApp();
}

function handleFilterClick(event) {
  if (!(event.target instanceof Element)) return;

  const button = event.target.closest("button[data-filter]");
  if (!button || !filtersContainer.contains(button)) return;

  const filter = button.dataset.filter;
  if (filter !== "all" && filter !== "pending" && filter !== "completed") return;

  currentFilter = filter;

  for (const btn of filtersContainer.querySelectorAll("button[data-filter]")) {
    const isActive = btn.dataset.filter === filter;
    btn.classList.toggle("is-active", isActive);
    btn.setAttribute("aria-pressed", isActive ? "true" : "false");
  }

  operationMessageElement.textContent = "";
  operationMessageElement.hidden = true;
  renderApp();
}

listElement.addEventListener("click", handleTaskListClick);
filtersContainer.addEventListener("click", handleFilterClick);

renderApp();