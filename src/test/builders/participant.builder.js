import Participant from "../../main/domain/models/participant.model";

import builderDecorator from "../utils/builder.decorator";

const ParticipantBuilder = builderDecorator(Participant);

function aParticipant() {
  return new ParticipantBuilder();
}

export {
  aParticipant
};
