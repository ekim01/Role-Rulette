import React from "react";
import { View, Text, StyleSheet } from "react-native";

const Banner = props => {
  return (
    <View style={styles.banner}>
      <Text style={{ color: "#ad343e", fontSize: 40, fontWeight: "bold" }}>
        ROLE ROULETTE
      </Text>
      <Text style={{ color: "#fff", fontSize: 16 }}>
        Hidden Identity Games Made Easier
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    flexDirection: "column",
    alignItems: "center",
    padding: 50,
    marginBottom: 0,
    backgroundColor: "#383b53",
    color: "white"
  }
});

export default Banner;
