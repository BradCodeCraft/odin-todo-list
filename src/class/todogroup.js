import { compareAsc } from "date-fns";
import Todo from "./todo";

export default class TodoGroup {
  /**
   * @param {string} name
   */
  constructor(name) {
    /**
     * @param {string} string
     */
    function capitalize(string) {
      return string.charAt(0).toUpperCase() + string.substring(1);
    }
    this.name = capitalize(name);
    this.list = new Array();
  }

  /**
   * @param {Todo} todo
   * @returns {boolean}
   */
  hasTodo(todo) {
    for (const item of this.list) {
      // each Todo must be unique
      if (
        item.title === todo.title &&
        item.description === todo.description &&
        item.priority === todo.priority &&
        item.completed === todo.completed &&
        item.dueDate.toString() === todo.dueDate.toString()
      ) {
        return true;
      }
    }

    return false;
  }

  /**
   * @param {Todo} todo
   */
  getTodoIndex(todo) {
    for (let i = 0; i < this.list.length; i++) {
      if (
        this.list[i].title === todo.title &&
        this.list[i].description === todo.description &&
        this.list[i].priority === todo.priority &&
        this.list[i].completed === todo.completed &&
        this.list[i].dueDate.toString() === todo.dueDate.toString()
      ) {
        return i;
      }
    }
  }

  sortList() {
    this.list.sort(compareAsc);
  }

  /**
   * @param {Todo} todo
   */
  addToList(todo) {
    if (!this.hasTodo(todo)) {
      this.list.push(todo);
    }

    this.sortList();
  }

  /**
   * @param {Todo} todo
   */ removeFromList(todo) {
    if (this.hasTodo(todo)) {
      this.list.splice(this.getTodoIndex(todo), 1);
    }

    this.sortList();
  }
}
