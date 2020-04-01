import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { ROOMCODE_LENGTH } from "./Utilities/constants";
import Home from "./components/Home";
import Lobby from "./components/Lobby";
import Role from "./components/Role";
import EndScreen from "./components/EndScreen";
import axios from "axios";

export default class App extends Component {
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
      redirect: false,
      loading: false,
      errortext: "",
      page: "Home"
    };
  }

  checkUsername(username) {
    let errorMessage = "";

    if (username === "")
      errorMessage = "Please enter a name";
    else if (username.replace(/\s/g, '').length === 0)
      errorMessage = "The name can't be only spaces";

    console.log(errorMessage);
    return errorMessage;
  }

  setHostName = (newHost) => {
    this.setState({
      hostName: newHost
    });
  };

  setLoadingStart = () => {
    this.setState({
      loading: true,
      errortext: ""
    });
  };

  setLoadingFinish = () => {
    this.setState({
      loading: false
    });
  }

  setErrorText = (text) => {
    this.setState({
      errortext: text
    });
  }

  setPage = (page) => {
    this.setState({
      page: page
    })
  }

  setGame = (game) => {
    // updates nested game object in room, used for when host switches game
    let room = this.state.room
    room.game = game
    this.setState({
      room: room
    })
  }

  pollRoom = () =>
    axios
      .get("/rooms/getByRoomCode", {
        params: { roomname: this.state.roomName }
      })
      .then(response => {
        // updates room, players, and user variables with the newest room state
        this.setState({
          room: response.data,
          players: response.data.players,
          user: response.data.players.find(player => player._id === this.state.user._id),
          hostName: response.data.players[0].name
        });
        if (this.state.user && this.state.user.role) {
          this.setState({
            roleName: this.state.user.role.name,
            roleDesc: this.state.user.role.roleDescription,
            goalDesc: this.state.user.role.goalDescription
          });
        }
      }).catch(function (error) {
        console.log(error);
      });



  // Sends a post request to add player to a room then navigates to lobby page
  joinRoom = (roomname, username) => {
    // Clear error messages and set loading to true
    this.setLoadingStart();

    let usernameError = this.checkUsername(username);
    if (roomname.length === 0) {
      this.setState({
        loading: false,
        errortext: "Please complete all fields"
      });
      return;
    } else if (usernameError) {
      this.setState({
        loading: false,
        errortext: usernameError
      });
      return;
    } else if (roomname.length < ROOMCODE_LENGTH) {
      this.setState({
        loading: false,
        errortext: "Invalid room code"
      });
      return;
    }

    let vm = this;
    axios
      .post("/rooms/addPlayer", {
        roomname: roomname,
        username: username
      })
      .then(response => {
        axios
          .get("/rooms/getByRoomCode", {
            params: { roomname: roomname }
          })
          .then(function (res) {
            // Response contains newly created player, res contains room they were added to
            vm.setState({
              loading: false,
              roomName: res.data.roomCode,
              user: response.data,
              page: "Lobby",
              players: res.data.players,
              hostName: res.data.players[0].name,
              room: res.data
            });
          })
          .catch(function (error) {
            console.log(error);
          });
        this.setState({ loading: false });
      })
      .catch(error => {
        if (error.response) {
          if (error.response.status === 404) {
            this.setState({
              errortext: "Room not found."
            });
          } else if (error.response.status === 418)  {
            this.setState({
              errortext: "Name already in use."
            });
          } else {
            this.setState({
              errortext: "Error joining room; please try again."
            });
          }
        } else {
          this.setState({
            errortext: "Internal Server Error."
          });
        }
        console.log(error);
        this.setState({ loading: false });
      });
  };

  createRoom = username => {
    // Clear error messages and set loading to true
    this.setLoadingStart();

    let usernameError = this.checkUsername(username);
    if (usernameError) {
      this.setState({
        loading: false,
        errortext: usernameError
      });
      return;
    }

    axios
      .post("/rooms/add", { username: username })
      .then(response => {
        // Only player is guaranteed to be the current user as room is newly created
        this.setState({
          loading: false,
          roomName: response.data.roomCode,
          hostName: response.data.players[0].name,
          role: response.data.role,
          players: response.data.players,
          user: response.data.players[0],
          page: "Lobby",
          room: response.data
        });
      })
      .catch(error => {
        console.log(error);
        this.setState({ loading: false });
        this.setState({
          errortext: "Error creating room; please try again."
        });
      });
  };

  render() {
    let view;
    if (this.state.page === "Home") {
      view = (
        <Home
          joinRoom={this.joinRoom}
          createRoom={this.createRoom}
          errortext={this.state.errortext}
          loading={this.state.loading}
          setLoadingFinish={this.setLoadingFinish}
        />
      );
    } else if (this.state.page === "Lobby") {
      view = (
        <Lobby
          hostName={this.state.hostName}
          roomName={this.state.roomName}
          players={this.state.players}
          errortext={this.state.errortext}
          loading={this.state.loading}
          room={this.state.room}
          user={this.state.user}
          setPage={this.setPage}
          pollRoom={this.pollRoom}
          setErrorText={this.setErrorText}
          setLoadingFinish={this.setLoadingFinish}
          setLoadingStart={this.setLoadingStart}
          setGame={this.setGame}
        />
      );
    } else if (this.state.page === "Role") {
      view = (
        <Role
          hostName={this.state.hostName}
          roomName={this.state.roomName}
          players={this.state.players}
          errortext={this.state.errortext}
          room={this.state.room}
          user={this.state.user}
          setPage={this.setPage}
          pollRoom={this.pollRoom}
          roleName={this.state.roleName}
          roleDesc={this.state.roleDesc}
          goalDesc={this.state.goalDesc}
        />
      );
    } else if (this.state.page === "EndScreen") {
      view = (
        <EndScreen
          roomName={this.state.roomName}
          room={this.state.room}
          players={this.state.players}
          errortext={this.state.errortext}
          setPage={this.setPage}
        />
      );
    } else {
      view = <h2>An error has occured.</h2>;
    }
    return <div>{view}</div>;
  }
}