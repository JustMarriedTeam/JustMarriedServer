import database from "../../database";

const GuestSchema = new database.Schema({
  firstName: String,
  lastName: String
});

GuestSchema.method({

  toJSON() {
    return this.toObject({
      versionKey: false
    });
  }

});

export { GuestSchema };
export default database.model("Guest", GuestSchema);
