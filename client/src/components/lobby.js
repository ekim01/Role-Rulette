import React, { Component } from "react";

export default class Lobby extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <h1>Player Name: {this.props.location.state.user.name}</h1>
        <h1>Room Code: {this.props.location.state.room.roomCode}</h1>
        <button>Start Game!</button>
      </div>
    );
  }
}
