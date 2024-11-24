const { Router } = require("express");
const {
  createEmail,
  getAllEmails,
  getEmailById,
  updateEmailById,
  deleteEmailById,
} = require("../controllers/email.controller");

const router = Router();

router.post("/createEmail", createEmail);

router.post("/getAllEmails", getAllEmails);

router.get("/:id", getEmailById);

router.put("/:id", updateEmailById);

router.delete("/:id", deleteEmailById);

module.exports = router;
