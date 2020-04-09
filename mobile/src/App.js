import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Router, Switch, Route } from "./Utilities/routing";
import {
  PLAYERNAME_MAXLENGTH,
  ROOMCODE_LENGTH,
  TARGET_URL
} from "./Utilities/constants";
import Home from "./components/Home";
import Lobby from "./components/Lobby";
import Role from "./components/Role";
import EndScreen from "./components/EndScreen";
import axios from "axios";

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      room: {},
      user: {},
      roleName: "",
      roleDesc: "",
      goalDesc: "",
      players: [],
      roomName: "",
      hostName: "",
      errortext: "",
      page: "Home"
    };
  }

  setPage = page => {
    this.setState({
      page: page
    });
  };

  setUser = user => {
    this.setState({
      user: user
    });
  };

  setRole = role => {
    if (role) {
      this.setState({
        roleName: role.name,
        roleDesc: role.roleDescription,
        goalDesc: role.goalDescription
      });
    }
  };

  setPlayers = players => {
    this.setState({
      players: players
    });
  };

  setRoomName = roomName => {
    this.setState({
      roomName: roomName
    });
  };

  setHostName = hostName => {
    this.setState({
      hostName: hostName
    });
  };

  setRoom = room => {
    this.setState({
      room: room
    });
  };

  setErrorText = text => {
    this.setState({
      errortext: text
    });
  };

  setGame = game => {
    // updates nested game object in room, used for when host switches game
    let room = this.state.room;
    room.game = game;
    this.setState({
      room: room
    });
  };

  pollRoom = () =>
    axios
      .get(TARGET_URL + "rooms/getByRoomCode", {
        params: { roomname: this.state.roomName }
      })
      .then(response => {
        // updates room, players, and user variables with the newest room state
        if (response.data) {
          this.setState({
            room: response.data,
            players: response.data.players,
            user: response.data.players.find(
              player => player._id == this.state.user._id
            ),
            hostName: response.data.players[0].name
          });
        }
        if (this.state.user && this.state.user.role) {
          this.setState({
            roleName: this.state.user.role.name,
            roleDesc: this.state.user.role.roleDescription,
            goalDesc: this.state.user.role.goalDescription
          });
        }
      })
      .catch(function(error) {
        console.log(error);
      });

  render() {
    if (this.state.page == "Home") {
      return (
        <View style={styles.container}>
          <Router>
            <Switch>
              <Route
                exact
                path="/"
                render={props => (
                  <Home
                    {...props}
                    setHostName={this.setHostName}
                    setPlayers={this.setPlayers}
                    setRole={this.setRole}
                    setRoomName={this.setRoomName}
                    setUser={this.setUser}
                    setPage={this.setPage}
                    setRoom={this.setRoom}
                  />
                )}
              />
            </Switch>
          </Router>
        </View>
      );
    } else if (this.state.page == "Lobby") {
      return (
        <View style={styles.container}>
          <Router>
            <Switch>
              <Route
                exact
                path="/"
                render={props => (
                  <Lobby
                    {...props}
                    hostName={this.state.hostName}
                    roomName={this.state.roomName}
                    players={this.state.players}
                    room={this.state.room}
                    user={this.state.user}
                    setPage={this.setPage}
                    pollRoom={this.pollRoom}
                    setGame={this.setGame}
                  />
                )}
              />
            </Switch>
          </Router>
        </View>
      );
    } else if (this.state.page == "Role") {
      return (
        <View style={styles.container}>
          <Router>
            <Switch>
              <Route
                exact
                path="/"
                render={props => (
                  <Role
                    {...props}
                    hostName={this.state.hostName}
                    roomName={this.state.roomName}
                    players={this.state.players}
                    room={this.state.room}
                    user={this.state.user}
                    setPage={this.setPage}
                    setErrorText={this.setErrorText}
                    pollRoom={this.pollRoom}
                    roleName={this.state.roleName}
                    roleDesc={this.state.roleDesc}
                    goalDesc={this.state.goalDesc}
                  />
                )}
              />
            </Switch>
          </Router>
        </View>
      );
    } else if (this.state.page == "EndScreen") {
      return (
        <View style={styles.container}>
          <Router>
            <Switch>
              <Route
                exact
                path="/"
                render={props => (
                  <EndScreen
                    {...props}
                    players={this.state.players}
                    setPage={this.setPage}
                  />
                )}
              />
            </Switch>
          </Router>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center"
  }
});
