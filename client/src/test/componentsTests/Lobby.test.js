import React from "react";
import { mount, EnzymeAdapter, shallow } from "enzyme";
import axios from "axios";
import enzyme from "enzyme";
import Lobby from "../../components/Lobby";
import Adapter from "enzyme-adapter-react-16";
import LoadingScreen from "../../components/presentation/loadscreen";

const filename = "Lobby.js";

jest.mock("axios");
enzyme.configure({ adapter: new Adapter() });

// ==================================
// FUNCTIONS
// ==================================

test(filename + " invokes componentDidMount when mounted", () => {
  const mount = jest.spyOn(Lobby.prototype, "componentDidMount");
  shallow(<Lobby players={[]} room={{}} errortext={""} />);
  expect(mount).toHaveBeenCalled();
});

test(filename + " invokes componentWillUnmount", () => {
  const mount = jest.spyOn(Lobby.prototype, "componentWillUnmount");
  const wrapper = shallow(<Lobby players={[]} room={{}} errortext={""} />);
  wrapper.unmount();
  expect(mount).toHaveBeenCalled();
});

test(filename + " pollRoom function call from componentDidMount", () => {
  jest.useFakeTimers();
  const mockPoll = jest.fn(() => { });
  const wrapper = shallow(<Lobby pollRoom={mockPoll} players={[]} room={{}} errortext={""} />);
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
  const wrapper = shallow(<Lobby pollRoom={mockPoll} players={[]} room={{}} errortext={""} />);
  const instance = wrapper.instance();
  instance.pollRoom = mockPoll;
  jest.runOnlyPendingTimers();
  expect(setInterval).toHaveBeenCalled();
});

test(filename + " clearInterval() should be called on componentWillUnmount", () => {
  jest.useFakeTimers();
  const wrapper = shallow(<Lobby players={[]} room={{}} errortext={""} />);
  wrapper.unmount();
  expect(clearInterval).toHaveBeenCalled();
});

// ------------------
// startGame
// ------------------

test(
  filename + " startGame sets errortext on role distribution failure due to incorrect amount of players",
  async () => {
    const mockErrorText = jest.fn((text) => (text))
    const etext = "Incorrect amount of players required to start game.";

    axios.put.mockRejectedValue({
      response: {
        status: 418
      }
    });

    const wrapper = shallow(<Lobby setErrorText={mockErrorText} setLoadingStart={() => { }} setLoadingFinish={() => { }} players={[]} room={{}} errortext={""} />);
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

    const wrapper = shallow(<Lobby setErrorText={mockErrorText} setLoadingStart={() => { }} setLoadingFinish={() => { }} players={[]} room={{}} errortext={""} />);
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

    const wrapper = shallow(<Lobby setErrorText={mockErrorText} setLoadingStart={() => { }} setLoadingFinish={() => { }} players={[]} room={{}} errortext={""} />);
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

    const wrapper = shallow(<Lobby setErrorText={mockErrorText} setLoadingStart={() => { }} setLoadingFinish={() => { }} players={[]} room={{}} errortext={""} />);
    const instance = wrapper.instance();

    await instance.startGame();
    await instance.startGame();

    expect(mockErrorText.mock.calls[0][0]).toBe(etext);
  }
);

test(
  filename + " startGame calls pollRoom on role distribution success",
  async () => {
    const mockPoll = jest.fn((text) => (text))

    axios.put.mockResolvedValue({
      response: {
        status: 200
      }
    });

    const wrapper = shallow(<Lobby pollRoom={mockPoll} setLoadingStart={() => { }} setLoadingFinish={() => { }} loading={false} players={[]} room={{}} errortext={""} />);
    const instance = wrapper.instance();

    await instance.startGame();
    await instance.startGame();

    // verifies setLoadingStart was called with no parameter
    expect(mockPoll.mock.calls[0][0]).toBe(undefined);
  }
);

// ------------------
// gameChangeHandler
// ------------------

test(
  filename + " gameChangeHandler sets errortext on game change failure due to selected game not having a corresponding object in database",
  async () => {
    const mockErrorText = jest.fn((text) => (text))
    const etext = "Game with the selected title has not been created; please select a different game.";

    axios.put.mockRejectedValue({
      response: {
        status: 404
      }
    });

    const wrapper = shallow(<Lobby setErrorText={mockErrorText} setLoadingStart={() => { }} setLoadingFinish={() => { }} players={[]} room={{}} errortext={""} />);
    const instance = wrapper.instance();

    const changeEvent = { target: { name: "Test Game", value: "Test Game" } };
    await instance.gameChangeHandler(changeEvent);
    await instance.gameChangeHandler(changeEvent);

    // only one call made to mocked function and it will have our data
    expect(mockErrorText.mock.calls[0][0]).toBe(etext);
  }
);

test(
  filename + " gameChangeHandler sets errortext on game change failure due to Internal Server Error",
  async () => {
    const mockErrorText = jest.fn((text) => (text))
    const etext = "Internal Server Error.";

    axios.put.mockRejectedValue("Test Error");

    const wrapper = shallow(<Lobby setErrorText={mockErrorText} setLoadingStart={() => { }} setLoadingFinish={() => { }} players={[]} room={{}} errortext={""} />);
    const instance = wrapper.instance();

    const changeEvent = { target: { name: "Test Game", value: "Test Game" } };
    await instance.gameChangeHandler(changeEvent);
    await instance.gameChangeHandler(changeEvent);

    expect(mockErrorText.mock.calls[0][0]).toBe(etext);
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

    const wrapper = shallow(<Lobby setGame={mockGame} setLoadingStart={() => { }} setLoadingFinish={() => { }} players={[]} room={{}} errortext={""} />);
    const instance = wrapper.instance();

    const changeEvent = { target: { name: "Test Game", value: "Test Game" } };
    await instance.gameChangeHandler(changeEvent);
    await instance.gameChangeHandler(changeEvent);

    expect(mockGame.mock.calls[0][0]).toBe(game);
  }
);

/**************
 * RENDERING
 *************/

test(filename + " Renders loading screen on loading state", () => {
  const pList = [{ user: "Hi", key: "121312312" }];
  const wrapper = shallow(
    <Lobby
      hostName={""}
      roomName={""}
      players={pList}
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
    const pList = [{ user: "Hi", key: "121312312" }];
    const wrapper = shallow(
      <Lobby
        hostName={""}
        roomName={""}
        players={pList}
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