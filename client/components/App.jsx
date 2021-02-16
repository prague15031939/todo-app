import React, { Component } from 'react';
import TaskApi from "../api/TaskApi";
import UserApi from "../api/UserApi";
import TaskTable from "./TaskTable.jsx";
import TaskCreator from "./TaskCreator.jsx";
import Login from "./Login.jsx";
import Header from "./Header.jsx";

class App extends Component {

   constructor(props) {
      super(props);

      this.state = {
         tasks: [],
         editingTaskId: null,
         authorized: true,
         currentUser: null
      }
      this.handleDeleteTask = this.handleDeleteTask.bind(this);
      this.handleCreateTask = this.handleCreateTask.bind(this);
      this.handleFilterByStatus = this.handleFilterByStatus.bind(this);
      this.handleGetAll = this.handleGetAll.bind(this);
      this.handleEditTask = this.handleEditTask.bind(this);
      this.handleUpdateTask = this.handleUpdateTask.bind(this);
      this.handleLoginUser = this.handleLoginUser.bind(this);
      this.refreshTasks = this.refreshTasks.bind(this);
   }

   async refreshTasks() {
      const res = await TaskApi.GetTasks();
      if (res.status && res.status === 401) {
         this.setState({ authorized: false, currentUser: null });
         console.log(res.status, res.text);
      }
      else {
         this.setState({ tasks: res });
         this.setState({ authorized: true, currentUser: await UserApi.GetCurrent() });
      }
   }

   async componentDidMount() {
      this.refreshTasks();
   }

   async handleGetAll() {
      this.refreshTasks();
   }

   async handleCreateTask(taskName, taskStatus, startDate, stopDate, selectedFiles) {
      await TaskApi.CreateTask(taskName, taskStatus, startDate, stopDate, selectedFiles);
      this.refreshTasks();
   }

   async handleUpdateTask(id, taskName, taskStatus, startDate, stopDate, selectedFiles, editedFiles) {
      await TaskApi.UpdateTask(id, taskName, taskStatus, startDate, stopDate, selectedFiles, editedFiles);
      this.setState({ editingTaskId: null });
      this.refreshTasks();
   }

   async handleDeleteTask(id) {
      await TaskApi.DeleteTask(id);
      this.refreshTasks();
   }

   async handleFilterByStatus(status) {
      const res = await TaskApi.GetTasksByFilter(status);
      if (res.status && res.status === 401) {
         this.setState({ authorized: false, currentUser: null });
      }
      else {
         this.setState({ tasks: res });
      }
   }

   async handleEditTask(id) {
      if (this.state.editingTaskId == id) {
         this.setState({ editingTaskId: null }); 
      }
      else {
         this.setState({ editingTaskId: id });
      }
   }

   async handleLoginUser(user) {
      const res = await UserApi.LoginUser(user.email, user.password);
      if (res.ok) {
         this.refreshTasks();
      }
      console.log(res.status, res.text);
   }

   render() {
      return(
         <div>
            <Header authorized={this.state.authorized} currentUser={this.state.currentUser} />
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
            {
               !this.state.authorized ? <Login onLogin={this.handleLoginUser} /> : <div></div>
            }
         </div>
      );
   }
}

export default App;