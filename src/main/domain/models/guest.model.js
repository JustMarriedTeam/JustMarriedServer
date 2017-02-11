import database from "../../database";

const GuestSchema = new database.Schema({
  firstName: String,
  lastName: String
});

export { GuestSchema };
export default database.model("Guest", GuestSchema);
