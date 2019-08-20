const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;
const User = require("../models/User");

const textSchema = new Schema({
  text_name: {
    type: String,
    // required: [true, "Name your text"]
  },
  text_processed : {
    type: String,
    // required: [true, "Name your text"]
  },
  labels: {
    type: Array
  },
  languages: {
    type: Array
  },
  creator: {
    type: ObjectId,
    ref: "user"
  }
})

module.exports = mongoose.model("text", textSchema, "text_collection");

