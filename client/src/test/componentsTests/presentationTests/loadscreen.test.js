const filename = "loadscreen.js";

import React from "react";
import { create } from "react-test-renderer";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Loadscreen from "../../../components/presentation/loadscreen";

describe(filename + " LoadScreen component", () => {
  test("Matches the snapshot", () => {
    const router = create(<Loadscreen />);
    expect(router.toJSON()).toMatchSnapshot();
  });
});
