import database from "../database";
import { UserSchema } from "./user.model";

const ParticipantSchema = new database.Schema({
  user: UserSchema,
  role: String
});

ParticipantSchema.method({

  toJSON() {
    return this.toObject({
      versionKey: false
    });
  }

});

export { ParticipantSchema };
export default database.model("Participant", ParticipantSchema);
