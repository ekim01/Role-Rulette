const filename = "App.js";

import React from "react";
import { create } from "react-test-renderer";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Lobby from "../components/lobby";
import Role from "../components/role";
import Home from "../components/Home";

describe(filename + " Router component", () => {
  test("Matches the snapshot", () => {
    const router = create(<Router />);
    expect(router.toJSON()).toMatchSnapshot();
  });
});

describe(filename + " Home component", () => {
  test("Matches the snapshot", () => {
    const home = create(<Home />);
    expect(home.toJSON()).toMatchSnapshot();
  });
});

describe(filename + " Role component", () => {
  test("Matches the snapshot", () => {
    const home = create(<Role />);
    expect(home.toJSON()).toMatchSnapshot();
  });
});

/*  #TODO - Lobby Component -- Unimplemented

describe(filename + " Lobby component", () => {
    test("Matches the snapshot", () => {
        const home = create(<Lobby />);
        expect(home.toJSON()).toMatchSnapshot();
    });
});
*/
