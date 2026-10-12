"use strict";

const totalTasks = 9;
const completedTasks = 9;
const dailyLimit = 3;

if (
  typeof totalTasks !== "number" ||
  typeof completedTasks !== "number" ||
  !Number.isInteger(totalTasks) ||
  !Number.isInteger(completedTasks) ||
  !Number.isFinite(totalTasks) ||
  !Number.isFinite(completedTasks) ||
  totalTasks < 0 ||
  totalTasks > 1000 ||
  completedTasks < 0 ||
  completedTasks > totalTasks
) {
  console.log("Ошибка: недопустимые данные");
} 
else if (totalTasks === 0 && completedTasks === 0) {
  console.log("Задач пока нет");
} 
else {
  const remaining = totalTasks - completedTasks;
  const percent = (completedTasks / totalTasks) * 100;

  let status;
  if (completedTasks === 0) {
    status = "Не начато";
  } else if (completedTasks === totalTasks) {
    status = "Завершено";
  } else {
    status = "В работе";
  }

  console.log(`Всего задач: ${totalTasks}`);
  console.log(`Выполнено: ${completedTasks}`);
  console.log(`Осталось: ${remaining}`);
  console.log(`Прогресс: ${percent.toFixed(1)}%`);
  console.log(`Статус: ${status}`);
}