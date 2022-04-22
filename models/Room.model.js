const { Schema, model } = require("mongoose");


const roomSchema = new Schema({
    name: { type: String },
    description: { type: String },
    imageUrl: { 
      type: String, 
      default: "https://media-cdn.tripadvisor.com/media/photo-s/13/d8/ea/1b/a-room-at-the-beach.jpg "},
    owner: { type: Schema.Types.ObjectId, ref: "User" },
    reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }] // we will update this field a bit later when we create review model
  });

  const Room  = model("Room", roomSchema);

module.exports = Room;