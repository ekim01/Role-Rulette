import React from "react";
import { mount, EnzymeAdapter, shallow } from "enzyme";
import axios from "axios";
import enzyme from "enzyme";
import Home from "../../components/Home";
import Adapter from "enzyme-adapter-react-16";
import { PLAYERNAME_MAXLENGTH } from "../../Utilities/constants";

const filename = "Home.js";

enzyme.configure({ adapter: new Adapter() });

// ===============
// STATE
// ===============

test(filename + " roomname state initializes to null", () => {
  const wrapper = shallow(<Home />);

  expect(wrapper.state("roomname")).toBe("");
});

test(filename + " playername state initializes to null", () => {
  const wrapper = shallow(<Home />);

  expect(wrapper.state("username")).toBe("");
});

test(filename + " errortext_room state initializes to null", () => {
  const wrapper = shallow(<Home />);

  expect(wrapper.state("errortext_room")).toBe("");
});

test(filename + " errortext_name state initializes to null", () => {
  const wrapper = shallow(<Home />);
  expect(wrapper.state("errortext_name")).toBe("");
});

test(filename + " updates roomname state", () => {
  const wrapper = shallow(<Home />);
  const instance = wrapper.instance();

  const newRoom = "ABCD";
  instance.setState({ roomname: newRoom });

  expect(wrapper.state("roomname")).toBe(newRoom);
});

test(filename + " updates playername state", () => {
  const wrapper = shallow(<Home />);
  const instance = wrapper.instance();

  const newPlayer = "Player1";
  instance.setState({ playername: newPlayer });

  expect(wrapper.state("playername")).toBe(newPlayer);
});

test(filename + " updates errortext_room state", () => {
  const wrapper = shallow(<Home />);
  const instance = wrapper.instance();

  const newText = "Error text";
  instance.setState({ errortext_room: newText });

  expect(wrapper.state("errortext_room")).toBe(newText);
});

test(filename + " updates errortext_name state", () => {
  const wrapper = shallow(<Home />);
  const instance = wrapper.instance();

  const newText = "Error text";
  instance.setState({ errortext_name: newText });

  expect(wrapper.state("errortext_name")).toBe(newText);
});

// ==================================
// FUNCTIONS
// ==================================

test(filename + "setLoadingState sets errortext_name state to empty", () => {
  const wrapper = shallow(<Home />);
  const instance = wrapper.instance();

  const newText = "Error text";
  instance.setState({ errortext_name: newText });
  instance.setLoadingState();
  expect(wrapper.state("errortext_name").length).toBe(0);
});

test(filename + "setLoadingState sets errortext_room state to empty", () => {
  const wrapper = shallow(<Home />);
  const instance = wrapper.instance();

  const newText = "Error text";
  instance.setState({ errortext_room: newText });
  instance.setLoadingState();
  expect(wrapper.state("errortext_room").length).toBe(0);
});

test(filename + "setLoadingState sets loading state to true", () => {
  const wrapper = shallow(<Home />);
  const instance = wrapper.instance();

  instance.setState({ loading: false });
  instance.setLoadingState();
  expect(wrapper.state("loading")).toEqual(true);
});

test(filename + "checkRoomEmpty returns true on empty roomname state", () => {
  const wrapper = shallow(<Home />);
  const instance = wrapper.instance();

  const newText = "";
  instance.setState({ roomname: newText });
  expect(wrapper.instance().checkRoomEmpty()).toEqual(true);
});

test(
  filename + "checkRoomEmpty returns false on non-empty roomname state",
  () => {
    const wrapper = shallow(<Home />);
    const instance = wrapper.instance();

    const newText = "TEXT";
    instance.setState({ roomname: newText });
    expect(instance.checkRoomEmpty()).toEqual(false);
  }
);

test(filename + "checkNameEmpty returns true on empty roomname state", () => {
  const wrapper = shallow(<Home />);
  const instance = wrapper.instance();

  const newText = "";
  instance.setState({ username: newText });
  expect(instance.checkNameEmpty()).toEqual(true);
});

test(
  filename + "checkNameEmpty returns false on non-empty roomname state",
  () => {
    const wrapper = shallow(<Home />);
    const instance = wrapper.instance();

    const newText = "TEXT";
    instance.setState({ username: newText });
    expect(instance.checkNameEmpty()).toEqual(false);
  }
);

// ------------------
// changeHandler
// ------------------

test(filename + " changeHandler updates state", () => {
  const wrapper = shallow(<Home />);
  const instance = wrapper.instance();

  const newPlayer2 = "Player2";
  const changeEvent = { target: { name: "playername", value: newPlayer2 } };
  instance.changeHandler(changeEvent);

  expect(wrapper.state("playername")).toBe(newPlayer2);
});

// ------------------
// roomnameHandler
// ------------------

test(filename + " roomChangeHadler calls changeHandler", () => {
  const wrapper = shallow(<Home />);
  const instance = wrapper.instance();

  const FakeHandler = jest.spyOn(instance, "changeHandler");

  const changeEvent = { target: { name: "roomname", value: "ABCD" } };
  instance.roomnameHandler(changeEvent);

  expect(FakeHandler).toHaveBeenCalled();
});

// ------------------
// playernameHandler
// ------------------

test(
  filename + "playernameHandler throws error message on max characters",
  () => {
    const wrapper = shallow(<Home />);
    const instance = wrapper.instance();

    var newPlayer3 = "";
    for (var i = 0; i < PLAYERNAME_MAXLENGTH; i++) {
      newPlayer3 += i.toString;
    }

    const changeEvent = { target: { name: "username", value: newPlayer3 } };
    instance.playernameHandler(changeEvent);

    expect(wrapper.state("errortext_name").length).not.toBe(0);

    const changeEvent2 = {
      target: {
        name: "username",
        value: "1"
      }
    };
    instance.playernameHandler(changeEvent2);

    expect(wrapper.state("errortext_name").length).toBe(0);
  }
);

test(filename + " playernameHandler calls changeHandler", () => {
  const wrapper = shallow(<Home />);
  const instance = wrapper.instance();

  const FakeHandler = jest.spyOn(instance, "changeHandler");

  const changeEvent = { target: { name: "username", value: "ABCDEFG" } };
  instance.playernameHandler(changeEvent);

  expect(FakeHandler).toHaveBeenCalled();
});

test(filename + " roomChangeHadler changes characters to uppercase", () => {
  const wrapper = shallow(<Home />);
  const instance = wrapper.instance();

  const newRoom = "azC1";

  const changeEvent = { target: { name: "roomname", value: newRoom } };
  instance.roomnameHandler(changeEvent);

  expect(wrapper.state("roomname")).not.toBe(newRoom);
  expect(wrapper.state("roomname")).toBe(newRoom.toUpperCase());
});

// ------------------
// joinRoom
// ------------------
