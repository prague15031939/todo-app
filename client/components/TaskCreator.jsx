import React, { Component } from 'react'
import equal from 'fast-deep-equal'
import moment from 'moment'
import EditorFileList from "./EditorFileList.jsx"

class TaskCreator extends Component {

    constructor (props) {
        super(props);

        this.state = {
            editingTaskId: null,
            taskName: "",
            taskStatus: "not started",
            startDate: new Date(),
            stopDate: new Date(),
            files: [],
            editingFiles: []
        }

        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleStatusChange = this.handleStatusChange.bind(this);
        this.handleStartDateChange = this.handleStartDateChange.bind(this);
        this.handleStopDateChange = this.handleStopDateChange.bind(this);
        this.handleFilesChange = this.handleFilesChange.bind(this);
        this.handleCreateTask = this.handleCreateTask.bind(this);
        this.handleFileDelete = this.handleFileDelete.bind(this);
    }

    componentDidUpdate(prevProps) {
        if (!equal(this.props.editingTask, prevProps.editingTask)) {
            if (this.props.editingTask) {
               this.setState({ 
                    editingTaskId: this.props.editingTask._id,
                    taskName: this.props.editingTask.name, 
                    taskStatus: this.props.editingTask.status, 
                    startDate: moment(this.props.editingTask.start).format("yyyy-MM-DDTHH:mm"), 
                    stopDate: moment(this.props.editingTask.stop).format("yyyy-MM-DDTHH:mm"),
                    files: [],
                    editingFiles: this.props.editingTask.files,
                });
            }
            else {
                this.setState({ 
                    editingTaskId: null,
                    taskName: "",
                    taskStatus: "not started",
                    startDate: new Date(),
                    stopDate: new Date(),
                    files: [],
                    editingFiles: []
                });
            }
        }
    }

    handleNameChange(event) {
        this.setState({ taskName: event.target.value });
    };

    handleStatusChange(event) {
        this.setState({ taskStatus: event.target.value });
    };

    handleStartDateChange(event) {
        this.setState({ startDate: event.target.value });
    };

    handleStopDateChange(event) {
        this.setState({ stopDate: event.target.value });
    };

    handleFilesChange(event) {
        this.setState({ files: event.target.files });
    }

    handleCreateTask(event) {
        event.preventDefault();

        if (this.state.editingTaskId) {
            this.props.onUpdateTask(
                this.state.editingTaskId,
                this.state.taskName, 
                this.state.taskStatus, 
                this.state.startDate, 
                this.state.stopDate, 
                this.state.files,
                this.state.editingFiles
            );
        }
        else {
            this.props.onCreateTask(
                this.state.taskName, 
                this.state.taskStatus, 
                this.state.startDate, 
                this.state.stopDate, 
                this.state.files
            );
        }

        this.setState({
            editingTaskId: null,
            taskName: "",
            taskStatus: "not started",
            startDate: new Date(),
            stopDate: new Date(),
            files: [],
            editingFiles: []
        });
    }

    handleFileDelete(file) {
        this.setState({ editingFiles: this.state.editingFiles.filter(item => item !== file) });
    }

    render() {
        return (
            <form id="taskForm" name="taskForm" autoComplete="off">
                <h2>{this.state.editingTaskId ? "Edit task" : "New task"}</h2>
                <input type="hidden" name="id" value="0" />
                <div className="form-group">
                    <label htmlFor="name">name:</label>
                    <input className="form-control" value={this.state.taskName} onChange={this.handleNameChange}/>
                </div>
                <div className="form-group">
                    <label htmlFor="status">status:</label>
                    <select className="form-control" value={this.state.taskStatus} onChange={this.handleStatusChange}>
                        <option value="not started">not started</option>
                        <option value="in progress">in progress</option>
                        <option value="completed">completed</option>
                    </select>
                </div>  
                <div className="form-group">
                    <label htmlFor="datetime-start">start date:</label>
                    <input id="datetime-start" className="form-control" type="datetime-local" value={this.state.startDate} onChange={this.handleStartDateChange}/>
                </div>
                <div className="form-group">
                    <label htmlFor="datetime-stop">stop date:</label>
                    <input id="datetime-stop" className="form-control" type="datetime-local" value={this.state.stopDate} onChange={this.handleStopDateChange}/>
                </div>
                <div className="form-group">
                    <label htmlFor="filedata">upload files:</label>
                    <input name="filedata" type="file" multiple onChange={this.handleFilesChange}/>
                </div>
                <EditorFileList editingTaskId={this.state.editingTaskId} files={this.state.editingFiles} onFileDelete={this.handleFileDelete} />
                <div id="buttonPanel">
                    <button type="submit" className="btn btn-sm btn-primary" onClick={this.handleCreateTask}>save</button>
                    <a id="filter" className="btn btn-sm btn-primary" onClick={this.props.onFilter.bind(null, this.state.taskStatus)}>filter by status</a>
                    <a id="getall" className="btn btn-sm btn-primary" onClick={this.props.onGetAll}>get all</a>
                </div>    
            </form>
        )
    }
}

export default TaskCreator;