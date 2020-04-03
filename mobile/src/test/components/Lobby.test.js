import React from "react";
import { shallow } from "enzyme";
import axios from "axios";
import enzyme from "enzyme";
import Home from "../../components/Home";
import Lobby from "../../components/Lobby";
import Adapter from "enzyme-adapter-react-16";
import {
  SPYFALL_MINPLAYERS,
  SPYFALL_MAXPLAYERS
} from "../../Utilities/constants";

const filename = "Home.js";

jest.mock("axios");
enzyme.configure({ adapter: new Adapter() });

// ===============
// FUNCTION
// ===============

test(filename + " pollRoom function call from componentDidMount", () => {
  jest.useFakeTimers();
  const mockPoll = jest.fn(() => {});
  const wrapper = shallow(<Lobby pollRoom={mockPoll} />);
  const instance = wrapper.instance();
  instance.pollRoom = mockPoll;
  jest.advanceTimersByTime(6000);
  expect(mockPoll).toHaveBeenCalled();
});

test(filename + " invokes componentDidMount when mounted", () => {
  const mount = jest.spyOn(Lobby.prototype, "componentDidMount");
  shallow(<Lobby />);
  expect(mount).toHaveBeenCalled();
});

test(filename + " invokes componentWillUnmount", () => {
  const mount = jest.spyOn(Lobby.prototype, "componentWillUnmount");
  const wrapper = shallow(<Lobby />);
  wrapper.unmount();
  expect(mount).toHaveBeenCalled();
});

// ===============
// STATE
// ===============

test(filename + " loading state initializes to false", () => {
  const wrapper = shallow(<Lobby />);
  expect(wrapper.state("loading")).toBe(false);
});

test(filename + " errortext state initializes to null", () => {
  const wrapper = shallow(<Lobby />);
  expect(wrapper.state("errortext")).toBe("");
});

test(filename + " descriptionVisible state initializes to false", () => {
  const wrapper = shallow(<Lobby />);
  expect(wrapper.state("descriptionVisible")).toBe(false);
});

// ==================================
// FUNCTIONS
// ==================================

/*

test(
  filename + " startGame sets errortext on role distribution failure due to incorrect amount of players",
  async () => {
    const mockErrorText = jest.fn((text) => (text))
    const etext = "Incorrect amount of players required to start game; please have " +  SPYFALL_MINPLAYERS + "-" + SPYFALL_MAXPLAYERS + " players.";

    axios.put.mockRejectedValue({
      response: {
        status: 418
      }
    });

    const wrapper = shallow(<Lobby setErrorText={mockErrorText} players={[]} room={{}} errortext={""}/>);
    const instance = wrapper.instance();

    await instance.startGame();
    await instance.startGame();
    
    // only one call made to mocked function and it will have our data
    expect(mockErrorText.mock.calls[0][0]).toBe(etext);
  }
);

test(
  filename + " startGame sets errortext on role distribution failure due to no distribution rules for selected game",
  async () => {
    const mockErrorText = jest.fn((text) => (text))
    const etext = "Game distribution rules have not been created; please select a different game.";

    axios.put.mockRejectedValue({
      response: {
        status: 404
      }
    });

    const wrapper = shallow(<Lobby setErrorText={mockErrorText} players={[]} room={{}} errortext={""}/>);
    const instance = wrapper.instance();

    await instance.startGame();
    await instance.startGame();
    
    expect(mockErrorText.mock.calls[0][0]).toBe(etext);
  }
);

test(
  filename + " startGame sets errortext on role distribution failure due to no game selected",
  async () => {
    const mockErrorText = jest.fn((text) => (text))
    const etext = "No game selected; please select a game.";

    axios.put.mockRejectedValue({
      response: {
        status: 400
      }
    });

    const wrapper = shallow(<Lobby setErrorText={mockErrorText} players={[]} room={{}} errortext={""}/>);
    const instance = wrapper.instance();

    await instance.startGame();
    await instance.startGame();
    
    expect(mockErrorText.mock.calls[0][0]).toBe(etext);
  }
);

test(
  filename + " startGame sets errortext on role distribution failure due Internal Server Error",
  async () => {
    const mockErrorText = jest.fn((text) => (text))
    const etext = "Internal Server Error.";

    axios.put.mockRejectedValue("Test Error");

    const wrapper = shallow(<Lobby setErrorText={mockErrorText} players={[]} room={{}} errortext={""}/>);
    const instance = wrapper.instance();

    await instance.startGame();
    await instance.startGame();
    
    expect(mockErrorText.mock.calls[0][0]).toBe(etext);
  }
);

test(
  filename + " startGame sets page on role distribution success",
  async () => {
    const mockPage = jest.fn((text) => (text))
    const pagetext = "Role";

    axios.put.mockResolvedValue({
      response: {
        status: 200
      }
    });

    const wrapper = shallow(<Lobby setPage={mockPage} players={[]} room={{}} errortext={""}/>);
    const instance = wrapper.instance();

    await instance.startGame();
    await instance.startGame();
    
    expect(mockPage.mock.calls[0][0]).toBe(pagetext);
  }
);

*/
