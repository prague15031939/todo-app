import React, { Component } from 'react';
import FileList from "./FileList.jsx";
import equal from 'fast-deep-equal'

class TaskTable extends Component {

    constructor(props) {
        super(props);

        this.state = {
            editingTaskId: null,
        }
    }

    componentDidUpdate(prevProps) {
        if (!equal(this.props.editingTaskId, prevProps.editingTaskId))
            this.setState({ editingTaskId: this.props.editingTaskId });
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
                            <tr key={task._id} style={task._id === this.state.editingTaskId ? {backgroundColor: "#98e698"} : {}}>
                                <td>{task.name}</td>
                                <td>{task.status}</td>
                                <td>{new Date(task.start).toLocaleDateString("en-US", datetimeOptions)}</td>
                                <td>{new Date(task.stop).toLocaleDateString("en-US", datetimeOptions)}</td>
                                <td><FileList files={task.files} taskId={task._id}/></td>
                                <td>
                                    <div><a id="removeLink" onClick={this.props.onDeleteTask.bind(null, task._id)}>delete</a></div>
                                    <div><a id="editLink" onClick={this.props.onEditTask.bind(null, task._id)}>edit</a></div>
                                </td>
                            </tr>    
                        )
                    }
                </tbody>
            </table>
        )
    }
}

export default TaskTable;