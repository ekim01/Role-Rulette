import React from "react";
import { shallow } from "enzyme";
import axios from "axios";
import enzyme from "enzyme";
import Lobby from "../../components/Lobby";
import Adapter from "enzyme-adapter-react-16";

const filename = "Lobby.js";

enzyme.configure({ adapter: new Adapter() });

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

// ===============
// FUNCTIONS
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

// ------------------
// startHandler
// ------------------

test(
  filename + " startHandler sets errortext on role distribution failure due to incorrect amount of players",
  async () => {
    const mockPersist = jest.fn(() => {})
    const etext = "Incorrect amount of players required to start game.";

    axios.put.mockRejectedValue({
      response: {
        status: 418
      }
    });

    const wrapper = shallow(<Lobby players={[]} room={{}} />);
    const instance = wrapper.instance();

    const changeEvent = { persist: mockPersist };
    instance.setState({ errortext: "Error" });

    await instance.startHandler(changeEvent);
    await instance.startHandler(changeEvent);
    
    expect(wrapper.state("errortext")).toEqual(etext);
  }
);

test(
  filename + " startHandler sets errortext on role distribution failure due to no distribution rules for selected game",
  async () => {
    const mockPersist = jest.fn(() => {})
    const etext = "Game distribution rules have not been created; please select a different game.";

    axios.put.mockRejectedValue({
      response: {
        status: 404
      }
    });

    const wrapper = shallow(<Lobby players={[]} room={{}} />);
    const instance = wrapper.instance();

    const changeEvent = { persist: mockPersist };
    instance.setState({ errortext: "Error" });

    await instance.startHandler(changeEvent);
    await instance.startHandler(changeEvent);
    
    expect(wrapper.state("errortext")).toEqual(etext);
  }
);

test(
  filename + " startHandler sets errortext on role distribution failure due to no game selected",
  async () => {
    const mockPersist = jest.fn(() => {})
    const etext = "No game selected; please select a game.";

    axios.put.mockRejectedValue({
      response: {
        status: 400
      }
    });

    const wrapper = shallow(<Lobby players={[]} room={{}} />);
    const instance = wrapper.instance();

    const changeEvent = { persist: mockPersist };
    instance.setState({ errortext: "Error" });

    await instance.startHandler(changeEvent);
    await instance.startHandler(changeEvent);
    
    expect(wrapper.state("errortext")).toEqual(etext);
  }
);

test(
  filename + " startHandler sets errortext on role distribution failure due Internal Server Error",
  async () => {
    const mockPersist = jest.fn(() => {})
    const etext = "Internal Server Error.";

    axios.put.mockRejectedValue("Test Error");

    const wrapper = shallow(<Lobby players={[]} room={{}} />);
    const instance = wrapper.instance();

    const changeEvent = { persist: mockPersist };
    instance.setState({ errortext: "Error" });

    await instance.startHandler(changeEvent);
    await instance.startHandler(changeEvent);
    
    expect(wrapper.state("errortext")).toEqual(etext);
  }
);

test(
  filename + " startHandler calls pollRoom on role distribution success",
  async () => {
    const mockPersist = jest.fn(() => {})
    const mockPoll = jest.fn((text) => (text))

    axios.put.mockResolvedValue({
      response: {
        status: 200
      }
    });

    const wrapper = shallow(<Lobby pollRoom={mockPoll} players={[]} room={{}} />);
    const instance = wrapper.instance();

    const changeEvent = { persist: mockPersist };

    await instance.startHandler(changeEvent);
    await instance.startHandler(changeEvent);
    
    // verifies pollRoom was called with no parameter
    expect(mockPoll.mock.calls[0][0]).toBe(undefined);
  }
);

// ------------------
// gameChangeHandler
// ------------------

test(
  filename + " gameChangeHandler sets errortext on game change failure due to selected game not having a corresponding object in database",
  async () => {
    const etext = "Game with the selected title has not been created; please select a different game.";

    axios.put.mockRejectedValue({
      response: {
        status: 404
      }
    });

    const wrapper = shallow(<Lobby players={[]} room={{}} />);
    const instance = wrapper.instance();
    instance.setState({ errortext: "Error" });

    const changeEvent = { target: { name: "Test Game", value: "Test Game" } };
    await instance.gameChangeHandler(changeEvent);
    await instance.gameChangeHandler(changeEvent);

    expect(wrapper.state("errortext")).toEqual(etext);
  }
);

test(
  filename + " gameChangeHandler sets errortext on game change failure due to Internal Server Error",
  async () => {
    const etext = "Internal Server Error.";

    axios.put.mockRejectedValue("Test Error");

    const wrapper = shallow(<Lobby players={[]} room={{}} />);
    const instance = wrapper.instance();
    instance.setState({ errortext: "Error" });

    const changeEvent = { target: { name: "Test Game", value: "Test Game" } };
    await instance.gameChangeHandler(changeEvent);
    await instance.gameChangeHandler(changeEvent);

    expect(wrapper.state("errortext")).toEqual(etext);
  }
);

test(
  filename + " gameChangeHandler sets game on game selection success",
  async () => {
    const mockGame = jest.fn((text) => (text))
    const game = {
      title: "Test Game",
      description: "Test Desc",
      distributionRules: null,
      roles: []
    }

    axios.put.mockResolvedValue({
      status: 200,
      data: game
    });

    const wrapper = shallow(<Lobby setGame={mockGame} players={[]} room={{}} />);
    const instance = wrapper.instance();

    const changeEvent = { target: { name: "Test Game", value: "Test Game" } };
    await instance.gameChangeHandler(changeEvent);
    await instance.gameChangeHandler(changeEvent);

    expect(mockGame.mock.calls[0][0]).toBe(game);
  }
);

// ------------------
// leaveHandler
// ------------------

test(
  filename + " leaveHandler sets page to Home on leave success",
  async () => {
    const mockPage = jest.fn((text) => (text))

    axios.put.mockResolvedValue({
      status: 200
    });

    const wrapper = shallow(<Lobby setPage={mockPage} user={{}} players={[]} room={{}} />);
    const instance = wrapper.instance();

    await instance.leaveHandler();
    await instance.leaveHandler();

    expect(mockPage.mock.calls[0][0]).toBe("Home");
  }
);

test(
  filename + " leaveHandler does not set page on leave failure",
  async () => {
    const mockPage = jest.fn((text) => (text))

    axios.put.mockResolvedValue({
      status: 400
    });

    const wrapper = shallow(<Lobby setPage={mockPage} user={{}} players={[]} room={{}} />);
    const instance = wrapper.instance();

    await instance.leaveHandler();
    await instance.leaveHandler();

    // length of 0 means mock hasn't been called once and thus page is not set
    expect(mockPage.mock.calls.length).toBe(0);
  }
);