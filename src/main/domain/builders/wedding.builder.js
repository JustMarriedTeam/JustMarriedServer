import Wedding from "../models/wedding.model";
import find from "lodash/fp/find";
import map from "lodash/map";
import merge from "lodash/merge";

const DEFAULT_PARTICIPANTS = [
  {
    role: "groom",
    active: false
  },
  {
    role: "bride",
    active: false
  },
  {
    role: "bridesmaid",
    active: false
  },
  {
    role: "bestMan",
    active: false
  }
];

const findByRole = (role) => find({ role });

export default class WeddingBuilder {

  constructor() {
    this.params = {};
  }

  withParticipants(participants) {
    this.params.participants = map(DEFAULT_PARTICIPANTS, (participant) =>
      merge({}, participant, findByRole(participant.role)(participants))
    );
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
