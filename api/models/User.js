const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
// var ValidationError = mongoose.Error.ValidationError;

const userSchema = new Schema({
  username: {
      type: String, 
      required: [true, "Please provide a username"],
      validate: {
          validator: function(username) {
            return this.model("user").findOne({username})
                      .then((user)=> {
                          if(user) throw new Error("An user with this name already exists.");
                          else return;
                      })
          },
          message: "An user with this name already exists."
      }
  },
  email: {
      type: String,
      required: [true, "Please provide an email address."],
      match: [/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'E-Mail adress invalid.'],
      validate: {
          validator: function(email) {
            return this.model("user").findOne({email: email})
                      .then((user)=> {
                          if(user) throw new Error("An user with this email address already exists.");
                          else return;
                      })
          },
          message: "An user with this email address already exists."
      }
  },
  password: {
      type: String,
      match: [/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, "A password should have at least eight characters, one letter and one number"],
      required: true
  },
})

userSchema.pre('save', function(next) {
    var user = this;
    bcrypt.hash(user.password, 10, function(err, hash) {
        if(err) throw new Error("Encryption error");
        else {
            user.password = hash;
            next();
        }
    });
});

userSchema.methods.comparePasswords = function(candidatePassword) {
    var user = this;
    return new Promise(function(resolve, reject){
        bcrypt.compare(candidatePassword, user.password, function(err, isMatch) {
            if (err) return reject(err);
            return resolve(isMatch);
        });
    })
};

module.exports = mongoose.model("user", userSchema, "users");
