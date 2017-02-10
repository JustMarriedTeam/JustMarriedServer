import Wedding from "../models/wedding.model";

export default class WeddingBuilder {

  constructor() {
    this.params = {};
  }

  withParticipants(participants) {
    this.params.participants = participants;
    return this;
  }

  withGuests(guests) {
    this.params.participants = guests;
    return this;
  }

  withTasks(tasks) {
    this.params.participants = tasks;
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
