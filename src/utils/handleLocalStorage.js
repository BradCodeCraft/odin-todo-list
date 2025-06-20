import TodoGroup from "../class/todogroup";

/**
 * @param {TodoGroup[]} listOfTodoGroups
 */
export function exportTodoGroups(listOfTodoGroups) {
  listOfTodoGroups.forEach(function (todoGroup) {
    localStorage.setItem(todoGroup.name, JSON.stringify(todoGroup.list));
  });
}

export function importTodoGroups() {
  let listOfTodoGroups = [];
  const todoGroupNames = Object.keys(localStorage);

  for (const todoGroupName of todoGroupNames) {
    const todoGroup = new TodoGroup(todoGroupName);
    todoGroup.list = JSON.parse(localStorage.getItem(todoGroupName));
    listOfTodoGroups.push(todoGroup);
  }

  return listOfTodoGroups.length === 0
    ? [new TodoGroup("All")]
    : listOfTodoGroups;
}
