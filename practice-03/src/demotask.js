const demoTasks = [
  { id: 1, title: "Изучить функции", completed: true, priority: "medium" },
  { id: 4, title: "Подготовить модель задач", completed: false, priority: "high" },
  { id: 7, title: "Проверить методы массивов", completed: false, priority: "low" },
  { id: 10, title: "Оформить README", completed: true, priority: "medium" },
];

function getPendingTasks(tasks) {
  return tasks.filter((task) => task.completed === false);
}

console.log("1) Для demoTasks:");
console.log(getPendingTasks(demoTasks).map((t) => t.id)); // [4, 7]

console.log("2) Для пустого массива:");
console.log(getPendingTasks([])); // []