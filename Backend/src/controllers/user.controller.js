const User = require("../models/user.model");

const createOrLogin = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      const newUser = await User.create({ name, email });

      if (!newUser) {
        return res
          .status(500)
          .json({ message: "An error occurred while creating the user." });
      }

      return res
        .status(201)
        .json({ message: "User created successfully.", user: newUser });
    } else {
      // Update user details if fields are missing
      if (!existingUser.name ) {
        const updatedUser = await User.findByIdAndUpdate(
          existingUser._id,
          { $set: { name} },
          { new: true } // Return the updated document
        );

        return res.status(200).json({
          message: "User details updated successfully.",
          user: updatedUser,
        });
      }
    }

    // If user exists and all details are present
    res.status(200).json({
      message: "User already exists.",
      user: existingUser,
    });
  } catch (error) {
    console.error("Error in createOrLogin:", error);
    res
      .status(500)
      .json({ message: "An error occurred during the operation." });
  }
};

module.exports = { createOrLogin };
