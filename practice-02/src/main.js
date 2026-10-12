"use strict";

import { demoTasks, variantTasks, variantNumber } from "./data.js";
import {
  createTask,
  findTaskById,
  getPendingTasks,
  getTaskTitles,
  getTaskStats,
  addTask,
  setTaskCompleted,
  renameTask,
  removeTask,
} from "./task-service.js";

// ============================================================
//         Вспомогательная функция для вывода сводки
// ============================================================

function printStats(label, tasks) {
  const { total, completed, pending, progress } = getTaskStats(tasks);
  console.log(`\n--- ${label} ---`);
  console.log(`Всего: ${total}; Выполнено: ${completed}; Осталось: ${pending}`);
  if (total === 0) {
    console.log("Задач пока нет");
  } else {
    console.log(`Прогресс: ${progress.toFixed(1)}%`);
  }
}

// ============================================================
//          ОБЩИЙ СЦЕНАРИЙ
// ============================================================

console.log("=".repeat(50));
console.log("ОБЩИЙ СЦЕНАРИЙ");
console.log("=".repeat(50));

let currentTasks = demoTasks;

console.log("\nИсходные задачи:");
console.log(getTaskTitles(currentTasks));

printStats("Исходный набор", currentTasks);

let r = addTask(currentTasks, 20, "Добавить проверку", "high");
if (r.ok) { currentTasks = r.tasks; } else { console.error(`Ошибка: ${r.error}`); }
printStats("После добавления id = 20", currentTasks);

r = setTaskCompleted(currentTasks, 4, true);
if (r.ok) { currentTasks = r.tasks; } else { console.error(`Ошибка: ${r.error}`); }
printStats("После выполнения id = 4", currentTasks);

r = renameTask(currentTasks, 10, "Подготовить инструкцию запуска");
if (r.ok) { currentTasks = r.tasks; } else { console.error(`Ошибка: ${r.error}`); }
printStats("После переименования id = 10", currentTasks);

r = removeTask(currentTasks, 7);
if (r.ok) { currentTasks = r.tasks; } else { console.error(`Ошибка: ${r.error}`); }
printStats("После удаления id = 7", currentTasks);

console.log("\nИдентификаторы итогового списка:", currentTasks.map((t) => t.id));

r = addTask(currentTasks, 20, "Дубликат", "low");
if (r.ok) {
  console.log("Неожиданно: дубликат добавлен");
} else {
  console.log(`\nОжидаемая ошибка: ${r.error}`);
}

console.log("\ndemoTasks не изменился:");
console.log("Идентификаторы demoTasks:", demoTasks.map((t) => t.id));
console.log("Первая задача demoTasks:", demoTasks[0]);

// ============================================================
//                 ИНДИВИДУАЛЬНЫЙ СЦЕНАРИЙ 
// ============================================================

console.log("\n" + "=".repeat(50));
console.log(`ИНДИВИДУАЛЬНЫЙ СЦЕНАРИЙ (вариант ${variantNumber})`);
console.log("=".repeat(50));

let myTasks = variantTasks;

console.log("\nИсходные задачи варианта:");
console.log(getTaskTitles(myTasks));
printStats("Исходный набор варианта", myTasks);

r = addTask(myTasks, 80, "Финальная проверка сайта", "low");
if (r.ok) { myTasks = r.tasks; } else { console.error(`Ошибка: ${r.error}`); }
printStats("После добавления id = 80", myTasks);

r = setTaskCompleted(myTasks, 11, true);
if (r.ok) { myTasks = r.tasks; } else { console.error(`Ошибка: ${r.error}`); }
printStats("После completed = true для id = 11", myTasks);

r = renameTask(myTasks, 23, "Написать раздел «Обо мне» (обновлено)");
if (r.ok) { myTasks = r.tasks; } else { console.error(`Ошибка: ${r.error}`); }
printStats("После переименования id = 23", myTasks);

r = removeTask(myTasks, 37);
if (r.ok) { myTasks = r.tasks; } else { console.error(`Ошибка: ${r.error}`); }
printStats("После удаления id = 37", myTasks);

r = addTask(myTasks, 80, "Дубликат", "low");
if (r.ok) {
  console.log("Неожиданно: дубликат добавлен");
} else {
  console.log(`\nОжидаемая ошибка: ${r.error}`);
}

console.log("\nИтоговые идентификаторы варианта:", myTasks.map((t) => t.id));
console.log("variantTasks не изменился:");
console.log("Идентификаторы variantTasks:", variantTasks.map((t) => t.id));