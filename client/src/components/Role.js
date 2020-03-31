import React, { Component } from 'react';
import { POLLING_TIME } from "../Utilities/constants";
import LoadingScreen from "../components/presentation/loadscreen";
import "../stylesheets/common.css";
import "../stylesheets/Role.css";
import axios from "axios";

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
      if (!this.props.room.gameInProgress) {
        this.props.setPage("EndScreen")
      }
    });
  }

  endGame = () => {
    let vm = this
    axios.put('/rooms/EndScreen', { room: this.props.room }).then(function (response) {
      vm.props.setPage("EndScreen")
    }).catch(function (error) {
      vm.props.setErrorText("Internal Server Error.")
      console.log(error);
    });
  }

  render() {
    // ensures no error of trying to access user properties when user is null
    let userName = ""
    let gameTitle = ""
    let host = false
    if (this.props.user) {
      userName = this.props.user.name
      host = this.props.user.host
    }
    // sets game properties to display
    if (this.props.room) {
      if (this.props.room.game) {
        gameTitle = this.props.room.game.title
      }
    }
    return (
      <div>
        {this.props.loading && <LoadingScreen text="Loading..." />}
        <h1 id="gameTitle" className="text-center"> Current Game: {gameTitle}</h1>
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
                  <h2 id="roleInput">{this.props.roleName}</h2>
                </div>
              </div>
              <div>
                <label>Role Description</label>
              </div>
              <div>
                <textarea className="description" id="roleDescription" readOnly value={this.props.roleDesc} />
              </div>
              <div>
                <label>Goal Desciption</label>
              </div>
              <div>
                <textarea className="description" id="goalDescription" readOnly value={this.props.goalDesc} />
              </div>
              {/* Hides start game button for all players except host */}
              {
                (host) ?
                  <React.Fragment>
                    <button
                      type="submit"
                      className="btn btn-lg btn-block"
                      onClick={this.endGame}
                    >
                      End Game
                </button>
                  </React.Fragment>
                  : null
              }
            </div>
          </div>
        </div>
      </div>
    )
  }
}
