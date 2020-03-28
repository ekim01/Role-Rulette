import React, { Component } from "react";
import { mount, EnzymeAdapter, shallow } from "enzyme";
import axios from "axios";
import enzyme from "enzyme";
import Role from "../../components/Role";
import Adapter from "enzyme-adapter-react-16";
import LoadingScreen from "../../components/presentation/loadscreen";

const filename = "Role.js";
enzyme.configure({ adapter: new Adapter() });
jest.mock("axios");

// ===============
// FUNCTIONS
// ===============

test(filename + " invokes componentDidMount when mounted", () => {
  const mount = jest.spyOn(Role.prototype, "componentDidMount");
  shallow(<Role setLoadingFinish={() => { }} />);
  expect(mount).toHaveBeenCalled();
});

test(filename + " invokes componentWillUnmount", () => {
  const mount = jest.spyOn(Role.prototype, "componentWillUnmount");
  const wrapper = shallow(<Role setLoadingFinish={() => { }} />);
  wrapper.unmount();
  expect(mount).toHaveBeenCalled();
});

test(filename + " pollRoom function call from componentDidMount", () => {
  jest.useFakeTimers();
  const mockPoll = jest.fn(() => { });
  const wrapper = shallow(<Role setLoadingFinish={() => { }} pollRoom={mockPoll} />);
  const instance = wrapper.instance();
  instance.pollRoom = mockPoll;
  jest.advanceTimersByTime(6000);
  expect(mockPoll).toHaveBeenCalled();
});

// ===============
// TIMER CALLS
// ===============

test(filename + " setInterval() should be called on componentDidMount", () => {
  jest.useFakeTimers();
  const mockPoll = jest.fn(() => { });
  const wrapper = shallow(<Role setLoadingFinish={() => { }} pollRoom={mockPoll} />);
  const instance = wrapper.instance();
  instance.pollRoom = mockPoll;
  jest.runOnlyPendingTimers();
  expect(setInterval).toHaveBeenCalled();
});

test(filename + " clearInterval() should be called on componentWillUnmount", () => {
  jest.useFakeTimers();
  const wrapper = shallow(<Role setLoadingFinish={() => { }} />);
  wrapper.unmount();
  expect(clearInterval).toHaveBeenCalled();
});

/**************
 * RENDERING
 *************/

test(filename + " Renders loading screen on loading state", () => {
  const wrapper = shallow(
    <Role
      setLoadingFinish={() => { }}
      roleName={""}
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
  filename + " Doesen't render loading screen on not loading state", () => {
    const wrapper = shallow(
      <Role
        setLoadingFinish={() => { }}
        roleName={"Test"}
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