import React, { Component } from "react";
import { mount, EnzymeAdapter, shallow } from "enzyme";
import axios from "axios";
import enzyme from "enzyme";
import EndScreen from "../../components/EndScreen";
import Adapter from "enzyme-adapter-react-16";

const filename = "EndScreen.js";
enzyme.configure({ adapter: new Adapter() });

// ===============
// STATE
// ===============

// [Role contains no unique state]

// ===============
// FUNCTION
// ===============

test(filename + " backHandler should call setpage", () => {
  const mocksetPage = jest.fn(() => {});
  const wrapper = shallow(<EndScreen setPage={mocksetPage} />);
  const instance = wrapper.instance();
  instance.backHandler();
  expect(mocksetPage).toBeCalledTimes(1);
});
