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

WeddingSchema.static({

  findByOwner(owner) {
    return this.findOneAsync({
      owners: {
        $elemMatch: owner
      }
    });
  },

  findTasksBy(owner) {
    return this.findOne({
      owners: {
        $elemMatch: owner
      }
    }).select("tasks")
      .exec()
      .then((wedding) => wedding.tasks);
  }

});

WeddingSchema.method({

  toJSON() {
    return this.toObject({
      versionKey: false
    });
  }

});

export default database.model("Wedding", WeddingSchema);
