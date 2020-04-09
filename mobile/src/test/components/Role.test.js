import React, { Component } from "react";
import { mount, EnzymeAdapter, shallow } from "enzyme";
import axios from "axios";
import enzyme from "enzyme";
import Role from "../../components/Role";
import Adapter from "enzyme-adapter-react-16";

const filename = "Role.js";
enzyme.configure({ adapter: new Adapter() });

// ===============
// STATE
// ===============

// [Role contains no unique state]

// ===============
// FUNCTION
// ===============

const fakeRoom = { game: { title: "" } };
const mockPoll = jest.fn(() => {});

test(filename + " pollRoom function call from componentDidMount", () => {
  jest.useFakeTimers();
  const wrapper = shallow(<Role pollRoom={mockPoll} room={fakeRoom} />);
  const instance = wrapper.instance();
  instance.pollRoom = mockPoll;
  jest.advanceTimersByTime(6000);
  expect(mockPoll).toHaveBeenCalled();
});

test(filename + " invokes componentDidMount when mounted", () => {
  const mount = jest.spyOn(Role.prototype, "componentDidMount");
  shallow(<Role pollRoom={mockPoll} room={fakeRoom} />);
  expect(mount).toHaveBeenCalled();
});

test(filename + " invokes componentWillUnmount", () => {
  const mount = jest.spyOn(Role.prototype, "componentWillUnmount");
  const wrapper = shallow(<Role pollRoom={mockPoll} room={fakeRoom} />);
  wrapper.unmount();
  expect(mount).toHaveBeenCalled();
});

test(
  filename + " endHandler sets page to EndScreen on success",
  async () => {
    const mockPage = jest.fn((text) => (text))

    axios.put.mockResolvedValue({
      status: 200
    });

    const wrapper = shallow(<Role setPage={mockPage} room={fakeRoom}/>);
    const instance = wrapper.instance();

    await instance.endHandler();

    expect(mockPage.mock.calls[0][0]).toBe("EndScreen");
  }
);

test(
  filename + " endHandler sets calls setErrorText",
  async () => {
    const etext = "Internal Server Error.";
    const mockSetErrorText = jest.fn((text) => (text))

    axios.put.mockRejectedValue("Test Error");

    const wrapper = shallow(<Role room={fakeRoom} setErrorText={mockSetErrorText}/>);
    const instance = wrapper.instance();

    await instance.endHandler();

    expect(mockSetErrorText).toHaveBeenCalled();
  }
);

// ===============
// TIMER CALLS
// ===============

test(
  filename + " clearInterval() should be called on componentWillUnmount",
  () => {
    jest.useFakeTimers();
    const wrapper = shallow(<Role pollRoom={mockPoll} room={fakeRoom} />);
    wrapper.unmount();
    expect(clearInterval).toHaveBeenCalled();
  }
);
