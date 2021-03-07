import React, { Component } from 'react';
import api from "../api/api";
import TaskTable from "./TaskTable.jsx";
import TaskCreator from "./TaskCreator.jsx";
import Login from "./Login.jsx";
import Header from "./Header.jsx";
import download from 'js-file-download';

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
      this.handleDownloadFile = this.handleDownloadFile.bind(this);
      this.handleLoginUser = this.handleLoginUser.bind(this);
      this.handleRegisterUser = this.handleRegisterUser.bind(this);
      this.refreshTasks = this.refreshTasks.bind(this);
      this.handleLogOut = this.handleLogOut.bind(this);
   }

   async refreshTasks() {
      const res = await api.GetTasks().then(function(data) { return data; });
      if (res.status && res.status === 401) {
         this.setState({ authorized: false, currentUser: null });
         console.log(res.status, res.text);
      }
      else {
         this.setState({ tasks: res });
         const user = await api.GetCurrent().then(function(data) { return data; })
         this.setState({ authorized: true, currentUser: user.result });
      }
   }

   async componentDidMount() {
      this.refreshTasks();
   }

   async handleGetAll() {
      this.refreshTasks();
   }

   async handleCreateTask(taskName, taskStatus, startDate, stopDate, selectedFiles) {
      api.CreateTask(taskName, taskStatus, startDate, stopDate, selectedFiles);
      this.refreshTasks();
   }

   async handleUpdateTask(id, taskName, taskStatus, startDate, stopDate, selectedFiles, editedFiles) {
      api.UpdateTask(id, taskName, taskStatus, startDate, stopDate, selectedFiles, editedFiles);
      this.setState({ editingTaskId: null });
      this.refreshTasks();
   }

   async handleDeleteTask(id) {
      await api.DeleteTask(id).then(function(data) { return data; });
      this.refreshTasks();
   }

   async handleFilterByStatus(status) {
      const res = await api.GetTasksByFilter(status).then(function(data) { return data; });
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

   async handleDownloadFile(taskId, file) {
      await api.DownloadFile(taskId, file).then(function(data) { download(data, file); });
   }

   async handleLoginUser(user) {
      const res = await api.LoginUser(user.email, user.password).then(function(data) { return data; });
      if (res.status === 200) {
         this.setState({ authorized: true });
         this.refreshTasks();
      }
      console.log(res.status, res.text);
   }

   async handleRegisterUser(user) {
      const res = await api.RegisterUser(user.username, user.email, user.password).then(function(data) { return data; });
      if (res.status === 200) {
         this.refreshTasks();
      }
      console.log(res.status, res.text);
   }

   async handleLogOut() {
      this.setState({ authorized: false, currentUser: null });
   }

   render() {
      return(
         <div>
            <Header authorized={this.state.authorized} currentUser={this.state.currentUser} onLogOut={this.handleLogOut} />
            <TaskCreator 
               editingTask={this.state.editingTaskId ? this.state.tasks.find(item => item._id == this.state.editingTaskId) : null}
               onUpdateTask={this.handleUpdateTask}
               onCreateTask={this.handleCreateTask} 
               onFilter={this.handleFilterByStatus} 
               onGetAll={this.handleGetAll}
               onFileDownload={this.handleDownloadFile}
            />   
            <TaskTable 
               editingTaskId={this.state.editingTaskId}
               tasks={this.state.tasks} 
               onDeleteTask={this.handleDeleteTask} 
               onEditTask={this.handleEditTask}
               onFileDownload={this.handleDownloadFile}
            />
            {
               !this.state.authorized ? <Login onLogin={this.handleLoginUser} onRegister={this.handleRegisterUser} /> : <div></div>
            }
         </div>
      );
   }
}

export default App;