import React, { Component } from 'react';
import TaskApi from "../api/TaskApi";
import TaskTable from "./TaskTable.jsx";
import TaskCreator from "./TaskCreator.jsx";

class App extends Component {

   constructor(props) {
      super(props);

      this.state = {
         tasks: [],
         editingTaskId: null,
      }
      this.handleDeleteTask = this.handleDeleteTask.bind(this);
      this.handleCreateTask = this.handleCreateTask.bind(this);
      this.handleFilterByStatus = this.handleFilterByStatus.bind(this);
      this.handleGetAll = this.handleGetAll.bind(this);
      this.handleEditTask = this.handleEditTask.bind(this);
      this.handleUpdateTask = this.handleUpdateTask.bind(this);
   }

   async componentDidMount() {
      this.setState({ tasks: await TaskApi.GetTasks() });
   }

   async handleGetAll() {
      this.setState({ tasks: await TaskApi.GetTasks() });
   }

   async handleCreateTask(taskName, taskStatus, startDate, stopDate, selectedFiles) {
      await TaskApi.CreateTask(taskName, taskStatus, startDate, stopDate, selectedFiles);
      this.setState({ tasks: await TaskApi.GetTasks() });
   }

   async handleUpdateTask(id, taskName, taskStatus, startDate, stopDate, selectedFiles) {
      await TaskApi.UpdateTask(id, taskName, taskStatus, startDate, stopDate, selectedFiles);
      this.setState({ editingTaskId: null });
      this.setState({ tasks: await TaskApi.GetTasks() });
   }

   async handleDeleteTask(id) {
      await TaskApi.DeleteTask(id);
      this.setState({ tasks: await TaskApi.GetTasks() });
   }

   async handleFilterByStatus(status) {
      const filteredTasks = await TaskApi.GetTasksByFilter(status);
      this.setState({ tasks: filteredTasks });
   }

   async handleEditTask(id) {
      if (this.state.editingTaskId == id) {
         this.setState({ editingTaskId: null }); 
      }
      else {
         this.setState({ editingTaskId: id });
      }
   }

   render(){
      return(
         <div>
            <TaskCreator 
               editingTask={this.state.editingTaskId ? this.state.tasks.find(item => item._id == this.state.editingTaskId) : null}
               onUpdateTask={this.handleUpdateTask}
               onCreateTask={this.handleCreateTask} 
               onFilter={this.handleFilterByStatus} 
               onGetAll={this.handleGetAll}
            />   
            <TaskTable 
               editingTaskId={this.state.editingTaskId}
               tasks={this.state.tasks} 
               onDeleteTask={this.handleDeleteTask} 
               onEditTask={this.handleEditTask}
            />
         </div>
      );
   }
}

export default App;