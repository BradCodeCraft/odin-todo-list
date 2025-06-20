export default class Todo {
  /**
   * @param {string} title
   * @param {string} description
   * @param {Date} dueDate
   * @param {number} priority
   */
  constructor(title, description, dueDate, priority) {
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
    this.completed = false;
  }
}
