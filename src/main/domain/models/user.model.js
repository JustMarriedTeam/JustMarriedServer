import database from "../../database";

const UserSchema = new database.Schema({
  username: String,
  firstName: String,
  lastName: String
});

export { UserSchema };
export default database.model("User", UserSchema);
