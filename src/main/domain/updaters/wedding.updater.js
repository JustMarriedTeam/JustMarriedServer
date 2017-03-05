import map from "lodash/fp/map";
import set from "lodash/set";
import extend from "lodash/extend";
import merge from "lodash/merge";

export default class WeddingUpdater {

  static of(weddingToUpdate) {
    return new WeddingUpdater(weddingToUpdate);
  }

  constructor(weddingToUpdate) {
    this.weddingToUpdate = weddingToUpdate;
  }

  updateParticipants(updatedParticipants) {
    this.weddingToUpdate.participants = map((updatedParticipant) => {
      if (updatedParticipant.user) {
        return merge({}, set({}, "user._id", updatedParticipant._id), updatedParticipant);
      } else {
        return updatedParticipant;
      }
    })(updatedParticipants);
    return this;
  }

  updateGuests(updatedGuests) {
    const oldGuests = this.weddingToUpdate.guests;
    this.weddingToUpdate.guests = map((newGuest) => {
      const existingParticipant = oldGuests.id(newGuest._id);
      if (existingParticipant) {
        return extend(existingParticipant, newGuest);
      } else {
        return newGuest;
      }
    })(updatedGuests);
    return this;
  }

  updateTasks(updatedTasks) {
    const oldTasks = this.weddingToUpdate.tasks;
    this.weddingToUpdate.tasks = map((newTask) => {
      const existingTask = oldTasks.id(newTask._id);
      if (existingTask) {
        return extend(existingTask, newTask);
      } else {
        return newTask;
      }
    })(updatedTasks);
    return this;
  }

  get() {
    return this.weddingToUpdate;
  }

}
