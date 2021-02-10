const apiPrefix = "http://localhost:3000";

export default {
    async GetTasks() {
        const response = await fetch(`${apiPrefix}/api/tasks/all`, {
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        });
        if (response.ok === true) {
            return await response.json();
        } 
    },

    async GetTasksByFilter(statusFilter) {
        const response = await fetch(`${apiPrefix}/api/tasks/all?status=${statusFilter}`, {
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        });
        if (response.ok === true) {
            return await response.json();
        }
    },

    async UploadTaskFiles(response, selectedFiles) {
        if (response.ok === true) {
            const task = await response.json();

            if (selectedFiles.length) {
                const formData = new FormData();
                for (let i = 0; i < selectedFiles.length; i++)
                    formData.append("filedata", selectedFiles[i]);
                formData.append("taskId", task._id);
                const responseUpload = await fetch(`${apiPrefix}/api/tasks/upload`, {
                    method: "POST",
                    body: formData,
                });
    
                if (responseUpload.ok === true) {
                    return await responseUpload.json();
                }
            }
            else {
                return task;
            }
        }
    },

    async CreateTask(taskName, taskStatus, startDate, stopDate, selectedFiles) {
        const response = await fetch(`${apiPrefix}/api/tasks/add`, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: taskName,
                status: taskStatus,
                start: (new Date(startDate) < Date.now() ? Date.now() : startDate),
                stop: stopDate
            })
        });
    
        return await this.UploadTaskFiles(response, selectedFiles);
    },

    async UpdateTask(taskId, taskName, taskStatus, startDate, stopDate, selectedFiles, editedFiles) {
        const response = await fetch(`${apiPrefix}/api/tasks/update`, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: taskId,
                name: taskName,
                status: taskStatus,
                start: startDate,
                stop: stopDate,
                savedFiles: editedFiles
            })
        });

        return await this.UploadTaskFiles(response, selectedFiles);
    },

    async DeleteTask(id) {
        const response = await fetch(`${apiPrefix}/api/tasks/delete/${id}`, {
            method: "DELETE",
            headers: {
                "Accept": "application/json"
            }
        });
        if (response.ok === true) {
            return await response.json();
        }
    }
}