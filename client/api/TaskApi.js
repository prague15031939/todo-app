const apiPrefix = "http://localhost:3000";

async function dispatchResponse(response) {
    if (response.ok === true) {
        return await response.json();
    } 
    else {
        return {
            status: response.status,
            text: await response.text(),
        };
    }
}

export default {

    async GetTasks() {
        const query = `
            query getAllTasks($userId: String!) {
                all(userId: $userId) {
                _id
                name
                status
                start
                stop
                files
                }
            }`;
        const response = await fetch(`${apiPrefix}/graphql`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            body: JSON.stringify({
              query,
              variables: { userId: "602afbd61c7e5e4758898329" },
            })
        });

        const decoded = await response.json();
        decoded.data.all.forEach(item => { 
            item.start = new Date(parseInt(item.start));
            item.stop = new Date(parseInt(item.stop));
        });
        return decoded.data.all;
    },

    async GetTasksByFilter(statusFilter) {
        const query = `
            query getFilteredTasks($userId: String!, $status: String!) {
                filter(userId: $userId, status: $status) {
                _id
                name
                status
                start
                stop
                files
                }
            }
        `;
        const response = await fetch(`${apiPrefix}/graphql`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            body: JSON.stringify({
              query,
              variables: { userId: "602afbd61c7e5e4758898329", status: statusFilter },
            })
        });

        const decoded = await response.json();
        decoded.data.filter.forEach(item => { 
            item.start = new Date(parseInt(item.start));
            item.stop = new Date(parseInt(item.stop));
        });
        return decoded.data.filter;
    },

    async UploadTaskFiles(response, selectedFiles) {
        if (response.ok === true) {
            const task = await response.json();

            if (selectedFiles.length) {
                const formData = new FormData();
                for (let i = 0; i < selectedFiles.length; i++)
                    formData.append("filedata", selectedFiles[i]);
                const responseUpload = await fetch(`${apiPrefix}/api/tasks/upload/${task._id}`, {
                    method: "POST",
                    body: formData,
                });
    
                return dispatchResponse(responseUpload);
            }
            else {
                return task;
            }
        }
        else {
            return {
                status: response.status,
                msg: await response.text(),
            };
        }
    },

    async CreateTask(taskName, taskStatus, startDate, stopDate, selectedFiles) {
        const query = `
            mutation addTask($userId: String!, $name: String!, $status: String!, $start: String, $stop: String!) {
                add(userId: $userId, name: $name, status: $status, start: $start, stop: $stop) {
                    _id    
                }  
            }
        `;
        const response = await fetch(`${apiPrefix}/graphql`, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                query,
                variables: { 
                    userId: "602afbd61c7e5e4758898329",
                    name: taskName,
                    status: taskStatus,
                    start: (new Date(startDate) < Date.now() ? Date.now() : startDate).toString(),
                    stop: stopDate.toString()
                },
            })
        });
    
        console.log(await response.json());
        //return await this.UploadTaskFiles(response, selectedFiles);
    },

    async UpdateTask(taskId, taskName, taskStatus, startDate, stopDate, selectedFiles, editedFiles) {
        const query = `
            mutation updateTask($userId: String!, $taskId: String!, $name: String!, $status: String!, $start: String!, $stop: String!, $savedFiles: [String]) {
                update(userId: $userId, taskId: $taskId, name: $name, status: $status, start: $start, stop: $stop, savedFiles: $savedFiles) {
                    _id    
                }
            }
        `;
        const response = await fetch(`${apiPrefix}/graphql`, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                query, 
                variables: {
                    userId: "602afbd61c7e5e4758898329",
                    taskId: taskId,
                    name: taskName,
                    status: taskStatus,
                    start: startDate.toString(),
                    stop: stopDate.toString(),
                    savedFiles: editedFiles
                }
            })
        });

        console.log(await response.json());
        //return await this.UploadTaskFiles(response, selectedFiles);
    },

    async DeleteTask(taskId) {
        const query = `
            mutation deleteTask($userId: String!, $taskId: String!) {
                delete(userId: $userId, taskId: $taskId) {
                    _id
                }
            }
        `;
        const response = await fetch(`${apiPrefix}/graphql`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            body: JSON.stringify({
                query,
                variables: { userId: "602afbd61c7e5e4758898329", taskId: taskId },
            })
        });

        console.log(await response.json());
    }
}