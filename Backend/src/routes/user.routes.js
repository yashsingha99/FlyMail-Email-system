const {Router} = require('express')
const router = Router();
const {createOrLogin} = require("../controllers/user.controller")

router.post("/createOrLogin", createOrLogin);

module.exports = router
