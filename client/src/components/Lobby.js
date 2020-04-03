import React, { Component } from "react";
import { SPYFALL_MINPLAYERS, SPYFALL_MAXPLAYERS, AVALON_MINPLAYERS, AVALON_MAXPLAYERS, DICTATOR_MINPLAYERS, DICTATOR_MAXPLAYERS, POLLING_TIME } from "../Utilities/constants";
import LoadingScreen from "../components/presentation/loadscreen";
import "../stylesheets/common.css";
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
    if (!this.props.loading) {
      this.props.pollRoom().then(() => {
        // If the user doesn't exist anymore go home otherwise, role set, game has started, go to role page
        if (this.props.user) {
          if (this.props.user.role && this.props.room.gameInProgress) {
            this.props.setPage("Role")
          }
        }
        else {
          this.props.setPage("Home")
        }
      });
    }
  }

  startGame = () => {
    let vm = this
    vm.props.setLoadingStart()
    axios.put('/rooms/distributeRoles', { room: this.props.room }).then(function (response) {
      vm.props.setLoadingFinish()
      vm.pollRoom()
    }).catch(function (error) {
      vm.props.setLoadingFinish()
      if (error.response) {
        if (error.response.status === 400) {
          vm.props.setErrorText("No game selected; please select a game.")
        } else if (error.response.status === 404) {
          vm.props.setErrorText("Game distribution rules have not been created; please select a different game.")
        } else if (error.response.status === 418) {
          vm.props.setErrorText("Incorrect amount of players required to start game.")
        }
      } else {
        vm.props.setErrorText("Internal Server Error.")
      }
      console.log(error);
    });
  }

  gameChangeHandler = event => {
    let vm = this
    vm.props.setLoadingStart()
    axios.put('/rooms/updateGame', { room: this.props.room, gameTitle: event.target.value }).then(function (response) {
      vm.props.setLoadingFinish()
      vm.props.setGame(response.data)
    }).catch(function (error) {
      vm.props.setLoadingFinish()
      if (error.response) {
        if (error.response.status === 404) {
          vm.props.setErrorText("Game with the selected title has not been created; please select a different game.")
        }
      } else {
        vm.props.setErrorText("Internal Server Error.")
      }
      console.log(error);
    });
    console.log(event.target.value)
  }

  leaveLobby = () => {
    let vm = this
    axios.put("/rooms/leaveLobby", { room: this.props.room, user: this.props.user.name }).then(function (response) {
      if (response.status == 200) {
        vm.props.setPage("Home");
      }
      vm.pollRoom()
    }).catch(function (error) {
      console.log(error);
    });
  }


  render() {
    // ensures no error of trying to access name when user is null
    let userName = ""
    let gameTitle = ""
    let gameDesc = ""
    let minPlayers = ""
    let maxPlayers = ""
    if (this.props.user) {
      userName = this.props.user.name
    }
    // sets game properties to display
    if (this.props.room) {
      if (this.props.room.game) {
        gameTitle = this.props.room.game.title
        gameDesc = this.props.room.game.description
        if (gameTitle == "Spyfall") {
          minPlayers = SPYFALL_MINPLAYERS
          maxPlayers = SPYFALL_MAXPLAYERS
        } else if (gameTitle == "Avalon") {
          minPlayers = AVALON_MINPLAYERS
          maxPlayers = AVALON_MAXPLAYERS
        } else if (gameTitle == "Secret Dictator") {
          minPlayers = DICTATOR_MINPLAYERS
          maxPlayers = DICTATOR_MAXPLAYERS
        }
      }
    }
    return (
      <div>
        {this.props.loading && <LoadingScreen text="Loading..." />}
        <div className="container-fluid">
          <div className="row">
            <div
              className="col-lg-6 col-md-6 col-sm-8 col-xs-10"
              id="container-box"
            >
              <h4 className="error-text">{this.props.errortext}</h4>
              <div id="title">
                <label className="fixed_width" >Game: </label>
                {/* Displays a selection box for host to select game, displays readonly input box for all other players */}
                {
                  (userName === this.props.hostName) ?
                    <React.Fragment>
                      <select className="fixed_width" id="select-game" onChange={this.gameChangeHandler}>
                        {/* selected used to dynamically select the correct game title on render */}
                        <option value="Spyfall" selected={"Spyfall" === gameTitle}>Spyfall</option>
                        <option value="Avalon" selected={"Avalon" === gameTitle}>Avalon</option>
                        <option value="Secret Dictator" selected={"Secret Dictator" === gameTitle}>Secret Dictator</option>
                      </select>
                    </React.Fragment>
                    : <input className="lobby_input" id="input-title" readOnly type="text" value={gameTitle} />
                }
              </div>
              <div id="description">
                <label className="fixed_width">Description: </label>
                <textarea className="description" id="input-desc" readOnly type="text" value={gameDesc} />
              </div>
              <div id="playerRestrictions">
                <label>Players Required: {minPlayers} - {maxPlayers}</label>
              </div>
              <div id="roomCode" className="form-control">
                <label className="fixed_width">Room Code: </label>
                <input id="input-roomCode" readOnly type="text" value={this.props.roomName} />
              </div>
              <React.Fragment>
                <ul className="list-group">
                  <li className="list-group-item list-group-item-primary">
                    The Host is: {this.props.hostName}
                  </li>
                  {this.props.players.map((player, i) => (
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
      </div>
    );
  }
}
