import database from "../../database";

const UserSchema = new database.Schema({
  username: String,
  firstName: String,
  lastName: String
});

UserSchema.method({

  toJSON() {
    return this.toObject({
      versionKey: false
    });
  }

});

export { UserSchema };
export default database.model("User", UserSchema);
