const taskController = require("../controllers/taskController")
//const auth = require("../middlewares/authMiddleware");
const extracter = taskController.extractFilenames;

exports.RegisterSocketEvents = function(socket) {
    var id = (socket.id).toString();

    socket.on("all", async function (callback) {
        const saved = await taskController.getAll(null);//req.currentUser.id);
        if (saved)
            callback({status: 200, result: extracter(saved)});
        else
            callback({status: 400, text: 'an error occured'});
    });

    socket.on("filter", async function (status, callback) {
        const saved = await taskController.getByStatus(status, null);//req.currentUser.id);
        if (saved)
            callback({status: 200, result: extracter(saved)});
        else
            callback({status: 400, text: 'an error occured'});
    });

    socket.on("add", async function (body, callback) {
        const saved = await taskController.add(body, null);
        if (saved) 
            callback({status: 200, result: extracter(saved)});
        else 
            callback({status: 400, text: 'an error occured'});
    });

    socket.on("update", async function (taskId, body, callback) {
        const saved = await taskController.update(taskId, body, null);//req.currentUser.id);
        if (saved) 
            callback({status: 200, result: extracter(saved)});
        else 
            callback({status: 400, text: 'an error occured'});
    });

    socket.on("delete", async function (taskId, callback) {
        const saved = await taskController.deleteById(taskId, null);
        if (saved) 
            callback({status: 200, result: extracter(saved)});
        else 
            callback({status: 400, text: 'an error occured'});
    });

    socket.on("disconnect", (reason) => {
        var time = (new Date).toLocaleTimeString();
        console.log(`${id} disconnected at ${time}`);
    });
}
