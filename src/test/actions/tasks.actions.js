import Wedding from "../../main/domain/models/wedding.model";

export const getTasksForAccount = (account) => () =>
  Wedding.findByOwner(account.user, "tasks").then((wedding) => wedding.tasks);
