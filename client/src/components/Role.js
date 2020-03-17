import React, { Component } from 'react';
import { POLLING_TIME } from "../Utilities/constants";
import "../stylesheets/common.css";
import "../stylesheets/Role.css";

export default class Role extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // checks the current room state every 3 seconds
    this.timer = setInterval(() => this.pollRoom(), POLLING_TIME);
  }

  componentWillUnmount() {
    clearInterval(this.timer)
    this.timer = null;
  }

  pollRoom = () => {
    this.props.pollRoom().then(() => {
      // role cleared, game has ended, return to lobby
      if (!this.props.user.role) {
        this.props.setPage("Lobby")
      }
    });
  }

  render() {
    // ensures no error of trying to access role and user properties when role or user is null
    let roleName = ""
    let roleDesc = ""
    let goalDesc = ""
    let userName = ""
    if (this.props.user) {
      userName = this.props.user.name
      if (this.props.user.role) {
        roleName = this.props.user.role.name
        roleDesc = this.props.user.role.roleDescription
        goalDesc = this.props.user.role.goalDescription
      }
    }
    return (
      <div>
        <h1 id="gameTitle" className="text-center"> Current Game: SpyFall</h1>
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-6 col-md-6 col-sm-8 col-xs-10" id="container-box">
              <div id="roomCode">
                <label className="fixed_width" >Room Code: </label>
                <input className="fixed_width" id="input-roomCode" readOnly type="text" value={this.props.roomName} />
              </div>
              <div>
                <label className="fixed_width" >Player Name: </label>
                <input className="fixed_width" id="input-playerName" readOnly type="text" value={userName} />
              </div>
              <div id="roleContainer">
                <label id="roleLabel"> Your role:</label>
                <div>
                  <h2 id="roleInput">{roleName}</h2>
                </div>
              </div>
              <div>
                <label>Role Description</label>
              </div>
              <div>
                <textarea className="description" id="roleDescription" readOnly value={roleDesc} />
              </div>
              <div>
                <label>Goal Desciption</label>
              </div>
              <div>
                <textarea className="description" id="goalDescription" readOnly value={goalDesc} />
              </div>
              <button
                type="submit"
                className="btn btn-lg btn-block"
                onClick={this.routeToLogin}
              >
                Leave
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
