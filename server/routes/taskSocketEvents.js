const taskController = require("../controllers/taskController")
const auth = require("../middlewares/authMiddleware");
const siofu = require("socketio-file-upload");
const path = require("path");
const fs = require('fs');
const extracter = taskController.extractFilenames;

exports.RegisterSocketEvents = function(socket) {

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

    socket.on("download", async function(taskId, filename, callback) {
        const task = await taskController.getById(taskId);
        const file = task.files.find(item => item.includes(filename));

        fs.readFile(file, function(err, buf) {
            if (!err)
                callback({status: 200, result: buf});
            else 
                callback({status: 400, text: 'an error occured'});
        });
   });

   var fileUploader = new siofu();
   fileUploader.dir = path.join(global.appRoot, "../uploads");
   fileUploader.on("start", (event) => {
       const uniquePrefix = Date.now() + "-" + Math.round(Math.random() * 1E9);
       event.file.name = uniquePrefix + "." + event.file.name.split('.').pop();
   });
   fileUploader.on("saved", async (event) => {
       if (event.file.success) {
           await taskController.addFile(event.file.meta.taskId, event.file);
       }
   });
   fileUploader.listen(socket);

}
