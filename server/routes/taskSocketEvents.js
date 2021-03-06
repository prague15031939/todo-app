const taskController = require("../controllers/taskController")
const auth = require("../middlewares/authMiddleware");
const extracter = taskController.extractFilenames;

exports.RegisterSocketEvents = function(socket) {
    var id = (socket.id).toString();

    socket.on("all", async function (callback) {
        const valid = auth.verifyToken(socket);
        if (valid.error) {
            callback({status: valid.status, text: valid.error}); 
            return;
        }

        const saved = await taskController.getAll(valid.id);
        if (saved)
            callback({status: 200, result: extracter(saved)});
        else
            callback({status: 400, text: 'an error occured'});
    });

    socket.on("filter", async function (status, callback) {
        const valid = auth.verifyToken(socket);
        if (valid.error) {
            callback({status: valid.status, text: valid.error}); 
            return;
        }

        const saved = await taskController.getByStatus(status, valid.id);
        if (saved)
            callback({status: 200, result: extracter(saved)});
        else
            callback({status: 400, text: 'an error occured'});
    });

    socket.on("add", async function (body, callback) {
        const valid = auth.verifyToken(socket);
        if (valid.error) {
            callback({status: valid.status, text: valid.error}); 
            return;
        }

        const saved = await taskController.add(body, valid.id);
        if (saved) 
            callback({status: 200, result: extracter(saved)});
        else 
            callback({status: 400, text: 'an error occured'});
    });

    socket.on("update", async function (taskId, body, callback) {
        const valid = auth.verifyToken(socket);
        if (valid.error) {
            callback({status: valid.status, text: valid.error}); 
            return;
        }

        const saved = await taskController.update(taskId, body, valid.id);
        if (saved) 
            callback({status: 200, result: extracter(saved)});
        else 
            callback({status: 400, text: 'an error occured'});
    });

    socket.on("delete", async function (taskId, callback) {
        const valid = auth.verifyToken(socket);
        if (valid.error) {
            callback({status: valid.status, text: valid.error}); 
            return;
        }

        const saved = await taskController.deleteById(taskId, valid.id);
        if (saved) 
            callback({status: 200, result: extracter(saved)});
        else 
            callback({status: 400, text: 'an error occured'});
    });
}
