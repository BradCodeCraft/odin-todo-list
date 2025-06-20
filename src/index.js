import "./styles.css";
import Todo from "./class/todo";
import TodoGroup from "./class/todogroup";
import { format } from "date-fns";
import { exportTodoGroups, importTodoGroups } from "./utils/handleLocalStorage";

(function todolist(doc) {
  let defaultTodoGroup = new TodoGroup("All");
  let listOfTodoGroups = [defaultTodoGroup];

  /**
   * @param {TodoGroup} todoGroup
   */
  function createNewTodoGroup(todoGroup) {
    function hasTodoGroup() {
      for (let group of listOfTodoGroups) {
        if (group.name === todoGroup.name) {
          return true;
        }
      }

      return false;
    }

    if (!hasTodoGroup()) {
      listOfTodoGroups.push(todoGroup);
    }
  }

  /**
   * @param {TodoGroup} todoGroup
   */
  function getTodoGroup(todoGroup) {
    for (let group of listOfTodoGroups) {
      if (group.name === todoGroup.name) {
        return group;
      }
    }
  }

  /**
   * @param {TodoGroup} todoGroup
   */
  function removeTodoGroup(todoGroup) {
    function getTodoGroupIndex() {
      for (let i = 0; i < listOfTodoGroups.length; i++) {
        if (listOfTodoGroups[i].name === todoGroup.name) {
          return i;
        }
      }
    }

    listOfTodoGroups.splice(getTodoGroupIndex(), 1);
  } /**
   * @param {Todo} todo
   * @param {TodoGroup} todoGroup
   */
  function addToTodoGroup(todo, todoGroup) {
    todoGroup.addToList(todo);
  }

  /**
   * @param {Todo} todo
   */
  function createNewTodo(todo) {
    getTodoGroup(new TodoGroup("All")).addToList(todo);
  }

  /**
   * @param {Todo} todo
   */
  function removeTodo(todo) {
    for (let i = 0; i < listOfTodoGroups.length; i++) {
      listOfTodoGroups[i].removeFromList(todo);
    }
  }

  /**
   * @param {Todo} oldTodo
   * @param {Todo} newTodo
   */
  function replaceTodo(oldTodo, newTodo) {
    for (let i = 0; i < listOfTodoGroups.length; i++) {
      if (listOfTodoGroups[i].hasTodo(oldTodo)) {
        listOfTodoGroups[i].list[listOfTodoGroups[i].getTodoIndex(oldTodo)] =
          newTodo;
      }
    }
  }

  /**
   * @param {Event} event
   */
  function clearForm(event) {
    event.target.querySelector("#title").value = "";
    event.target.querySelector("#description").value = "";
    event.target.querySelector("#due-date").value = "";
  }

  /**
   * @param {Event} event
   * @return {Todo}
   */
  function processTodoFormInformation(event) {
    const title = event.target.querySelector("#title").value;
    const description = event.target.querySelector("#description").value;
    const dueDateInputValue = event.target
      .querySelector("#due-date")
      .value.split("-");
    const dueDate = new Date(
      dueDateInputValue[0],
      dueDateInputValue[1] - 1,
      dueDateInputValue[2],
      23,
      59,
      59,
    );
    const priority = parseInt(event.target.querySelector("#priority").value);
    const newTodo = new Todo(title, description, dueDate, priority);
    return newTodo;
  }

  /**
   * @param {Todo} todo
   */
  function populateEditForm(todo) {
    doc.querySelector(".edit-todo-form-container #title").value = todo.title;
    doc.querySelector(".edit-todo-form-container #description").value =
      todo.description;
    doc.querySelector(".edit-todo-form-container #due-date").value = format(
      todo.dueDate,
      "yyyy-MM-dd",
    );
    doc.querySelector(".edit-todo-form-container #priority").value =
      todo.priority;

    doc
      .querySelector(".edit-todo-form")
      .addEventListener("submit", function (event) {
        event.preventDefault();
        const newTodo = processTodoFormInformation(event);

        replaceTodo(todo, newTodo);
        populateTodoCards(getTodoGroup(new TodoGroup("All")));
        exportTodoGroups(listOfTodoGroups);
        doc.querySelector(".edit-todo-form-container").style.display = "none";
      });
  }

  function populateTodoGroups() {
    doc.querySelector(".todo-groups-container").innerHTML = "";
    listOfTodoGroups.forEach(function (todoGroup) {
      const todoGroupButton = doc.createElement("button");
      todoGroupButton.textContent = todoGroup.name;
      todoGroupButton.addEventListener("click", function () {
        populateTodoCards(getTodoGroup(new TodoGroup(todoGroup.name)));
      });

      doc.querySelector(".todo-groups-container").append(todoGroupButton);
    });
  }

  /**
   * @param {Todo} todo
   * @param {TodoGroup} todoGroup
   */
  function makeTodoCard(todo, todoGroup) {
    const cardTitle = doc.createElement("h1");
    cardTitle.textContent = todo.title;
    const cardDueDate = doc.createElement("p");
    cardDueDate.textContent = "Due: " + format(todo.dueDate, "dd/MM/yy");
    const cardInformationContainer = doc.createElement("div");
    cardInformationContainer.setAttribute(
      "class",
      "todo-card-information-container",
    );
    if (todo.completed) {
      cardInformationContainer.style.textDecoration = "line-through";
    }
    cardInformationContainer.addEventListener("click", function () {
      const newTodo = new Todo(
        todo.title,
        todo.description,
        todo.dueDate,
        todo.priority,
      );
      newTodo.completed = !todo.completed;
      replaceTodo(todo, newTodo);
      populateTodoCards(getTodoGroup(new TodoGroup("All")));
      exportTodoGroups(listOfTodoGroups);
    });
    cardInformationContainer.append(cardTitle, cardDueDate);

    const cardDeleteButton = doc.createElement("button");
    cardDeleteButton.setAttribute("class", "delete-button");
    cardDeleteButton.setAttribute("type", "button");
    cardDeleteButton.textContent = "Delete";
    cardDeleteButton.addEventListener("click", function () {
      removeTodo(todo);
      populateTodoCards(todoGroup);
      exportTodoGroups(listOfTodoGroups);
    });
    const cardEditButton = doc.createElement("button");
    cardEditButton.setAttribute("class", "edit-button");
    cardEditButton.setAttribute("type", "button");
    cardEditButton.textContent = "Edit";
    cardEditButton.addEventListener("click", function () {
      populateEditForm(todo);
      doc.querySelector(".edit-todo-form-container").style.display = "flex";
    });
    const cardAddToGroupButton = doc.createElement("button");
    cardAddToGroupButton.setAttribute("class", "add-button");
    cardAddToGroupButton.setAttribute("type", "button");
    cardAddToGroupButton.textContent = "Add";
    cardAddToGroupButton.addEventListener("click", function () {
      listOfTodoGroups.forEach(function (todoGroup) {
        const option = doc.createElement("option");
        option.setAttribute("value", todoGroup.name);
        option.textContent = todoGroup.name;
        doc
          .querySelector(".add-todo-to-todo-group-form #todo-group")
          .append(option);
      });

      doc
        .querySelector(".add-todo-to-todo-group-form")
        .addEventListener("submit", function (event) {
          event.preventDefault();
          const todoGroup = getTodoGroup(
            new TodoGroup(event.target.querySelector("#todo-group").value),
          );
          addToTodoGroup(todo, todoGroup);
          doc.querySelector(
            ".add-todo-to-todo-group-form-container",
          ).style.display = "none";
          exportTodoGroups(listOfTodoGroups);
        });

      doc.querySelector(
        ".add-todo-to-todo-group-form-container",
      ).style.display = "flex";
    });

    const cardButtonsContainer = doc.createElement("div");
    cardButtonsContainer.setAttribute("class", "todo-card-buttons-container");
    cardButtonsContainer.append(
      cardDeleteButton,
      cardEditButton,
      cardAddToGroupButton,
    );

    const card = doc.createElement("div");
    card.setAttribute("class", "todo-card-container");
    card.append(cardInformationContainer, cardButtonsContainer);

    return card;
  }

  /**
   * @param {TodoGroup} todoGroup
   */
  function populateTodoCards(todoGroup) {
    doc.querySelector(".todos-container").innerHTML = "";
    todoGroup.list.forEach(function (todo) {
      const card = makeTodoCard(todo, todoGroup);
      doc.querySelector(".todos-container").append(card);
    });
  }

  doc
    .querySelector(".new-todo-form")
    .addEventListener("submit", function (event) {
      event.preventDefault();

      const newTodo = processTodoFormInformation(event);
      createNewTodo(newTodo);
      populateTodoCards(getTodoGroup(new TodoGroup("All")));
      exportTodoGroups(listOfTodoGroups);
      doc.querySelector(".new-todo-form-container").style.display = "none";
    });

  doc
    .querySelector(".new-todo-group-form")
    .addEventListener("submit", function (event) {
      event.preventDefault();

      const name = event.target.querySelector("#name").value;
      const newTodoGroup = new TodoGroup(name);
      createNewTodoGroup(newTodoGroup);
      populateTodoGroups();
      exportTodoGroups(listOfTodoGroups);
      doc.querySelector(".new-todo-group-form-container").style.display =
        "none";
    });

  doc
    .querySelector(".new-todo-form")
    .addEventListener("reset", function (event) {
      event.preventDefault();
      clearForm(event);
      doc.querySelector(".new-todo-form-container").style.display = "none";
    });

  doc
    .querySelector(".edit-todo-form")
    .addEventListener("reset", function (event) {
      event.preventDefault();
      clearForm(event);
      doc.querySelector(".edit-todo-form-container").style.display = "none";
    });

  doc
    .querySelector(".new-todo-group-form")
    .addEventListener("reset", function (event) {
      event.preventDefault();
      event.target.querySelector("#name").value = "";
      doc.querySelector(".new-todo-group-form-container").style.display =
        "none";
    });

  doc
    .querySelector(".add-todo-to-todo-group-form")
    .addEventListener("reset", function (event) {
      event.preventDefault();
      doc.querySelector(
        ".add-todo-to-todo-group-form-container",
      ).style.display = "none";
    });

  doc
    .querySelector(".create-new-todo-button")
    .addEventListener("click", function () {
      doc.querySelector(".new-todo-form-container").style.display = "flex";
    });

  doc
    .querySelector(".create-new-todo-group-button")
    .addEventListener("click", function () {
      doc.querySelector(".new-todo-group-form-container").style.display =
        "flex";
    });

  doc.addEventListener("DOMContentLoaded", function () {
    listOfTodoGroups = importTodoGroups();
    populateTodoGroups();
    populateTodoCards(getTodoGroup(new TodoGroup("All")));
  });
})(document);
