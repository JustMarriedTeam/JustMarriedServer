import database from "../database";

const WeddingSchema = new database.Schema({
  participants: {
    groom: { type: database.Schema.ObjectId, ref: "User" },
    bride: { type: database.Schema.ObjectId, ref: "User" }
  },
  guests: [{
    firstName: {
      type: String
    },
    lastName: {
      type: String
    }
  }]
});

WeddingSchema.method({

  toJSON() {
    return this.toObject({
      versionKey: false
    });
  }

});

export default database.model("Wedding", WeddingSchema);
