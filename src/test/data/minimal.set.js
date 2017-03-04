import Promise from "bluebird";

import { anAccount, setUpAccounts, tearDownAccounts } from "../builders/account.builder";
import { aUser } from "../builders/user.builder";
import { aParticipant } from "../builders/participant.builder";
import { aTask } from "../builders/task.builder";
import { aWedding, setUpWeddings, tearDownWeddings } from "../builders/wedding.builder";


import { TASK_STATUS } from "../../main/domain/models/task.model";

function createSet() {

  const miniUser = aUser()
    .withFirstName("miniFirstName")
    .withLastName("miniLastName").build();

  const miniAccount = anAccount()
    .withAssignments([
      {
        "action": "FILL_WEDDING",
        "done": false
      }
    ])
    .withUser(miniUser).build();

  const miniGroom = aParticipant()
    .withRole("groom")
    .withActive(true)
    .withUser(miniAccount)
    .build();

  const miniTask = aTask()
    .withName("mini task")
    .withDescription("a mini task")
    .withStatus(TASK_STATUS.BLOCKED)
    .build();

  const miniWedding = aWedding()
    .withOwners([
      miniUser
    ])
    .withParticipants([
      miniGroom
    ])
    .withTasks([
      miniTask
    ])
    .withGuests([
      { firstName: "miniFirstName", lastName: "miniLastName" }
    ]).build();

  return {
    miniUser,
    miniAccount,
    miniGroom,
    miniTask,
    miniWedding
  };

}

function setUpMinimal(callback) {
  const set = createSet();

  const {
    miniAccount,
    miniWedding
  } = set;

  return Promise.join(
    setUpAccounts(miniAccount),
    setUpWeddings(miniWedding),
    callback
  );

}

function tearDownMinimal() {
  return Promise.join(
    tearDownWeddings(),
    tearDownAccounts(),
  );
}

export {
  setUpMinimal,
  tearDownMinimal
};
