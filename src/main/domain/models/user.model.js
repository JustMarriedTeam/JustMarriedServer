import database from "../../database";

const UserSchema = new database.Schema({
  firstName: String,
  lastName: String,
  contactEmail: String
});

export { UserSchema };
export default database.model("User", UserSchema);
