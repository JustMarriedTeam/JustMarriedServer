import Promise from "bluebird";
import noop from "lodash/fp/noop";
import {generateObjectId} from "../utils/id.generator";
import {anAccount, setUpAccounts, tearDownAccounts} from "../builders/account.builder";
import {aUser} from "../builders/user.builder";
import {aParticipant} from "../builders/participant.builder";
import {aTask} from "../builders/task.builder";
import {aWedding, setUpWeddings, tearDownWeddings} from "../builders/wedding.builder";
import {TASK_STATUS} from "../../main/domain/models/task.model";

function createSet() {

  const redUser = aUser()
    .withFirstName("redFirstName")
    .withLastName("redLastName").build();

  const redAccount = anAccount()
    .withUser(redUser).build();

  const redGroom = aParticipant()
    .withRole("groom")
    .withActive(true)
    .withUser(redUser)
    .build();

  const greenUser = aUser()
    .withFirstName("greenFirstName")
    .withLastName("greenLastName").build();

  const greenAccount = anAccount()
    .withUser(greenUser).build();

  const greenBride = aParticipant()
    .withRole("bride")
    .withActive(false)
    .withUser(greenUser)
    .build();

  const blackTaskId = generateObjectId();
  const blueTaskId = generateObjectId();
  const greenTaskId = generateObjectId();
  const redTaskId = generateObjectId();
  const pinkTaskId = generateObjectId();

  const blackTask = aTask(blackTaskId)
    .withName("black task")
    .withDescription("a black task")
    .withStatus(TASK_STATUS.DONE)
    .withDeadlineDate(new Date(2017, 2, 11))
    .withCompletionDate(new Date(2017, 2, 10))
    .withRequiredFor([redTaskId, greenTaskId])
    .build();

  const blueTask = aTask(blueTaskId)
    .withName("blue task")
    .withDescription("a blue task")
    .withStatus(TASK_STATUS.DONE)
    .withDeadlineDate(new Date(2017, 3, 21))
    .withCompletionDate(new Date(2017, 3, ))
    .withRequiredFor([greenTaskId])
    .build();

  const greenTask = aTask(greenTaskId)
    .withName("green task")
    .withDescription("a green task")
    .withStatus(TASK_STATUS.PENDING)
    .withDeadlineDate(new Date(2017, 10, 12))
    .withDependingOn([blackTask])
    .withRequiredFor([redTaskId])
    .build();

  const pinkTask = aTask(pinkTaskId)
    .withName("pink task")
    .withDescription("a pink task")
    .withStatus(TASK_STATUS.BLOCKED)
    .withDependingOn([greenTask, blueTask])
    .withRequiredFor([redTaskId])
    .build();

  const redTask = aTask(redTaskId)
    .withName("red task")
    .withDescription("a red task")
    .withStatus(TASK_STATUS.BLOCKED)
    .withDeadlineDate(new Date(2017, 12, 31))
    .withDependingOn([blackTask, pinkTask])
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
      pinkTask,
      blackTask
    ])
    .withGuests([
      {firstName: "firstNameA", lastName: "lastNameA"},
      {firstName: "firstNameB", lastName: "lastNameB"}
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
    pinkTask,
    redTask,
    coloredWedding
  };

}

function setUpColored(callback, bindValues = noop) {
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
  ).then(() => bindValues(set));

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
