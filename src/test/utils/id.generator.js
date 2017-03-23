import database from "../../main/database";

export const generateObjectId = () => new database.Types.ObjectId();
