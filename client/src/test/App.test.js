const filename = "App.js";

import React from "react";
import { shallow } from "enzyme";
import enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { create } from "react-test-renderer";
import { BrowserRouter as Router } from "react-router-dom";
import Role from "../components/role";
import Home from "../components/Home";
import App from "../App";

enzyme.configure({ adapter: new Adapter() });

test(filename + " errortext state initializes to null", () => {
  const wrapper = shallow(<App />);
  expect(wrapper.state("errortext")).toBe("");
});

test(filename + " updates roomname state", () => {
  const wrapper = shallow(<App />);
  const instance = wrapper.instance();

  const newRoom = "ABCD";
  instance.setState({ roomname: newRoom });

  expect(wrapper.state("roomname")).toBe(newRoom);
});

test(filename + " updates user state", () => {
  const wrapper = shallow(<App />);
  const instance = wrapper.instance();

  const newPlayer = "Player1";
  instance.setState({ user: newPlayer });

  expect(wrapper.state("user")).toBe(newPlayer);
});

test(filename + " updates errortext state", () => {
  const wrapper = shallow(<App />);
  const instance = wrapper.instance();

  const newText = "Error text";
  instance.setState({ errortext: newText });

  expect(wrapper.state("errortext")).toBe(newText);
});

describe(filename + " Router component", () => {
  test("Matches the snapshot", () => {
    const router = create(<Router />);
    expect(router.toJSON()).toMatchSnapshot();
  });
});

describe(filename + " Home component", () => {
  test("Matches the snapshot", () => {
    const home = create(
      <Home joinRoom={() => {}} createRoom={() => {}} errortext={""} />
    );
    expect(home.toJSON()).toMatchSnapshot();
  });
});

describe(filename + " Role component", () => {
  test("Matches the snapshot", () => {
    const home = create(<Role />);
    expect(home.toJSON()).toMatchSnapshot();
  });
});

// ==================================
// FUNCTIONS
// ==================================

test(filename + "setLoadingState sets errortext state to empty", () => {
  const wrapper = shallow(<App />);
  const instance = wrapper.instance();

  const newText = "Error text";
  instance.setState({ errortext: newText });
  instance.setLoadingState();
  expect(wrapper.state("errortext").length).toBe(0);
});

test(filename + "setLoadingState sets loading state to true", () => {
  const wrapper = shallow(<App />);
  const instance = wrapper.instance();

  instance.setState({ loading: false });
  instance.setLoadingState();
  expect(wrapper.state("loading")).toEqual(true);
});

test(
  filename +
    "on joining, when roomname empty, errortext is /'Please complete all fields/'",
  () => {
    const wrapper = shallow(<App />);
    const instance = wrapper.instance();

    const nameText = "name";
    const roomText = "";
    instance.joinRoom(nameText, roomText);
    expect(wrapper.state("errortext")).toBe("Please complete all fields");
  }
);

test(
  filename +
    "on joining, when username empty errortext is /'Please complete all fields/'",
  () => {
    const wrapper = shallow(<App />);
    const instance = wrapper.instance();

    const nameText = "";
    const roomText = "room";
    instance.joinRoom(nameText, roomText);
    expect(wrapper.state("errortext")).toEqual("Please complete all fields");
  }
);

test(
  filename +
    "on createroom, when username empty, errortext is /'Please complete all fields/'",
  () => {
    const wrapper = shallow(<App />);
    const instance = wrapper.instance();
    const nameText = "";
    instance.joinRoom(nameText);
    expect(wrapper.state("errortext")).toEqual("Please complete all fields");
  }
);
/*  #TODO - Lobby Component -- Unimplemented

describe(filename + " Lobby component", () => {
    test("Matches the snapshot", () => {
        const home = create(<Lobby />);
        expect(home.toJSON()).toMatchSnapshot();
    });
});
*/
