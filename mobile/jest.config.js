module.exports = {
  preset: "jest-expo",
  transform: {
    "\\.js$": "<rootDir>/node_modules/react-native/jest/preprocessor.js",
    "^.+\\.jsx?$": "babel-jest"
  },
  transformIgnorePatterns: [
    "node_modules/(?!(jest-)?react-native|deprecated-react-native-listview|react-router-native|static-container|react-clone-referenced-element|@react-native-community|expo(nent)?|@expo(nent)?/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base)"
  ]
};
