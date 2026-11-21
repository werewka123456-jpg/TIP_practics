"use strict";

import { demoTasks } from "./src/data.js";
import { setTaskCompleted } from "./src/task-service.js";

const result1 = setTaskCompleted(demoTasks, 4, true);

console.log("1) Успешное изменение:");
console.log("result.ok =", result1.ok);
console.log(
  "Новая запись (id = 4):",
  result1.tasks.find((t) => t.id === 4).completed
);
console.log(
  "Исходная запись (id = 4):",
  demoTasks.find((t) => t.id === 4).completed
);

const result2 = setTaskCompleted(demoTasks, 777, true);

console.log("\n2) Отсутствующая задача:");
console.log("result.ok =", result2.ok);
console.log("result.error =", result2.error);