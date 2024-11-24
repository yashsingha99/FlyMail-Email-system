const mongoose = require("mongoose");

const userSchema =  mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      require: true,
      unique: true,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
