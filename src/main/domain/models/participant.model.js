import database from "../../database";
import { UserSchema } from "./user.model";

const ParticipantSchema = new database.Schema({
  user: UserSchema,
  active: Boolean,
  role: String
});

export { ParticipantSchema };
export default database.model("Participant", ParticipantSchema);
