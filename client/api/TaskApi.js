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
            query getAllTasks {
                all {
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
                query
            })
        });

        const decoded = await response.json();
        if (decoded.data.all == null) return null;
        decoded.data.all.forEach(item => { 
            item.start = new Date(parseInt(item.start));
            item.stop = new Date(parseInt(item.stop));
        });
        return decoded.data.all;
    },

    async GetTasksByFilter(statusFilter) {
        const query = `
            query getFilteredTasks($status: String!) {
                filter(status: $status) {
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
                variables: { status: statusFilter },
            })
        });

        const decoded = await response.json();
        if (decoded.data.filter == null) return null;
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
            mutation addTask($name: String!, $status: String!, $start: String, $stop: String!) {
                add(name: $name, status: $status, start: $start, stop: $stop) {
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
            mutation updateTask($taskId: String!, $name: String!, $status: String!, $start: String!, $stop: String!, $savedFiles: [String]) {
                update(taskId: $taskId, name: $name, status: $status, start: $start, stop: $stop, savedFiles: $savedFiles) {
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
            mutation deleteTask($taskId: String!) {
                delete(taskId: $taskId) {
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
                variables: { taskId: taskId },
            })
        });

        console.log(await response.json());
    }
}