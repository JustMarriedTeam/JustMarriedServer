import Wedding from "../models/wedding.model";
import merge from "lodash/merge";

export default class WeddingBuilder {

  constructor() {
    this.params = {};
  }

  withParticipants(participants) {
    this.params.participants = participants;
    return this;
  }

  withGuests(guests) {
    this.params.guests = guests;
    return this;
  }

  withTasks(tasks) {
    this.params.tasks = tasks;
    return this;
  }

  withOwner(owners) {
    this.params.owners = owners;
    return this;
  }

  build() {
    return new Wedding(this.params);
  }

}

const aWedding = () => new WeddingBuilder();

export { aWedding };
