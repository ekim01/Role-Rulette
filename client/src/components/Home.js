import React, { Component } from "react";
import axios from "axios";
import { restrictInputAlphanumeric } from "../Utilities/common";

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      roomname: "",
      username: "",
      errortext: ""
    };
  }

  changeHandler = event => {
    let key = event.target.name;
    let val = event.target.value;

    this.setState({ [key]: val });
  };

  roomnameHandler = event => {
    event.target.value = event.target.value.toUpperCase();
    this.changeHandler(event);
  };

  // Sends a post request to add player to a room then navigates to lobby page
  joinRoom = () => {
    let vm = this;
    axios
      .post("/rooms/addPlayer", {
        roomname: this.state.roomname,
        username: this.state.username
      })
      .then(function (response) {
        console.log(response);
        axios
          .get("/rooms/getByRoomCode", {
            params: { roomname: vm.state.roomname }
          })
          .then(function (res) {
            console.log(res);
            // Response contains newly created player, res contains room they were added to
            vm.props.history.push("/lobby", {
              room: res.data,
              user: response.data
            });
          })
          .catch(function (error) {
            console.log(error);
          });
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
      });
  };

  // Sends a post request w/ username to /rooms/add then navigates to lobby page
  createRoom = () => {
    let vm = this;
    axios
      .post("/rooms/add", { username: this.state.username })
      .then(function (response) {
        console.log(response);
        // Only player is guaranteed to be the current user as room is newly created
        vm.props.history.push("/lobby", {
          room: response.data,
          user: response.data.players[0]
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  render() {
    return (
      <div>
        <h1>Enter a name</h1>
        <input type="text" name="username" onChange={this.changeHandler} />

        <h1>Enter 4 character room code to join a room</h1>
        <h4 className="error-text">{this.state.errortext}</h4>
        <input
          type="text"
          name="roomname"
          maxLength="4"
          onKeyPress={e => restrictInputAlphanumeric(e)}
          style={{ textTransform: "uppercase" }}
          onChange={this.roomnameHandler}
        />
        <button onClick={this.joinRoom}>Join Room</button>

        <h1>Create a room</h1>
        <button onClick={this.createRoom}>Create Room</button>
      </div>
    );
  }
}
