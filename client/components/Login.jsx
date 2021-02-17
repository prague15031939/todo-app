import React, { Component } from 'react';
import Modal from "react-modal";

const authModes = {
    LOGIN: 1,
    REGISTER: 2,
};

Object.freeze(authModes);

class Login extends Component {

    constructor(props) {
        super(props);

        this.state = {
            username: "",
            email: "",
            password: "",
            mode: authModes.LOGIN,
        };

        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
        this.handleRegister = this.handleRegister.bind(this);
        this.handleSwitchMode = this.handleSwitchMode.bind(this);
    }

    handleUsernameChange(event) {
        this.setState({ username: event.target.value });
    }

    handleEmailChange(event) {
        this.setState({ email: event.target.value });
    }

    handlePasswordChange(event) {
        this.setState({ password: event.target.value });
    }

    handleLogin(event) {
        event.preventDefault();
        
        this.props.onLogin({
            email: this.state.email,
            password: this.state.password,
        });
        this.setState({ username: "", email: "", password: "" });
    }

    handleRegister(event) {
        event.preventDefault();
        
        this.props.onRegister({
            username: this.state.username,
            email: this.state.email,
            password: this.state.password,
        });
        this.setState({ username: "", email: "", password: "" });
    }

    handleSwitchMode(event) {
        if (this.state.mode == authModes.LOGIN)
            this.setState({ mode: authModes.REGISTER });
        else if (this.state.mode == authModes.REGISTER)
            this.setState({ mode: authModes.LOGIN });
    }

    render() {
        if (this.state.mode == authModes.LOGIN) {
            return(
                <Modal
                    isOpen={true}
                    ariaHideApp={false}
                    contentLabel="Login dialog"
                    className="modalLogin"
                    overlayClassName="overlayLogin"
                    closeTimeoutMS={500}
                >
                    <form id="loginForm" name="loginForm" autoComplete="off">
                        <h2>Login</h2>
                        <div className="form-group">
                            <label htmlFor="email">email:</label>
                            <input className="form-control" id="email" value={this.state.email} onChange={this.handleEmailChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">password:</label>
                            <input className="form-control" type="password" id="password" value={this.state.password} onChange={this.handlePasswordChange} />
                        </div>
                        <div className="buttonPanelLogin">
                            <button className="btn btn-sm btn-primary" type="submit" id="logbtn" onClick={this.handleLogin} >sign in</button>
                            <button className="btn btn-sm btn-primary" id="switchbtn" onClick={this.handleSwitchMode} >sign up</button>
                        </div>
                    </form>
                </Modal>
            );
        }
        else if (this.state.mode == authModes.REGISTER) {
            return(
                <Modal
                    isOpen={true}
                    ariaHideApp={false}
                    contentLabel="Register dialog"
                    className="modalRegister"
                    overlayClassName="overlayRegister"
                    closeTimeoutMS={500}
                >
                    <form id="registerForm" name="registerForm" autoComplete="off">
                        <h2>Register</h2>
                        <div className="form-group">
                            <label htmlFor="username">username:</label>
                            <input className="form-control" id="username" value={this.state.username} onChange={this.handleUsernameChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">email:</label>
                            <input className="form-control" id="email" value={this.state.email} onChange={this.handleEmailChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">password:</label>
                            <input className="form-control" type="password" id="password" value={this.state.password} onChange={this.handlePasswordChange} />
                        </div>
                        <div className="buttonPanelLogin">
                            <button className="btn btn-sm btn-primary" type="submit" id="regbtn" onClick={this.handleRegister} >sign up</button>
                            <button className="btn btn-sm btn-primary" id="switchbtn" onClick={this.handleSwitchMode} >sign in</button>
                        </div>
                    </form>
                </Modal>
            );
        }
    }
}

export default Login;