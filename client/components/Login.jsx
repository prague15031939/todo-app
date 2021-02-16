import React, { Component } from 'react';
import Modal from "react-modal";

class Login extends Component {

    constructor(props) {
        super(props);

        this.state = {
            email: "",
            password: "",
        };

        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
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
        this.setState({ email: "", password: "" });
    }

    render() {
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
                    <button className="btn btn-sm btn-primary" type="submit" id="logbtn" onClick={this.handleLogin} >sign in</button>
                </form>
            </Modal>
        );
    }
}

export default Login;