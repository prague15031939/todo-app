const router = require("express").Router();
const userController = require("../controllers/userController");

router.get("/api/user/login", async (req, res) => {
    const valid = await userController.singIn(req.body.email, req.body.password);
    if (valid) {
        res.cookie("auth-token", valid.token, { httpOnly: true, maxAge: 110000 }).send();
    }
    else {
        res.status(401).send("incorrect email or password");
    }
});

module.exports = router;