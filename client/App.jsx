import React, { Component } from 'react';
import TaskApi from "./TaskApi";
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
   }

   async componentDidMount() {
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

   render(){
      return(
         <div>
            <TaskCreator onCreateTask={this.handleCreateTask}/>   
            <TaskTable tasks={this.state.tasks} onDeleteTask={this.handleDeleteTask}/>
         </div>
      );
   }
}

export default App;