import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { ROOMCODE_LENGTH } from "./Utilities/constants";
import Home from "./components/Home";
import Lobby from "./components/Lobby";
import axios from "axios";

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      user: "",
      role: "",
      players: [],
      roomName: "",
      hostName: "",
      redirect: false,
      loading: false,
      errortext: "",
      page: "Home"
    };
  }

  setLoadingState = () => {
    this.setState({
      loading: true,
      errortext: ""
    });
  };

  // Sends a post request to add player to a room then navigates to lobby page
  joinRoom = (roomname, username) => {
    // Clear error messages and set loading to true
    this.setLoadingState();

    // Check both room and name, return error text for both before returning
    if (roomname.length < ROOMCODE_LENGTH || username === "") {
      this.setState({
        loading: false,
        errortext: "Please complete all fields"
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
          .then(function(res) {
            // Response contains newly created player, res contains room they were added to
            vm.setState({
              loading: false,
              roomName: res.data.roomCode,
              user: response.data.name,
              page: "Lobby",
              players: res.data.players,
              hostName: res.data.players[0].name
            });
          })
          .catch(function(error) {
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
    this.setLoadingState();

    if (username === "") {
      this.setState({ loading: false, errortext: "Please enter a username" });
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
          user: response.data.players[0].name,
          page: "Lobby"
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
        />
      );
    } else if (this.state.page === "Lobby") {
      view = (
        <Lobby
          hostName={this.state.hostName}
          roomName={this.state.roomName}
          players={this.state.players}
          errortext={this.state.errortext}
        />
      );
    } else {
      view = <h2>An error has occured.</h2>;
    }

    return <div>{view}</div>;
  }
}
