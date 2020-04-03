import React, { Component } from "react";
import {
  View,
  Text,
  Button,
  FlatList,
  StyleSheet,
  Dimensions
} from "react-native";
import Banner from "./presentation/Banner";

class EndScreen extends Component {
  constructor(props) {
    super(props);
  }

  backHandler = event => {
    this.props.setPage("Lobby");
  };

  render() {
    // ensures no error of trying to players when players is null
    let players = [];
    if (this.props.players) {
      players = this.props.players;
    }
    return (
      <View style={styles.root}>
        <Banner />
        <View style={styles.bod}>
          <View style={styles.rowContainer}>
            <Text style={styles.gameTitle}>Game over!</Text>
          </View>
          <View style={styles.rowContainer}>
            <View style={styles.pList}>
              <Text style={{ fontWeight: "bold", fontStyle: "italic" }}>
                Player List
              </Text>
              <FlatList
                data={this.props.players}
                renderItem={({ item }) => (
                  <Text style={styles.anItem}>
                    {item.name} was the {item.role.name}
                  </Text>
                )}
                keyExtractor={item => item._id}
              />
            </View>
          </View>
          <View style={styles.rowContainer}>
            <Button
              style={styles.btn}
              title="Back to Lobby"
              onPress={this.backHandler}
            />
          </View>
        </View>
      </View>
    );
  }
}

export default EndScreen;

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
  pList: {
    backgroundColor: "#ccc",
    padding: 3,
    width: "100%",
    borderColor: "#444",
    borderWidth: 2
  },
  gameTitle: {
    fontSize: 35,
    fontStyle: "italic",
    fontWeight: "bold",
    color: "#383b53",
    margin: 5
  },
  anItem: {
    borderTopWidth: 2,
    borderColor: "#aaa",
    marginTop: 2,
    paddingTop: 2
  }
});
