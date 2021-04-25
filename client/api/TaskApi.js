const apiPrefix = "http://localhost:3000";

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

    async UploadTaskFiles(selectedFiles, taskId) {
        if (selectedFiles.length) {
            const query = `
                mutation uploadTaskFiles($files: [Upload!]!, $taskId: String!) {
                    uploadFiles(files: $files, taskId: $taskId)  
                }
            `;
            let formData = new FormData();
            formData.append("operations", 
                JSON.stringify({
                    query,
                    variables: { 
                        files: selectedFiles,
                        taskId: taskId
                    },
                })
            );

            let mapObject = {};
            for (let i = 0; i < selectedFiles.length; i++)
                mapObject[i.toString()] = [`variables.files.${i}`];
            formData.append("map", JSON.stringify(mapObject));
            for (let i = 0; i < selectedFiles.length; i++)
                formData.append(i.toString(), selectedFiles[i], selectedFiles[i].name);

            await fetch(`${apiPrefix}/graphql`, {
                method: "POST",
                body: formData,
            });    
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
    
        const decoded = await response.json();
        if (decoded.data.add != null) {
            await this.UploadTaskFiles(selectedFiles, decoded.data.add._id);
        }
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

        const decoded = await response.json();
        if (decoded.data.update != null) {
            await this.UploadTaskFiles(selectedFiles, decoded.data.update._id);
        }
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
    }
}