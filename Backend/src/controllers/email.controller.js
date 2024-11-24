const Email = require("../models/email.model");
const User = require("../models/user.model");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail", 
  auth: {
    user: process.env.NODEMAILER_EMAIL, 
    pass: process.env.NODEMAILER_PASS, 
  },
});

const createEmail = async (req, res) => {
  try {
    const { message, subject, media, sender, receiver } = req.body;

    if (!message || !subject || !sender || !receiver) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const isSender = await User.findOne({ email: sender });
    if (!isSender) {
      return res.status(404).json({ message: "Sender doesn't exist" });
    }

    let isReceiver = await User.findOne({ email: receiver });
    if (!isReceiver) {
      const info = await transporter.sendMail({
        from: process.env.NODEMAILER_EMAIL, // Sender's email
        to: receiver, // Recipient's email
        subject: "Message Notification - FlyMail",
        html: `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>FlyMail Notification</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                background-color: #f9f9f9;
                padding: 20px;
              }
              .email-container {
                max-width: 600px;
                margin: 0 auto;
                background: #ffffff;
                border: 1px solid #ddd;
                border-radius: 8px;
                overflow: hidden;
              }
              .email-header {
                background-color: #007bff;
                color: #ffffff;
                text-align: center;
                padding: 10px 20px;
              }
              .email-header h1 {
                margin: 0;
                font-size: 24px;
              }
              .email-body {
                padding: 20px;
              }
              .email-body p {
                margin: 0 0 15px;
              }
              .register-link {
                display: inline-block;
                margin-top: 15px;
                padding: 10px 15px;
                background-color: #007bff;
                color: #ffffff;
                text-decoration: none;
                border-radius: 5px;
              }
              .register-link:hover {
                background-color: #0056b3;
              }
              .email-footer {
                text-align: center;
                font-size: 12px;
                color: #777;
                padding: 10px 20px;
                border-top: 1px solid #ddd;
                background-color: #f4f4f4;
              }
            </style>
          </head>
          <body>
            <div class="email-container">
              <div class="email-header">
                <h1>FlyMail Notification</h1>
              </div>
              <div class="email-body">
                <p>Dear User,</p>
                <p>
                  Someone has tried to send you a message via FlyMail. However, it seems that you are not currently registered on our platform.
                </p>
                <p>
                  If you wish to receive messages and stay connected, please consider creating an account with us by clicking the link below:
                </p>
                <p>
                  Use Only this email for registration:  ${receiver}
                </p>
                <p>
                  <a href="http://localhost:3000/" class="register-link">Register Now</a>
                </p>
                <p>
                  Thank you for your attention.
                </p>
                <p>Best Regards,</p>
                <p><strong>The FlyMail Team</strong></p>
              </div>
              <div class="email-footer">
                <p>&copy; 2024 FlyMail. All rights reserved.</p>
              </div>
            </div>
          </body>
          </html>
        `,
        dsn: {
          id: "unique_id", 
          return: "headers", 
          notify: ["failure", "delay"], 
          recipient: process.env.NODEMAILER_EMAIL, 
        },
      
      });
    //  console.log(info);
     
      if (info.rejected.length === 0) {
        isReceiver = await User.create({email:receiver})
        if(!isReceiver){
          return res.status(400).json({
            message: "Error while, receiver is created",
          });
        }
            
      } else {
        return res.status(500).json({
          message: "use only google authrized email.",
          info,
        });
      }
    }

    const email = new Email({
      message,
      subject,
      media,
      sender: isSender._id,
      receiver: isReceiver._id,
    });

    // Save the email to the database
    const savedEmail = await email.save();

    // Respond with success
    res.status(201).json({
      message: "Email created successfully",
      email: savedEmail,
    });
  } catch (error) {
    console.error("Error creating email:", error);
    res.status(500).json({ message: "Failed to create email" });
  }
};

const getAllEmails = async (req, res) => {
  try {
    const { user } = req.body;
    // console.log(req.body);

    const isUserExist = await User.findOne({ email: user });
    if (!isUserExist)
      return res.status(400).json({ message: "User doesn't exist" });

    const emails = await Email.find({
      $or: [{ sender: isUserExist._id }, { receiver: isUserExist._id }],
    })
      .sort({ createdAt: -1 })
      .populate("sender", "name email")
      .populate("receiver", "name email");

    res.status(200).json({ message: "Emails retrieved successfully", emails });
  } catch (error) {
    console.error("Error retrieving emails:", error);
    res.status(500).json({ message: "Failed to retrieve emails" });
  }
};

const getEmailById = async (req, res) => {
  try {
    const { id } = req.params;

    const email = await Email.findById(id)
      .populate("sender", "name email")
      .populate("receiver", "name email");

    if (!email) {
      return res.status(404).json({ message: "Email not found" });
    }

    res.status(200).json({ message: "Email retrieved successfully", email });
  } catch (error) {
    console.error("Error retrieving email:", error);
    res.status(500).json({ message: "Failed to retrieve email" });
  }
};

const updateEmailById = async (req, res) => {
  try {
    const { id } = req.params;
    const { message, subject, media, sender, receiver } = req.body;

    const updatedEmail = await Email.findByIdAndUpdate(
      id,
      { message, subject, media, sender, receiver },
      { new: true, runValidators: true }
    );

    if (!updatedEmail) {
      return res.status(404).json({ message: "Email not found" });
    }

    res
      .status(200)
      .json({ message: "Email updated successfully", email: updatedEmail });
  } catch (error) {
    console.error("Error updating email:", error);
    res.status(500).json({ message: "Failed to update email" });
  }
};

const deleteEmailById = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedEmail = await Email.findByIdAndDelete(id);

    if (!deletedEmail) {
      return res.status(404).json({ message: "Email not found" });
    }

    res
      .status(200)
      .json({ message: "Email deleted successfully", email: deletedEmail });
  } catch (error) {
    console.error("Error deleting email:", error);
    res.status(500).json({ message: "Failed to delete email" });
  }
};

module.exports = {
  createEmail,
  getAllEmails,
  getEmailById,
  updateEmailById,
  deleteEmailById,
};
