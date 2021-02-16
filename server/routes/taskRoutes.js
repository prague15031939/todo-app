const router = require("express").Router();
const multer = require("multer");
const taskController = require("../controllers/taskController")
const auth = require("../middlewares/authMiddleware");
const extracter = taskController.extractFilenames;
const path = require("path");

router.get("/tasks", (req, res) => {
    res.sendFile("index.html", {root: path.join(global.appRoot, "../public/build")});
});

router.post("/api/tasks/add", auth, async (req, res) => {
    const saved = await taskController.add(req.body);
    if (saved)
        res.status(200).send(extracter(saved));
    else
        res.status(400).send("an error occured");
});

router.post("/api/tasks/update", auth, async (req, res) => {
    const saved = await taskController.update(req.body);
    if (saved)
        res.status(200).send(extracter(saved));
    else
        res.status(400).send("an error occured");
});

router.get("/api/tasks/all", auth, async (req, res) => {
    if (req.query.status) {
        const saved = await taskController.getByStatus(req.query.status);
        if (saved)
            res.status(200).send(extracter(saved));
        else
            res.status(400).send("an error occured");
    }
    else {
        const saved = await taskController.getAll();
        if (saved)
            res.status(200).send(extracter(saved));
        else
            res.status(400).send("an error occured");
    }
});

router.delete("/api/tasks/delete/:id", auth, async (req, res) => {
    const id = req.params.id;
    const saved = await taskController.deleteById(id);
    if (saved)
        res.status(200).send(extracter(saved));
    else
        res.status(400).send("an error occured");
});

const storageConfig = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(global.appRoot, "../uploads"));
    },
    filename: (req, file, cb) => {
        const uniquePrefix = Date.now() + "-" + Math.round(Math.random() * 1E9);
        cb(null, uniquePrefix + "." + file.originalname.split('.').pop());
    }
});

var upload = multer({storage: storageConfig});
router.post('/api/tasks/upload', auth, upload.array('filedata', 20), async (req, res) => {
    const saved = await taskController.addFiles(req.body.taskId, req.files);
    if (saved)
        res.status(200).send(extracter(saved));
    else
        res.status(400).send("an error occured");
});

router.get('/api/tasks/download/:id/:file', async (req, res) => {
    const task = await taskController.getById(req.params.id);
    const fileName = req.params.file;
    const file = task.files.find(item => item.includes(fileName));
    if (file)
        res.download(file);
    else
        res.status(400).send("an error occured");
});

module.exports = router;