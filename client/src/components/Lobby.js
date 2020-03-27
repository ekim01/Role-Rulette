import React, { Component } from "react";
import { SPYFALL_MINPLAYERS, SPYFALL_MAXPLAYERS, POLLING_TIME } from "../Utilities/constants";
import "../stylesheets/Lobby.css";
import axios from "axios";

export default class Lobby extends Component {
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
      // role set, game has started, go to role page
      if (this.props.user.role && this.props.room.gameInProgress) {
        this.props.setPage("Role")
      }
    });
  }

  startGame = () => {
    let vm = this
    axios.put('/rooms/distributeRoles', { room: this.props.room }).then(function (response) {
      vm.props.resetRole()
      vm.props.setPage("Role")
    }).catch(function (error) {
      if (error.response) {
        if (error.response.status === 400) {
          vm.props.setErrorText("No game selected; please select a game.")
        } else if (error.response.status === 404) {
          vm.props.setErrorText("Game distribution rules have not been created; please select a different game.")
        } else if (error.response.status === 418) {
          vm.props.setErrorText("Incorrect amount of players required to start game; please have " +  SPYFALL_MINPLAYERS + "-" + SPYFALL_MAXPLAYERS + " players.")
        }
      } else {
        vm.props.setErrorText("Internal Server Error.")
      }
      console.log(error);
    });
  }


  render() {
    // ensures no error of trying to access name when user is null
    let userName = ""
    if (this.props.user) {
      userName = this.props.user.name
    }
    return (
      <div className="container-fluid">
        <div className="row">
          <div
            className="col-lg-6 col-md-6 col-sm-8 col-xs-10"
            id="container-box"
          >
            <h4 className="error-text">{this.props.errortext}</h4>
            <div id="roomCode" className="form-control">
              <label className="fixed_width" >Room Code: </label>
              <input id="input-roomCode" readOnly type="text" value={this.props.roomName} />
            </div>
            <React.Fragment>
              <ul className="list-group">
                <li className="list-group-item list-group-item-primary">
                  The Host is: {this.props.hostName}
                </li>
                {this.props.players.map((player,i) => (
                  <li className="list-group-item" key={i}>{player.name}</li>
                ))}
              </ul>
            </React.Fragment>
            <div id="playerNumber">
              <label>{this.props.players.length}</label>
            </div>
            <button
              type="submit"
              className="btn btn-lg"
              onClick={this.leaveLobby}
            >
              Leave
            </button>
            {/* Hides start game button for all players except host */}
            {
              (userName === this.props.hostName) ?
                <React.Fragment>
                  <button
                    type="submit"
                    className="btn btn-lg float-right"
                    onClick={this.startGame.bind(this)}
                  >
                    Start
                </button>
                </React.Fragment>
                : null
            }
          </div>
        </div>
      </div>
    );
  }
}
