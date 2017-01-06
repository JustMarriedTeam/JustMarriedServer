import User from "../models/user.model";
import { getFromContext } from "../context";

const DEFAULT_SORT_BY = "status name";

function listUsers(criteria) {
  const actingUser = getFromContext("user");
  return User.find()
    .select("username firstName lastName")
    .where("actors").in([actingUser])
    .skip(criteria.offset)
    .limit(criteria.limit)
    .sort(criteria.sortBy || DEFAULT_SORT_BY)
    .exec();
}

function saveUser(userToSave) {
  const actingUser = getFromContext("user");
  return User
    .find()
    .where("actors")
    .in(userToSave.actors || [])
    .exec()
    .then((actors) => {
      actors.unshift(actingUser);
      userToSave.actors = actors;
      return User.createAsync(userToSave)
        .then((savedUser) => savedUser.populateAsync("actors", "_id username firstName lastName status"));
    });
}

export { listUsers, saveUser };

