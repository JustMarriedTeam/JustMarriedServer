import database from "../../database";
import { ParticipantSchema } from "./participant.model";
import { UserSchema } from "./user.model";
import { TaskSchema } from "./task.model";
import { GuestSchema } from "./guest.model";

const WeddingSchema = new database.Schema({
  name: String,
  description: String,
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

  addTask(taskToAdd) {
    this.tasks.push(taskToAdd);
    return this.saveAsync();
  }

});

export default database.model("Wedding", WeddingSchema);
