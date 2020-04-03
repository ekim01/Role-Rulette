import React, { Component } from "react";
import { View, Text, Button, StyleSheet, Dimensions } from "react-native";
import axios from "axios";
import { TARGET_URL, POLLING_TIME } from "../Utilities/constants";
class Role extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // checks the current room state every 3 seconds
    this.timer = setInterval(() => this.pollRoom(), POLLING_TIME);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
    this.timer = null;
  }

  pollRoom = () => {
    this.props.pollRoom().then(() => {
      //if the user still has a role but the game is no longer in progress, go to EndScreen, game is done
      if (this.props.user.role && !this.props.room.gameInProgress) {
        this.props.setPage("EndScreen");
      }
    });
  };

  endHandler = event => {
    let vm = this;
    axios
      .put(TARGET_URL + "rooms/EndScreen", { room: this.props.room })
      .then(function(response) {
        vm.props.setPage("EndScreen");
      })
      .catch(function(error) {
        vm.props.setErrorText("Internal Server Error.");
        console.log(error);
      });
  };

  render() {
    // ensures no error of trying to access user properties when user is null
    let roleName = "";
    let roleDesc = "";
    let goalDesc = "";
    let userName = "";
    if (this.props.user) {
      userName = this.props.user.name;
      if (this.props.roleName != roleName) {
        roleName = this.props.roleName;
        roleDesc = this.props.roleDesc;
        goalDesc = this.props.goalDesc;
      }
    }

    return (
      <View style={styles.root}>
        <View style={styles.bod}>
          <View style={styles.rowContainer}>
            <View style={styles.roomInfo}>
              <Text>
                Room Code:{" "}
                <Text style={styles.roomCode}>{this.props.roomName}</Text>
              </Text>
            </View>
          </View>
          <Text style={styles.gameTitle}>{this.props.room.game.title}</Text>
          <View style={styles.content}>
            <Text style={styles.usertext}>{userName}</Text>
            <View style={styles.contentRow}>
              <Text style={styles.roleLabel}>
                Your Role: <Text style={styles.roleText}>{roleName}</Text>
              </Text>
            </View>
            <View style={styles.contentRow}>
              <Text style={styles.label}>Role Description: </Text>
              <Text style={styles.descrip}>{roleDesc}</Text>
            </View>
            <View style={styles.contentRow}>
              <Text style={styles.label}>Goal: </Text>
              <Text style={styles.descrip}>{goalDesc}</Text>
            </View>
          </View>

          <View style={styles.rowContainer}>
            {userName === this.props.hostName && (
              <Button title="End Game" onPress={this.endHandler} />
            )}
          </View>
        </View>
      </View>
    );
  }
}

export default Role;

const { height } = Dimensions.get("window");

const styles = StyleSheet.create({
  root: {
    backgroundColor: "#eee",
    flex: 1,
    flexDirection: "column"
  },
  bod: {
    margin: 15
  },
  rowContainer: {
    marginVertical: 5
  },
  contentRow: {
    marginVertical: 3,
    paddingHorizontal: 15
  },
  roomCode: {
    color: "#000",
    fontWeight: "bold",
    textTransform: "uppercase",
    paddingHorizontal: 10,
    marginLeft: 10
  },
  usertext: {
    color: "#eee",
    fontStyle: "italic",
    fontWeight: "bold",
    fontSize: 16,
    backgroundColor: "#444",
    paddingVertical: 3,
    paddingHorizontal: 20,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15
  },
  roleLabel: {
    fontSize: 20,
    paddingHorizontal: 5,
    fontWeight: "bold",
    marginTop: 10
  },
  roleText: {
    color: "#a00"
  },
  roomInfo: {
    backgroundColor: "#ddd",
    padding: 5,
    borderWidth: 2,
    borderColor: "#444",
    marginTop: 20
  },
  gameTitle: {
    fontSize: 35,
    fontStyle: "italic",
    fontWeight: "bold",
    color: "#383b53",
    margin: 5
  },
  label: {
    fontWeight: "bold",
    fontSize: 16,
    padding: 5
  },
  descrip: {
    fontSize: 16,
    backgroundColor: "#eee",
    borderRadius: 5,
    padding: 5
  },
  content: {
    marginVertical: 10,
    backgroundColor: "#ccc",
    borderRadius: 15,
    paddingBottom: 10
  }
});
