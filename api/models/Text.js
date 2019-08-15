const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const textSchema = new Schema({
  name: {
    type: String,
    required: [true, "Name your text"]
  },
  content : {
    type: String
  },
  tags: {
    type: Array
  },
  language: {
    type: String
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: "User"
  }
})

module.exports = mongoose.model("text", textSchema, "text_collection");

