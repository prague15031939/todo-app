import React, { Component } from 'react';
import TaskApi from "../api/TaskApi";
import TaskTable from "./TaskTable.jsx";
import TaskCreator from "./TaskCreator.jsx";

class App extends Component {

   constructor(props) {
      super(props);

      this.state = {
         tasks: []
      }
      this.handleDeleteTask = this.handleDeleteTask.bind(this);
      this.handleCreateTask = this.handleCreateTask.bind(this);
      this.handleFilterByStatus = this.handleFilterByStatus.bind(this);
      this.handleGetAll = this.handleGetAll.bind(this);
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

   async handleDeleteTask(id) {
      await TaskApi.DeleteTask(id);
      this.setState({ tasks: await TaskApi.GetTasks() });
   }

   async handleFilterByStatus(status) {
      const filteredTasks = await TaskApi.GetTasksByFilter(status);
      this.setState({ tasks: filteredTasks });
   }

   render(){
      return(
         <div>
            <TaskCreator onCreateTask={this.handleCreateTask} onFilter={this.handleFilterByStatus} onGetAll={this.handleGetAll}/>   
            <TaskTable tasks={this.state.tasks} onDeleteTask={this.handleDeleteTask}/>
         </div>
      );
   }
}

export default App;