import React, { Component } from "react";
import "../stylesheets/Lobby.css";

export default class Lobby extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="container-fluid">
        <div className="row">
          <div
            id="holder"
            className="col-lg-6 col-md-6 col-sm-8 col-xs-10"
            id="login-box"
          >
            <div id="roomCode" className="form-control">
              <label>Room Code: </label>
              <input readOnly type="text" value={this.props.roomName} />
            </div>
            <React.Fragment>
              <ul className="list-group">
                <li className="list-group-item list-group-item-primary">
                  The Host is: {this.props.hostName}
                </li>
                {this.props.players.map(player => (
                  <li className="list-group-item">{player.name}</li>
                ))}
              </ul>
            </React.Fragment>
            <div id="playerNumber">
              <label>{this.props.players.length}</label>
            </div>
            <button
              type="submit"
              className="btn btn-lg"
              onClick={this.routeToLogin}
            >
              Leave
            </button>
            <button
              type="submit"
              className="btn btn-lg float-right"
              onClick={this.routeStartGame}
            >
              Start
            </button>
          </div>
        </div>
      </div>
    );
  }
}
