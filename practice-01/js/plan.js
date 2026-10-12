"use strict";

const totalTasks = 9;
const completedTasks = 9;
const dailyLimit = 3;

const isValidData =
  typeof totalTasks === "number" &&
  Number.isInteger(totalTasks) &&
  Number.isFinite(totalTasks) &&
  totalTasks >= 0 &&
  totalTasks <= 1000 &&

  typeof completedTasks === "number" &&
  Number.isInteger(completedTasks) &&
  Number.isFinite(completedTasks) &&
  completedTasks >= 0 &&
  completedTasks <= totalTasks &&

  typeof dailyLimit === "number" &&
  Number.isInteger(dailyLimit) &&
  Number.isFinite(dailyLimit) &&
  dailyLimit >= 1 &&
  dailyLimit <= 1000;

if (!isValidData) {
  console.log("Ошибка: недопустимые данные");
} else {
  let remaining = totalTasks - completedTasks;
  let day = 0;

  console.log(`Осталось задач: ${remaining}`);

  while (remaining > 0) {
    day += 1;
    const todayTasks = Math.min(remaining, dailyLimit);
    remaining -= todayTasks;
    console.log(`День ${day}: выполнено ${todayTasks}, осталось ${remaining}`);
  }

  console.log(`Потребуется дней: ${day}`);
}