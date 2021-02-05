async function GetTasks() {
    const response = await fetch("/api/all", {
        method: "GET",
        headers: {
            "Accept": "application/json"
        }
    });
    if (response.ok === true) {
        const tasks = await response.json();
        resetTaskTable();
        let rows = document.querySelector("tbody");
        tasks.forEach(task => {
            rows.append(row(task));
        });
    }
}

async function GetTasksByFilter(statusFilter) {
    const response = await fetch("/api/all?status=" + statusFilter, {
        method: "GET",
        headers: {
            "Accept": "application/json"
        }
    });
    if (response.ok === true) {
        const tasks = await response.json();
        let rows = document.querySelector("tbody");
        tasks.forEach(task => {
            rows.append(row(task));
        });
    }
}

async function CreateTask(taskName, taskStatus, startDate, stopDate, selectedFiles) {
    const response = await fetch("/api/add", {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: taskName,
            status: taskStatus,
            start: (new Date(startDate) > Date.now() ? startDate : Date.now()),
            stop: stopDate
        })
    });

    if (response.ok === true) {
        const task = await response.json();

        if (selectedFiles.length) {
            const formData = new FormData();
            for (let i = 0; i < selectedFiles.length; i++)
                formData.append("filedata", selectedFiles[i]);
            formData.append("taskId", task._id);
            const responseUpload = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            if (responseUpload.ok === true) {
                const taskWithFiles = await responseUpload.json();
                reset();
                document.querySelector("tbody").append(row(taskWithFiles));
            }
        }
        else {
            reset();
            document.querySelector("tbody").append(row(task));
        }
    }
}

async function DeleteTask(id) {
    const response = await fetch("/api/delete/" + id, {
        method: "DELETE",
        headers: {
            "Accept": "application/json"
        }
    });
    if (response.ok === true) {
        const task = await response.json();
        document.querySelector("tr[data-rowid='" + task._id + "']").remove();
    }
}

function reset() {
    const form = document.forms["taskForm"];
    form.reset();
    form.elements["id"].value = 0;
}

function resetTaskTable() {
    var oldTbody = document.querySelector("tbody");
    var newTbody = document.createElement('tbody');
    oldTbody.parentNode.replaceChild(newTbody, oldTbody);
}

function row(task) {

    const tr = document.createElement("tr");
    tr.setAttribute("data-rowid", task._id);

    const nameTd = document.createElement("td");
    nameTd.append(task.name);
    tr.append(nameTd);

    const statusTd = document.createElement("td");
    statusTd.append(task.status);
    tr.append(statusTd);

    var datetimeOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
    };
    const startTd = document.createElement("td");
    startTd.append(new Date(task.start).toLocaleDateString("en-US", datetimeOptions));
    tr.append(startTd);

    const stopTd = document.createElement("td");
    stopTd.append(new Date(task.stop).toLocaleDateString("en-US", datetimeOptions));
    tr.append(stopTd);

    const filesTd = document.createElement("td");
    if (task.files.length)
        task.files.forEach(file => {
            let div = document.createElement("div");
            let fileLink = document.createElement("a");
            fileLink.href = "/api/download/" + task._id + "/" + file;
            fileLink.download = file;
            fileLink.append(file);
            div.append(fileLink);
            filesTd.appendChild(div);
        });
    tr.append(filesTd);

    const linksTd = document.createElement("td");
    const removeLink = document.createElement("a");
    removeLink.setAttribute("data-id", task._id);
    removeLink.setAttribute("style", "cursor:pointer;padding:15px;");
    removeLink.append("delete");
    removeLink.addEventListener("click", e => {
        e.preventDefault();
        DeleteTask(task._id);
    });
    linksTd.append(removeLink);
    tr.appendChild(linksTd);

    return tr;
}

document.forms["taskForm"].addEventListener("submit", e => {
    e.preventDefault();
    const form = document.forms["taskForm"];
    const id = form.elements["id"].value;
    const name = form.elements["name"].value;
    const status = form.elements["status"].value;
    const start = form.elements["datetime-start"].value;
    const stop = form.elements["datetime-stop"].value;
    const selectedFiles = [...form.elements["filedata"].files];
    if (id == 0 && name && stop)
        CreateTask(name, status, start, stop, selectedFiles);
});

document.getElementById("filter").addEventListener("click", e => {
    e.preventDefault();
    const form = document.forms["taskForm"];
    const status = form.elements["status"].value;
    if (status) {
        resetTaskTable();
        GetTasksByFilter(status);
    }
});

document.getElementById("getall").addEventListener("click", e => {
    e.preventDefault();
    GetTasks();
});

GetTasks();