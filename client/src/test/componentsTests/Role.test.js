import React, { Component } from "react";
import { mount, EnzymeAdapter, shallow } from "enzyme";
import axios from "axios";
import enzyme from "enzyme";
import Role from "../../components/Role";
import Adapter from "enzyme-adapter-react-16";

const filename = "Role.js";
enzyme.configure({ adapter: new Adapter() });
jest.mock("axios");

// ===============
// FUNCTION
// ===============
test(filename + " invokes componentDidMount when mounted", () => {
    const mount = jest.spyOn(Role.prototype, "componentDidMount");
    shallow(<Role />);
    expect(mount).toHaveBeenCalled();
});

test(filename + " invokes componentWillUnmount", () => {
    const mount = jest.spyOn(Role.prototype, "componentWillUnmount");
    const wrapper = shallow(<Role />);
    wrapper.unmount();
    expect(mount).toHaveBeenCalled();
});

test(filename + " pollRoom function call from componentDidMount", () => {
    jest.useFakeTimers();
    const mockPoll = jest.fn(() => {});
    const wrapper = shallow(<Role pollRoom={mockPoll} />);
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
    const mockPoll = jest.fn(() => {});
    const wrapper = shallow(<Role pollRoom={mockPoll}/>);
    const instance = wrapper.instance();
    instance.pollRoom = mockPoll;
    jest.runOnlyPendingTimers();
    expect(setInterval).toHaveBeenCalled();
});

test(filename + " clearInterval() should be called on componentWillUnmount", () => {
    jest.useFakeTimers();
    const wrapper = shallow(<Role />);
    wrapper.unmount();
    expect(clearInterval).toHaveBeenCalled();
});