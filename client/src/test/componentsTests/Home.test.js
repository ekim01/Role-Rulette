import React from "react";
import { mount, EnzymeAdapter, shallow } from "enzyme";
import axios from "axios";
import enzyme from "enzyme";
import Home from "../../components/Home";
import Adapter from "enzyme-adapter-react-16";
import LoadingScreen from "../../components/presentation/loadscreen";
import { PLAYERNAME_MAXLENGTH } from "../../Utilities/constants";

const filename = "Home.js";

enzyme.configure({ adapter: new Adapter() });

// ===============
// STATE
// ===============

test(filename + " roomname state initializes to null", () => {
  const wrapper = shallow(
    <Home joinRoom={() => {}} createRoom={() => {}} errortext={""} />
  );
  expect(wrapper.state("roomname")).toBe("");
});

test(filename + " playername state initializes to null", () => {
  const wrapper = shallow(
    <Home joinRoom={() => {}} createRoom={() => {}} errortext={""} />
  );
  expect(wrapper.state("username")).toBe("");
});

// ==================================
// FUNCTIONS
// ==================================

// ------------------
// changeHandler
// ------------------

test(filename + " changeHandler updates state", () => {
  const wrapper = shallow(<Home joinRoom={() => {}} createRoom={() => {}} />);
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
  const wrapper = shallow(
    <Home joinRoom={() => {}} createRoom={() => {}} errortext={""} />
  );
  const instance = wrapper.instance();

  const FakeHandler = jest.spyOn(instance, "changeHandler");

  const changeEvent = { target: { name: "roomname", value: "ABCD" } };
  instance.roomnameHandler(changeEvent);

  expect(FakeHandler).toHaveBeenCalled();
});

// ------------------
// playernameHandler
// ------------------

test(filename + " playernameHandler calls changeHandler", () => {
  const wrapper = shallow(
    <Home joinRoom={() => {}} createRoom={() => {}} errortext={""} />
  );
  const instance = wrapper.instance();

  const FakeHandler = jest.spyOn(instance, "changeHandler");

  const changeEvent = { target: { name: "username", value: "ABCDEFG" } };
  instance.playernameHandler(changeEvent);

  expect(FakeHandler).toHaveBeenCalled();
});

test(filename + " roomChangeHandler changes characters to uppercase", () => {
  const wrapper = shallow(
    <Home joinRoom={() => {}} createRoom={() => {}} errortext={""} />
  );
  const instance = wrapper.instance();

  const newRoom = "azC1";

  const changeEvent = { target: { name: "roomname", value: newRoom } };
  instance.roomnameHandler(changeEvent);

  expect(wrapper.state("roomname")).not.toBe(newRoom);
  expect(wrapper.state("roomname")).toBe(newRoom.toUpperCase());
});

/**************
 * RENDERING
 *************/

test(filename + " Renders loading screen on loading state", () => {
  const wrapper = shallow(
    <Home
      joinRoom={() => {}}
      createRoom={() => {}}
      errortext={""}
      loading={true}
    />
  );
  const instance = wrapper.instance();

  const result = instance.render();

  expect(result.type).toBe("div");
  expect(result.props.children).toContainEqual(
    <LoadingScreen text="Loading..." />
  );
});

test(
  filename + " Doesn't render loading screen on not loading state",
  () => {
    const wrapper = shallow(
      <Home
        joinRoom={() => {}}
        createRoom={() => {}}
        errortext={""}
        loading={false}
      />
    );
    const instance = wrapper.instance();

    const result = instance.render();

    expect(result.type).toBe("div");
    expect(result.props.children).not.toContainEqual(
      <LoadingScreen text="Loading..." />
    );
  }
);
