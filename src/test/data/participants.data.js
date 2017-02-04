import Participant from "../../main/models/participant.model";
import {
  greenUser,
  redUser
} from "./users.data";

import builderDecorator from "../utils/builder.decorator";

const ParticipantBuilder = builderDecorator(Participant);

function aUser() {
  return new ParticipantBuilder();
}

const groom = aUser()
  .withRole("groom")
  .withUser(greenUser)
  .build();

const bride = aUser()
  .withRole("bride")
  .withUser(redUser)
  .build();

export {
  aUser,
  groom,
  bride
};
