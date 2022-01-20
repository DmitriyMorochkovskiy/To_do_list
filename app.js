let input = document.querySelector("#task-input");
let addTaskButton = document.querySelector("#add-task-btn");
let taskList = document.querySelector(".task-list");
let noStartMessage = document.querySelector("#no-tasts-message");
let dropDown = document.querySelector(".dropdown-content");
let deleteAllButton = document.querySelector("#delete-all-button");

class Task {
  constructor(text) {
    this.text = text;
    this.isDone = false;
    this.isPriority = false;
  }
};


let data = {
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

    if (this.tasks.length === 0) taskList.innerHTML = `<p id="no-tasts-message">No tasks ...</p>`
    this.save();
  },

  save() {
    localStorage.setItem("tasks", JSON.stringify(this.tasks));
  },

  load() {
    this.tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  }
};


class TasksListView {
  element;
  data;

  constructor(element) {
    this.element = element;
    data = data;
  }

  #drawList(tasksElements) {
    this.element.innerHTML = "";

    tasksElements.forEach(taskElement => {
      taskElement.createTaskTemplate(this.element);
    });
  }

  showFilteredTasks(target) {
    let showCompletedButton = document.querySelector("#show-completed-tasks");
    let showNotCompletedButton = document.querySelector("#show-not-completed-tasks");
    let showImportantButton = document.querySelector("#show-important-tasks");
    let showNotImportantButton = document.querySelector("#show-not-important-tasks");

    let taskElements = [];
    let tasks = [];

    if (data.tasks.length === 0) {
      return
    }
    switch (target) {
      case showCompletedButton:
        tasks = data.CompletedTasks;
        break;
      case showNotCompletedButton:
        tasks = data.notCompletedTasks;
        break;
      case showImportantButton:
        tasks = data.importantTasks;
        break;
      case showNotImportantButton:
        tasks = data.notImportantTasks;
        break;
      default:
        tasks = data.allTasks;
        break;
    }


    if (tasks.length === 0) return alert("No  relevant tasks");
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

  createTaskTemplate(element) {
    this.div = document.createElement("div");
    this.div.classList.add("task");

    let check = document.createElement("i");
    check.classList.add("fa-regular", "fa-circle");
    check.addEventListener("click", this.changeState.bind(this));
    check.setAttribute("title", "Mark as done");

    let p = document.createElement("p");
    p.innerText = this.task.text;

    let star = document.createElement("i");
    star.classList.add("fa-regular");
    star.classList.add("fa-star");
    star.addEventListener("click", this.changePrioriry.bind(this));
    star.setAttribute("title", "Mark as important");

    let deleteButton = document.createElement("i");
    deleteButton.classList.add("fas");
    deleteButton.classList.add("fa-trash-alt");
    deleteButton.addEventListener("click", this.delete.bind(this));
    deleteButton.setAttribute("title", "Delete task");

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
    data.save();
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

    data.save();
  }

  delete() {
    if (confirm("Do you really want to delete this task?")) {
      data.delete(this.task);
      this.div.remove();
    }
  }
};


data.load();
let tasksListView = new TasksListView(taskList);

addTaskButton.addEventListener("click", addTaskHandler);

window.addEventListener("load", function () {
  tasksListView.showFilteredTasks();
});

input.addEventListener("keydown", function (e) {
  const ENTER_KEY_CODE = 13;
  if (e.keyCode === ENTER_KEY_CODE) {
    addTaskHandler();
  }
});

function addTaskHandler() {
  if (input.value) {
    if (!noStartMessage.hidden) {
      noStartMessage.hidden = true;
    }
    let newTask = new Task(input.value);
    data.add(newTask);
    tasksListView.showFilteredTasks();

    input.value = "";
  } else {
    alert("The field cannot be empty");
  }
};


dropDown.addEventListener("click", (e) => {
  tasksListView.showFilteredTasks(e.target)
});

deleteAllButton.addEventListener("click", () => {
  if (confirm("Are you sure you want to delete everything?")) {
    localStorage.clear();
    taskList.innerHTML = `<p id="no-tasts-message">No tasks ...</p>`;
    data.tasks = [];
  }
});