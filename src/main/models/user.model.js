import database from "../database";

const UserSchema = new database.Schema({
  firstName: String,
  lastName: String,
  status: String
});

export default database.model("User", UserSchema);
