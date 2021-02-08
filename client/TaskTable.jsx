import React, { Component } from 'react';
import FileList from "./FileList.jsx";

class TaskTable extends Component {

    constructor(props) {
        super(props);
    }

    render() {

        var datetimeOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric'
        };

        return (
            <table id="taskTable" className="table table-condensed table-striped table-bordered">
                <thead><tr><th>name</th><th>status</th><th>start date</th><th>stop date</th><th>files</th></tr></thead>
                <tbody>
                    {
                        this.props.tasks.map(task =>
                            <tr key={task._id}>
                                <td>{task.name}</td>
                                <td>{task.status}</td>
                                <td>{new Date(task.start).toLocaleDateString("en-US", datetimeOptions)}</td>
                                <td>{new Date(task.stop).toLocaleDateString("en-US", datetimeOptions)}</td>
                                <td><FileList files={task.files} taskId={task._id}/></td>
                                <td><a id="removeLink" onClick={this.props.onDeleteTask.bind(null, task._id)}>delete</a></td>
                            </tr>    
                        )
                    }
                </tbody>
            </table>
        )
    }
}

export default TaskTable;