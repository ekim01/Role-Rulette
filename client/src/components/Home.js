import React, { Component } from "react";
import axios from "axios";
import { restrictInputAlphanumeric } from "../Utilities/common";
import { PLAYERNAME_MAXLENGTH, ROOMCODE_LENGTH } from "../Utilities/constants";
import LoadingScreen from "../components/presentation/loadscreen";

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      roomname: "",
      username: "",
      errortext_room: "",
      errortext_name: ""
    };
  }

  changeHandler = event => {
    let key = event.target.name;
    let val = event.target.value;

    this.setState({ [key]: val });
  };

  playernameHandler = event => {
    this.changeHandler(event);
    if (event.target.value.length >= PLAYERNAME_MAXLENGTH) {
      this.setState({
        errortext_name: `Reached maximum name length of ${PLAYERNAME_MAXLENGTH} characters.`
      });
    } else {
      this.setState({
        errortext_name: ""
      });
    }
  };

  roomnameHandler = event => {
    event.target.value = event.target.value.toUpperCase();
    this.changeHandler(event);
  };

  setLoadingState = () => {
    this.setState({
      loading: true,
      errortext_room: "",
      errortext_name: ""
    });
  };

  checkRoomEmpty = () => {
    if (this.state.roomname.length < ROOMCODE_LENGTH) {
      this.setState({
        errortext_room: "Please enter a 4-digit room code."
      });
      return true;
    }
    return false;
  };

  checkNameEmpty = () => {
    if (this.state.username.length === 0) {
      this.setState({
        errortext_name: "Please enter a player name."
      });
      return true;
    }
    return false;
  };

  // Sends a post request to add player to a room then navigates to lobby page
  joinRoom = () => {
    // Clear error messages and set loading to true
    this.setLoadingState();

    var nameEmpty = this.checkNameEmpty();
    var roomEmpty = this.checkRoomEmpty();
    // Check both room and name, return error text for both before returning
    if (nameEmpty || roomEmpty) {
      this.setState({ loading: false });
      return;
    }

    let vm = this;
    axios
      .post("/rooms/addPlayer", {
        roomname: this.state.roomname,
        username: this.state.username
      })
      .then(response => {
        console.log(response);
        axios
          .get("/rooms/getByRoomCode", {
            params: { roomname: vm.state.roomname }
          })
          .then(function(res) {
            console.log(res);
            // Response contains newly created player, res contains room they were added to
            vm.props.history.push("/lobby", {
              room: res.data,
              user: response.data
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
              errortext_room: "Room not found."
            });
          } else {
            this.setState({
              errortext_room: "Error joining room; please try again."
            });
          }
        } else {
          this.setState({
            errortext_room: "Internal Server Error."
          });
        }
        console.log(error);
        this.setState({ loading: false });
      });
  };

  // Sends a post request w/ username to /rooms/add then navigates to lobby page
  createRoom = () => {
    // Clear error messages and set loading to true
    this.setLoadingState();

    if (this.checkNameEmpty()) {
      this.setState({ loading: false });
      return;
    }

    let vm = this;
    axios
      .post("/rooms/add", { username: this.state.username })
      .then(response => {
        console.log(response);
        // Only player is guaranteed to be the current user as room is newly created
        vm.props.history.push("/lobby", {
          room: response.data,
          user: response.data.players[0]
        });
        this.setState({ loading: false });
      })
      .catch(error => {
        console.log(error);
        this.setState({ loading: false });
        this.setState({
          errortext_room: "Error creating room; please try again."
        });
      });
  };

  render() {
    return (
      <div>
        {this.state.loading && <LoadingScreen text="Loading..." />}
        <h1>Enter a player name</h1>
        <h4 className="error-text">{this.state.errortext_name}</h4>
        <input
          type="text"
          name="username"
          maxLength={PLAYERNAME_MAXLENGTH}
          size={PLAYERNAME_MAXLENGTH}
          onChange={this.playernameHandler}
        />

        <h1>Enter 4 character room code to join a room</h1>
        <h4 className="error-text">{this.state.errortext_room}</h4>
        <input
          type="text"
          name="roomname"
          maxLength={ROOMCODE_LENGTH}
          onKeyPress={e => restrictInputAlphanumeric(e)}
          style={{ textTransform: "uppercase" }}
          onChange={this.roomnameHandler}
        />
        <button onClick={this.joinRoom} disabled={this.state.loading}>
          Join Room
        </button>

        <h1>Create a room</h1>
        <button onClick={this.createRoom} disabled={this.state.loading}>
          Create Room
        </button>
      </div>
    );
  }
}
