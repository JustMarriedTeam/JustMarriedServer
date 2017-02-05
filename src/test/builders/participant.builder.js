import Participant from "../../main/models/participant.model";

import builderDecorator from "../utils/builder.decorator";

const ParticipantBuilder = builderDecorator(Participant);

function aParticipant() {
  return new ParticipantBuilder();
}

export {
  aParticipant
};
