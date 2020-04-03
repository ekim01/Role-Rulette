// src/components/Home.js
import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  Button,
  TextInput,
  StyleSheet,
  Dimensions
} from "react-native";
import Dialog, { DialogContent } from "react-native-popup-dialog";
import { restrictInputAlphanumeric } from "../Utilities/common";
import {
  PLAYERNAME_MAXLENGTH,
  ROOMCODE_LENGTH,
  TARGET_URL
} from "../Utilities/constants";
import axios from "axios";
import Banner from "./presentation/Banner";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      roomname: "",
      username: "",
      errortext: ""
    };
  }

  checkUsername(username) {
    let errorMessage = "";

    if (username === "") errorMessage = "Please enter a name";
    else if (username.replace(/\s/g, "").length === 0)
      errorMessage = "The name can't be only spaces";

    console.log(errorMessage);
    return errorMessage;
  }

  setLoadingState = () => {
    this.setState({
      loading: true,
      errortext: ""
    });
  };

  playernameHandler = text => {
    this.setState({ username: text });
  };

  roomnameHandler = text => {
    this.setState({ roomname: text.toUpperCase() });
  };

  createroomHandler = event => {
    event.persist();
    // Clear error messages and set loading to true
    this.setLoadingState();

    let usernameError = this.checkUsername(this.state.username);
    if (usernameError) {
      this.setState({
        loading: false,
        errortext: usernameError
      });
      return;
    }

    axios
      .post(TARGET_URL + "rooms/add", { username: this.state.username })
      .then(response => {
        // Only player is guaranteed to be the current user as room is newly created
        this.setState({
          loading: false
        });
        this.props.setRoomName(response.data.roomCode);
        this.props.setHostName(response.data.players[0].name);
        this.props.setRole(response.data.role);
        this.props.setPlayers(response.data.players);
        this.props.setUser(response.data.players[0]);
        this.props.setPage("Lobby");
        this.props.setRoom(response.data);
      })
      .catch(error => {
        console.log(error);
        this.setState({ loading: false });
        this.setState({
          errortext: "Error creating room; please try again."
        });
      });
  };

  joinroomHandler = event => {
    // Clear error messages and set loading to true
    event.persist();
    this.setLoadingState();

    // Check both room and name, return error text for both before returning
    let usernameError = this.checkUsername(this.state.username);
    if (this.state.roomname.length === 0) {
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
    } else if (this.state.roomname.length < ROOMCODE_LENGTH) {
      this.setState({
        loading: false,
        errortext: "Invalid room code"
      });
      return;
    }

    let vm = this;
    axios
      .post(TARGET_URL + "rooms/addPlayer", {
        roomname: this.state.roomname,
        username: this.state.username
      })
      .then(response => {
        axios
          .get(TARGET_URL + "rooms/getByRoomCode", {
            params: { roomname: this.state.roomname }
          })
          .then(function(res) {
            // Response contains newly created player, res contains room they were added to
            vm.setState({
              loading: false
            });
            vm.props.setRoomName(res.data.roomCode);
            vm.props.setUser(response.data);
            vm.props.setPage("Lobby");
            vm.props.setPlayers(res.data.players);
            vm.props.setHostName(res.data.players[0].name);
          })
          .catch(function(error) {
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
        this.setState({ loading: false });
      });
  };

  render() {
    return (
      <View style={styles.root}>
        <Dialog visible={this.state.loading}>
          <DialogContent style={{ alignItems: "center" }}>
            <Text
              style={{ fontWeight: "bold", fontStyle: "italic", fontSize: 16 }}
            >
              Loading...
            </Text>
          </DialogContent>
        </Dialog>
        <Banner />
        <Dialog
          visible={this.state.errortext != ""}
          onTouchOutside={() => {
            this.setState({ errortext: "" });
          }}
        >
          <DialogContent style={{ alignItems: "center" }}>
            <Text style={{ fontWeight: "bold", fontSize: 16 }}>Error:</Text>
            <Text style={styles.errorText}>{this.state.errortext}</Text>
          </DialogContent>
        </Dialog>
        <View style={styles.rowContainer}></View>
        <View style={styles.label}>
          <Text>Choose your player name:</Text>
        </View>
        <View style={styles.rowContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Player"
            maxLength={PLAYERNAME_MAXLENGTH}
            onChangeText={this.playernameHandler}
            value={this.state.username}
          />
        </View>
        <View style={styles.rowContainer}></View>
        <View style={styles.label}>
          <Text>Enter Room Code:</Text>
        </View>
        <View style={styles.rowContainer}>
          <TextInput
            style={styles.codeInput}
            placeholder="XXXX"
            maxLength={ROOMCODE_LENGTH}
            onKeyPress={e => restrictInputAlphanumeric(e)}
            autoCapitalize="characters"
            onChangeText={this.roomnameHandler}
            value={this.state.roomname}
          />
          <Button title="Join Room" onPress={this.joinroomHandler} />
        </View>
        <View style={styles.label}>
          <Text>— OR —</Text>
        </View>
        <View style={styles.rowContainer}>
          <Button title="Create Room" onPress={this.createroomHandler} />
        </View>
      </View>
    );
  }
}
export default Home;

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#eee"
  },
  label: {
    alignSelf: "center",
    padding: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  rowContainer: {
    alignSelf: "center",
    padding: 13,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  errorText: {
    color: "#D22",
    fontWeight: "bold",
    fontStyle: "italic",
    fontSize: 20,
    padding: 20
  },
  textInput: {
    color: "#eee",
    borderColor: "#888",
    borderWidth: 1,
    width: width * 0.5,
    paddingHorizontal: 10,
    backgroundColor: "#555"
  },
  codeInput: {
    color: "#eee",
    textTransform: "uppercase",
    borderColor: "#888",
    borderWidth: 1,
    paddingHorizontal: 10,
    marginRight: 20,
    backgroundColor: "#555"
  }
});
