import map from "lodash/fp/map";
import omit from "lodash/omit";
import get from "lodash/get";
import extend from "lodash/extend";

export default class WeddingUpdater {

  static of(weddingToUpdate) {
    return new WeddingUpdater(weddingToUpdate);
  }

  constructor(weddingToUpdate) {
    this.weddingToUpdate = weddingToUpdate;
  }

  updateParticipants(updatedParticipants) {
    const oldParticipants = this.weddingToUpdate.participants;
    this.weddingToUpdate.participants = map((newParticipant) => {
      const existingParticipant = oldParticipants.id(newParticipant.id);
      if (existingParticipant) {
        extend(existingParticipant, omit(newParticipant, "user"));
        if (existingParticipant.user) {
          extend(existingParticipant.user, newParticipant.user);
        } else {
          existingParticipant.user = newParticipant.user;
        }
        return existingParticipant;
      } else {
        return newParticipant;
      }
    })(updatedParticipants);
    return this;
  }

  updateGuests(updatedGuests) {
    const oldGuests = this.weddingToUpdate.guests;
    this.weddingToUpdate.guests = map((newGuest) => {
      const existingParticipant = oldGuests.id(newGuest.id);
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
      const existingTask = oldTasks.id(newTask.id);
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
