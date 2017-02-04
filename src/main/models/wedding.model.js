import database from "../database";
import { ParticipantSchema } from "./participant.model";
import { UserSchema } from "./user.model";
import { TaskSchema } from "./task.model";
import { GuestSchema } from "./guest.model";

const WeddingSchema = new database.Schema({
  owners: [UserSchema],
  participants: [ParticipantSchema],
  tasks: [TaskSchema],
  guests: [GuestSchema]
});

WeddingSchema.method({

  toJSON() {
    return this.toObject({
      versionKey: false
    });
  }

});

export default database.model("Wedding", WeddingSchema);
