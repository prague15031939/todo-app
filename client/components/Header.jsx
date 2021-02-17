import React, { Component } from 'react';

class Header extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const userInfo = () => {
            if (this.props.authorized && this.props.currentUser) {
                return (
                    <div className="headerUsername">
                        user: <a onClick={this.props.onLogOut}>{this.props.currentUser.username}</a>
                    </div>
                )
            }
            else if (!this.props.authorized) {
                return (
                    <div id="notAuthorized">
                        unauthorized
                    </div>
                )
            }
            else {
                return (<div></div>)
            }
        };
        return(
            <div className="header">
                <div className="headerUserInfo">
                    {userInfo()}
                </div>
            </div>
        )
    }
}

export default Header;