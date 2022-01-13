let input = document.querySelector("#task-input");
let addTaskButton = document.querySelector("#add-task-btn");
let taskList = document.querySelector(".task-list");
let startMessage = document.querySelector("#start-message");
let dropDown = document.querySelector(".dropdown-content");

class Task {
  constructor(text) {
    this.text = text;
    this.isDone = false;
    this.isPriority = false;
  }
};

let dataService = {
  tasks: [],

  get allTasks() {
    return this.tasks;
  },

  get CompletedTasks() {
    return this.tasks.filter(task => task.isDone === true);
  },

  get notCompletedTasks() {
    return this.tasks.filter(task => task.isDone === false);
  },

  get importantTasks() {
    return this.tasks.filter(task => task.isPriority === true);
  },

  get notImportantTasks() {
    return this.tasks.filter(task => task.isPriority === false);
  },

  add(task) {
    this.tasks.push(task);
    this.save();
  },

  delete(task) {
    let index = this.tasks.indexOf(task);
    this.tasks.splice(index, 1);

    if (this.tasks.length === 0) taskList.innerHTML = `<p id="start-message">No tasks ...</p>`
    this.save();
  },

  save() {
    localStorage.setItem("tasks", JSON.stringify(this.tasks));
  },

  open() {
    this.tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  }
};

class TasksListView {
  element;
  dataService;

  constructor(element) {
    this.element = element;
    dataService = dataService;
  }

  #drawList(tasksElements) {
    this.element.innerHTML = "";

    tasksElements.forEach(taskElement => {
      taskElement.createIn(this.element);
    });
  }

  drawAll() {
    let taskElements = [];
    let tasks = dataService.allTasks;
    if (tasks.length === 0) return;

    tasks.forEach(task => {
      taskElements.push(new TaskView(task))
    });
    this.#drawList(taskElements);
  }

  drawCompleted() {
    let taskElements = [];
    let tasks = dataService.CompletedTasks;
    if (tasks.length === 0) return alert("No completed tasks");

    tasks.forEach(task => {
      taskElements.push(new TaskView(task))
    });
    this.#drawList(taskElements);
  }

  drawNotCompleted() {
    let taskElements = [];
    let tasks = dataService.notCompletedTasks;
    if (tasks.length === 0) return alert("Not completed tasks are missing");

    tasks.forEach(task => {
      taskElements.push(new TaskView(task))
    });
    this.#drawList(taskElements);
  }

  drawImportant() {
    let taskElements = [];
    let tasks = dataService.importantTasks;
    if (tasks.length === 0) return alert("Not important tasks are missing");

    tasks.forEach(task => {
      taskElements.push(new TaskView(task))
    });
    this.#drawList(taskElements);
  }

  drawNotImportant() {
    let taskElements = [];
    let tasks = dataService.notImportantTasks;
    if (tasks.length === 0) return alert("No important tasks");

    tasks.forEach(task => {
      taskElements.push(new TaskView(task))
    });
    this.#drawList(taskElements);
  }
};

class TaskView {
  constructor(task) {
    this.task = task;
    this.div = null;
  }

  createIn(element) {
    this.div = document.createElement("div");
    this.div.classList.add("task");

    let check = document.createElement("i");
    check.classList.add("fa-regular", "fa-circle");
    check.addEventListener("click", this.changeState.bind(this));
    check.setAttribute("title", "Check this point if you have completed the task");

    let p = document.createElement("p");
    p.innerText = this.task.text;

    let star = document.createElement("i");
    star.classList.add("fa-regular");
    star.classList.add("fa-star");
    star.addEventListener("click", this.changePrioriry.bind(this));
    star.setAttribute("title", "Check this point if you task is important");

    let deleteButton = document.createElement("i");
    deleteButton.classList.add("fas");
    deleteButton.classList.add("fa-trash-alt");
    deleteButton.addEventListener("click", this.delete.bind(this));
    deleteButton.setAttribute("title", "Click this button to delete a task");

    this.div.append(check);
    this.div.append(p);
    
    this.div.append(star);
    this.div.append(deleteButton);

    if (this.task.isDone) {
      this.div.classList.add("completed");
      this.div.childNodes[0].classList.toggle("fa-solid");
      this.div.childNodes[0].classList.toggle("fa-circle-check");
      this.div.childNodes[0].classList.toggle("fa-regular");
      this.div.childNodes[0].classList.toggle("fa-circle");
    }

    if (this.task.isPriority) {
      this.div.classList.add("priority");

      this.div.childNodes[2].classList.toggle("fa-solid");
      this.div.childNodes[2].classList.toggle("fa-regular");
    }

    element.append(this.div);
  }

  changeState() {
    this.task.isDone = !this.task.isDone;
    dataService.save();
    this.div.classList.toggle("completed");

    this.div.childNodes[0].classList.toggle("fa-solid");
    this.div.childNodes[0].classList.toggle("fa-circle-check");
    this.div.childNodes[0].classList.toggle("fa-regular");
    this.div.childNodes[0].classList.toggle("fa-circle");
  }

  changePrioriry() {
    this.task.isPriority = !this.task.isPriority;
    this.div.classList.toggle("priority");

    this.div.childNodes[2].classList.toggle("fa-solid");
    this.div.childNodes[2].classList.toggle("fa-regular");

    dataService.save();
  }

  delete() {
    if (confirm("Do you really want to delete this task?")) {
      dataService.delete(this.task);
      this.div.remove();
    }
  }
};


dataService.open();
let tasksListView = new TasksListView(taskList);

addTaskButton.addEventListener("click", addTaskHandler);

window.addEventListener("load", function () {
  tasksListView.drawAll();
});

input.addEventListener("keydown", function (e) {
  if (e.code === "Enter") addTaskHandler();
});

function addTaskHandler() {
  if (input.value) {
    if (!startMessage.hidden) startMessage.hidden = true;

    let newTask = new Task(input.value);
    dataService.add(newTask);
    tasksListView.drawAll();

    input.value = "";
  } else {
    alert("The field cannot be empty");
  }
};


dropDown.addEventListener("click", (e) => {
  let showAllButton = document.querySelector("#show-all-tasks");
  let showCompletedButton = document.querySelector("#show-completed-tasks");
  let showNotCompletedButton = document.querySelector("#show-not-completed-tasks");
  let showImportantButton = document.querySelector("#show-important");
  let showNotImportantButton = document.querySelector("#show-not-important");

  let deleteAllButton = document.querySelector("#delete-all-btn");
  switch (e.target) {
    case showAllButton:
      if (dataService.tasks.length === 0) return alert("No tasks");
      tasksListView.drawAll();
      break;
    case showCompletedButton:
      tasksListView.drawCompleted();
      break;
    case showNotCompletedButton:
      tasksListView.drawNotCompleted();
      break;
    case showImportantButton:
      tasksListView.drawImportant();
      break;
    case showNotImportantButton:
      tasksListView.drawNotImportant();
      break;
    case deleteAllButton:
      if (confirm("Are you sure you want to delete everything?")) {
        localStorage.clear();
        taskList.innerHTML = `<p id="start-message">No tasks ...</p>`;
        dataService.tasks = [];
      }
      break
  }
});