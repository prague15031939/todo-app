const router = require("express").Router();

router.get("/tasks", async (req, res) => {
    const saved = "sho";
    if (saved)
        res.status(200).send(saved);
    else
        res.status(400).send("an error occured");
});

module.exports = router;