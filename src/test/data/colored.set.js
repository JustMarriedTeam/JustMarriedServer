import Promise from "bluebird";

import { anAccount, setUpAccounts, tearDownAccounts } from "../builders/account.builder";
import { aUser } from "../builders/user.builder";
import { aParticipant } from "../builders/participant.builder";
import { aTask } from "../builders/task.builder";
import { aWedding, setUpWeddings, tearDownWeddings } from "../builders/wedding.builder";


import { TASK_STATUS } from "../../main/domain/models/task.model";

function createSet() {

  const redUser = aUser()
    .withUsername("redUsername")
    .withFirstName("redFirstName")
    .withLastName("redLastName").build();

  const redAccount = anAccount()
    .withUser(redUser).build();

  const redGroom = aParticipant()
    .withRole("groom")
    .withUser(redUser)
    .build();

  const greenUser = aUser()
    .withUsername("greenUsername")
    .withFirstName("greenFirstName")
    .withLastName("greenLastName").build();

  const greenAccount = anAccount()
    .withUser(greenUser).build();

  const greenBride = aParticipant()
    .withRole("bride")
    .withUser(greenUser)
    .build();

  const blackTask = aTask()
    .withName("black task")
    .withDescription("a black task")
    .withStatus(TASK_STATUS.BLOCKED)
    .build();

  const blueTask = aTask()
    .withName("blue task")
    .withDescription("a blue task")
    .withStatus(TASK_STATUS.DONE)
    .build();

  const greenTask = aTask()
    .withName("green task")
    .withDescription("a green task")
    .withStatus(TASK_STATUS.PENDING)
    .build();

  const redTask = aTask()
    .withName("red task")
    .withDescription("a red task")
    .withStatus(TASK_STATUS.BLOCKED)
    .build();

  const coloredWedding = aWedding()
    .withOwners([
      redUser,
      greenUser
    ])
    .withParticipants([
      redGroom,
      greenBride
    ])
    .withTasks([
      redTask,
      blueTask,
      greenTask,
      blackTask
    ])
    .withGuests([
      { firstName: "firstNameA", lastName: "lastNameA" },
      { firstName: "firstNameB", lastName: "lastNameB" }
    ]).build();

  return {
    redUser,
    redAccount,
    redGroom,
    greenUser,
    greenAccount,
    greenBride,
    blackTask,
    blueTask,
    greenTask,
    redTask,
    coloredWedding
  };

}

function setUpColored(callback) {
  const set = createSet();

  const {
    redAccount,
    greenAccount,
    coloredWedding
  } = set;

  return Promise.join(
    setUpAccounts(redAccount, greenAccount),
    setUpWeddings(coloredWedding),
    callback
  );

}

function tearDownColored() {
  return Promise.join(
    tearDownWeddings(),
    tearDownAccounts(),
  );
}

export {
  setUpColored,
  tearDownColored
};
