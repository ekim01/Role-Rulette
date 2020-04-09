// src/components/Lobby.js
import React, { Component } from "react";
import {
  View,
  Text,
  Button,
  FlatList,
  StyleSheet,
  Dimensions
} from "react-native";
import Dialog, { DialogContent } from "react-native-popup-dialog";
import ModalDropdown from "react-native-modal-dropdown";
import {
  TARGET_URL,
  SPYFALL_MAXPLAYERS,
  SPYFALL_MINPLAYERS,
  AVALON_MINPLAYERS,
  AVALON_MAXPLAYERS,
  DICTATOR_MINPLAYERS,
  DICTATOR_MAXPLAYERS,
  POLLING_TIME
} from "../Utilities/constants";
import axios from "axios";

class Lobby extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errortext: "",
      loading: false,
      descriptionVisible: false
    };
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
    //if person is loading, don't poll the room, things aren't ready yet
    if (!this.state.loading) {
      this.props.pollRoom().then(() => {
        // If the user doesn't exist anymore go home otherwise, role set, game has started, go to role page
        if (this.props.user) {
          if (this.props.user.role && this.props.room.gameInProgress) {
            this.props.setPage("Role");
          }
        } else {
          this.props.setPage("Home");
        }
      });
    }
  };

  startHandler = event => {
    event.persist();
    //set to loading until server is finished distributing roles
    this.setState({
      loading: true
    });
    let vm = this;
    axios
      .put(TARGET_URL + "rooms/distributeRoles", { room: this.props.room })
      .then(function(response) {
        vm.setState({
          loading: false
        });
        vm.pollRoom(); //server is finished distributing roles, poll the room to update everyone
      })
      .catch(function(error) {
        if (error.response) {
          if (error.response.status === 400) {
            vm.setState({
              errortext: "No game selected; please select a game."
            });
          } else if (error.response.status === 404) {
            vm.setState({
              errortext:
                "Game distribution rules have not been created; please select a different game."
            });
          } else if (error.response.status === 418) {
            vm.setState({
              errortext: "Incorrect amount of players required to start game."
            });
          }
        } else {
          vm.setState({
            errortext: "Internal Server Error."
          });
        }
        vm.setState({
          loading: false
        });
        console.log(error);
      });
  };

  gameChangeHandler = game => {
    //load until done updating the game
    this.setState({
      loading: true
    });
    let vm = this;
    axios
      .put(TARGET_URL + "rooms/updateGame", {
        room: vm.props.room,
        gameTitle: game
      })
      .then(function(response) {
        vm.props.setGame(response.data);
        vm.setState({
          loading: false
        });
      })
      .catch(function(error) {
        if (error.response) {
          if (error.response.status === 404) {
            vm.setState({
              errortext: "Game with the selected title has not been created; please select a different game."
            });
          }
        } else {
          vm.setState({
            errortext: "Internal Server Error."
          });
        }
        vm.setState({
          loading: false
        });
        console.log(error);
      });
  };

  leaveHandler = event => {
    let vm = this;
    vm.setState({
      loading: true
    });
    axios
      .put(TARGET_URL + "rooms/leaveLobby", {
        room: this.props.room,
        user: this.props.user.name
      })
      .then(function(response) {
        vm.setState({
          loading: false
        });
        if (response.status == 200) {
          vm.props.setPage("Home");
        }
        vm.pollRoom();
      })
      .catch(function(error) {
        vm.setState({
          loading: false
        });
        console.log(error);
      });
  };

  render() {
    // ensures no error of trying to access room properties when room is null
    let userName = "";
    let gameDesc = "";
    let gameTitle = "";
    let minPlayers = "";
    let maxPlayers = "";
    if (this.props.user) {
      userName = this.props.user.name;
    }
    //if the room exists and the state isn't loading from a game change, fill out the details.
    //if state is loading then don't fill in gameDescription so that it continues loading.
    if (this.props.room && !this.state.loading) {
      if (this.props.room.game) {
        gameDesc = this.props.room.game.description;
        gameTitle = this.props.room.game.title;
        if (gameTitle == "Spyfall") {
          minPlayers = SPYFALL_MINPLAYERS;
          maxPlayers = SPYFALL_MAXPLAYERS;
        } else if (gameTitle == "Avalon") {
          minPlayers = AVALON_MINPLAYERS;
          maxPlayers = AVALON_MAXPLAYERS;
        } else if (gameTitle == "Secret Dictator") {
          minPlayers = DICTATOR_MINPLAYERS;
          maxPlayers = DICTATOR_MAXPLAYERS;
        }
      }
    }

    return (
      <View style={styles.root}>
        <Dialog visible={gameDesc == "" || this.state.loading}>
          <DialogContent style={{ alignItems: "center" }}>
            <Text
              style={{ fontWeight: "bold", fontStyle: "italic", fontSize: 16 }}
            >
              Loading...
            </Text>
          </DialogContent>
        </Dialog>
        <View style={styles.bod}>
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
          <View style={styles.rowContainer}>
            <Text>Room Code:</Text>
            <Text style={styles.roomCode}>{this.props.roomName}</Text>
          </View>
          <View style={styles.rowContainer}>
            <Button
              style={styles.btn}
              title="Leave"
              onPress={this.leaveHandler}
            />
            <Text style={{ marginLeft: 10 }}></Text>
            {userName === this.props.hostName && (
              <Button
                style={styles.btn}
                title="Start"
                onPress={this.startHandler}
              />
            )}
          </View>
          <View style={styles.content}>
            <View style={styles.contentRow}>
              <ModalDropdown
                style={styles.picker}
                defaultValue={gameTitle}
                options={["Spyfall", "Avalon", "Secret Dictator"]}
                dropdownStyle={styles.pickerDrop}
                dropdownTextStyle={{ fontSize: 15, margin: 10 }}
                textStyle={{ fontSize: 20, margin: 10, color: "white" }}
                disabled={userName != this.props.hostName}
                onSelect={(index, value) => this.gameChangeHandler(value)}
              />
            </View>

            <View style={styles.contentRow}>
              <Button
                title="Game Description"
                onPress={() => {
                  this.setState({ descriptionVisible: true });
                }}
              />
              <Dialog
                visible={this.state.descriptionVisible}
                onTouchOutside={() => {
                  this.setState({ descriptionVisible: false });
                }}
              >
                <DialogContent style={{ alignItems: "center" }}>
                  <Text style={styles.label}>{gameTitle}</Text>
                  <Text style={styles.descrip}>{gameDesc}</Text>
                </DialogContent>
              </Dialog>
            </View>
            <View style={styles.contentRow}>
              <Text style={styles.descrip}>
                <Text style={styles.label}> Players: </Text>
                {" " + minPlayers + " - " + maxPlayers}
              </Text>
            </View>
          </View>
          <View style={styles.rowContainer}>
            <Text>The Host is: {this.props.hostName}</Text>
          </View>
          <View style={styles.rowContainer}>
            <View style={styles.pList}>
              <Text style={{ fontWeight: "bold", fontStyle: "italic" }}>
                Player List
              </Text>
              <FlatList
                data={this.props.players}
                renderItem={({ item }) => (
                  <Text style={styles.anItem}>{item.name}</Text>
                )}
                keyExtractor={item => item._id}
              />
            </View>
          </View>
        </View>
      </View>
    );
  }
}

export default Lobby;

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#eee"
  },
  bod: {
    margin: 15
  },
  rowContainer: {
    alignSelf: "center",
    padding: 8,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  content: {
    marginVertical: 10,
    backgroundColor: "#ccc",
    borderRadius: 15,
    paddingBottom: 10
  },
  contentRow: {
    marginVertical: 3,
    paddingHorizontal: 15
  },
  errorText: {
    color: "#D22",
    fontWeight: "bold",
    fontStyle: "italic",
    fontSize: 20,
    padding: 6
  },
  roomCode: {
    color: "#eee",
    textTransform: "uppercase",
    paddingHorizontal: 10,
    marginLeft: 10,
    backgroundColor: "#555"
  },
  pList: {
    backgroundColor: "#ccc",
    padding: 3,
    width: "100%",
    borderColor: "#444",
    borderWidth: 2
  },
  picker: {
    width: "100%",
    color: "#eee",
    borderColor: "#888",
    borderWidth: 1,
    backgroundColor: "#555"
  },
  pickerDrop: {
    width: "80%",
    color: "#eee"
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
  anItem: {
    borderTopWidth: 2,
    borderColor: "#aaa",
    marginTop: 2,
    paddingTop: 2
  }
});
