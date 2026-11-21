"use strict";

import { demoTasks } from "./src/data.js";
import { getPendingTasks } from "./src/task-service.js";

console.log("1) Для demoTasks:");
console.log(getPendingTasks(demoTasks).map((t) => t.id));

console.log("2) Для пустого массива:");
console.log(getPendingTasks([]));