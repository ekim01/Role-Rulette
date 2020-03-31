const filename = "App.js";

import React from "react";
import * as axios from "axios";
import ShallowRenderer from "react-test-renderer/shallow";
import { shallow, mount } from "enzyme";
import enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { create } from "react-test-renderer";
import Role from "../components/Role";
import Home from "../components/Home";
import Lobby from "../components/Lobby";
import EndScreen from "../components/EndScreen";
import App from "../App";

enzyme.configure({ adapter: new Adapter() });
jest.mock("axios");

/***************************
 * STATE INITIALIZATION
 ***************************/

test(filename + " user state initializes to null", () => {
  const wrapper = shallow(<App />);
  expect(wrapper.state("user")).toEqual({});
});
test(filename + " roleName initializes to null", () => {
  const wrapper = shallow(<App />);
  expect(wrapper.state("roleName")).toBe("");
});
test(filename + " roleDesc initializes to null", () => {
  const wrapper = shallow(<App />);
  expect(wrapper.state("roleDesc")).toBe("");
});
test(filename + " goalDesc initializes to null", () => {
  const wrapper = shallow(<App />);
  expect(wrapper.state("goalDesc")).toBe("");
});
test(filename + " players state initializes to null", () => {
  const wrapper = shallow(<App />);
  expect(wrapper.state("players")).toStrictEqual([]);
});
test(filename + " roomname state initializes to null", () => {
  const wrapper = shallow(<App />);
  expect(wrapper.state("roomName")).toBe("");
});
test(filename + " hostName state initializes to null", () => {
  const wrapper = shallow(<App />);
  expect(wrapper.state("hostName")).toBe("");
});
test(filename + " redirect state initializes to false", () => {
  const wrapper = shallow(<App />);
  expect(wrapper.state("redirect")).toBe(false);
});
test(filename + " loading state initializes to false", () => {
  const wrapper = shallow(<App />);
  expect(wrapper.state("loading")).toBe(false);
});
test(filename + " errortext state initializes to null", () => {
  const wrapper = shallow(<App />);
  expect(wrapper.state("errortext")).toBe("");
});
test(filename + " page state initializes to Home", () => {
  const wrapper = shallow(<App />);
  expect(wrapper.state("page")).toBe("Home");
});

/***************************
 * STATE CHANGES
 ***************************/

test(filename + " updates state", () => {
  const wrapper = shallow(<App />);
  const instance = wrapper.instance();

  const newPlayer = "Player1";
  const newRoleName = "Role 1";
  const newRoleDesc = "Role 1 Desc";
  const newGoalDesc = "Role 1 Goal Desc";
  const newPlayers = ["Player 1", "Player 2", "Player 3"];
  const newRoom = "ABCD";
  const ahostName = "ABCDEFG";
  const newText = "Error text";
  const newPage = "Lobby";

  instance.setState({ user: newPlayer });
  instance.setState({ roleName: newRoleName });
  instance.setState({ roleDesc: newRoleDesc });
  instance.setState({ goalDesc: newGoalDesc });
  instance.setState({ players: newPlayers });
  instance.setState({ roomName: newRoom });
  instance.setState({ hostName: ahostName });
  instance.setState({ redirect: true });
  instance.setState({ loading: true });
  instance.setState({ errortext: newText });
  instance.setState({ page: newPage });

  expect(wrapper.state("user")).toBe(newPlayer);
  expect(wrapper.state("roleName")).toBe(newRoleName);
  expect(wrapper.state("roleDesc")).toBe(newRoleDesc);
  expect(wrapper.state("goalDesc")).toBe(newGoalDesc);
  expect(wrapper.state("players")).toBe(newPlayers);
  expect(wrapper.state("roomName")).toBe(newRoom);
  expect(wrapper.state("hostName")).toBe(ahostName);
  expect(wrapper.state("redirect")).toBe(true);
  expect(wrapper.state("loading")).toBe(true);
  expect(wrapper.state("errortext")).toBe(newText);
  expect(wrapper.state("page")).toBe(newPage);
});

/******************************
 * SNAPSHOT TESTS & RENDERING
 *****************************/

describe(filename + " Home component", () => {
  test("Matches the snapshot", () => {
    const home = create(
      <Home joinRoom={() => { }} createRoom={() => { }} errortext={""} />
    );
    expect(home.toJSON()).toMatchSnapshot();
  });
});

describe(filename + " Role component", () => {
  test("Matches the snapshot", () => {
    const home = create(
      <Role errortext={""} setLoadingFinish={() => { }} />
    );
    expect(home.toJSON()).toMatchSnapshot();
  });
});

describe(filename + " Lobby component", () => {
  const pList = [{ user: "Hi", key: "121312312" }];
  test("Matches the snapshot", () => {
    const home = create(
      <Lobby hostName={""} roomName={""} players={pList} errortext={""} />
    );
    expect(home.toJSON()).toMatchSnapshot();
  });
});

describe(filename + " EndScreen component", () => {
  const pList = [{ user: "Hi", key: "121312312" }];
  test("Matches the snapshot", () => {
    const home = create(
      <EndScreen players={pList} errortext={""} />
    );
    expect(home.toJSON()).toMatchSnapshot();
  });
});

test(filename + " Renders Home component on Home page state", () => {
  const wrapper = shallow(<App />);
  const instance = wrapper.instance();

  instance.setState({ page: "Home" });

  const result = instance.render();

  expect(result.type).toBe("div");
  expect(result.props.children.type).toBe(Home);
});

test(filename + " Renders Lobby component on Lobby page state", () => {
  const wrapper = shallow(<App />);
  const instance = wrapper.instance();

  instance.setState({ page: "Lobby" });

  const result = instance.render();

  expect(result.type).toBe("div");
  expect(result.props.children.type).toBe(Lobby);
});

test(filename + " Renders Role component on Role page state", () => {
  const wrapper = shallow(<App />);
  const instance = wrapper.instance();

  instance.setState({ page: "Role" });

  const result = instance.render();

  expect(result.type).toBe("div");
  expect(result.props.children.type).toBe(Role);
});

test(filename + " Renders EndScreen component on EndScreen page state", () => {
  const wrapper = shallow(<App />);
  const instance = wrapper.instance();

  instance.setState({ page: "EndScreen" });

  const result = instance.render();

  expect(result.type).toBe("div");
  expect(result.props.children.type).toBe(EndScreen);
});

test(filename + " Renders error message on no page state", () => {
  const wrapper = shallow(<App />);
  const instance = wrapper.instance();

  instance.setState({ page: "errrrorrrrr" });

  const result = instance.render();

  expect(result.type).toBe("div");
  expect(result.props.children).toEqual(<h2>An error has occured.</h2>);
});

/*********************
 * FUNCTIONS
 ********************/

test(filename + " setLoadingStart sets errortext state to empty", () => {
  const wrapper = shallow(<App />);
  const instance = wrapper.instance();

  const newText = "Error text";
  instance.setState({ errortext: newText });
  instance.setLoadingStart();
  expect(wrapper.state("errortext").length).toBe(0);
});

test(filename + " setLoadingStart sets loading state to true", () => {
  const wrapper = shallow(<App />);
  const instance = wrapper.instance();

  instance.setState({ loading: false });
  instance.setLoadingStart();
  expect(wrapper.state("loading")).toEqual(true);
});

test(filename + " setLoadingFinish sets loading state to false", () => {
  const wrapper = shallow(<App />);
  const instance = wrapper.instance();

  instance.setState({ loading: true });
  instance.setLoadingFinish();
  expect(wrapper.state("loading")).toEqual(false);
});

test(filename + " setErrorText sets errortext state", () => {
  const wrapper = shallow(<App />);
  const instance = wrapper.instance();

  const text = "Error text";
  instance.setState({ errortext: text });
  instance.setErrorText("New Error Text");
  expect(wrapper.state("errortext")).toEqual("New Error Text");
});

test(filename + " setPage sets page state", () => {
  const wrapper = shallow(<App />);
  const instance = wrapper.instance();

  instance.setState({ page: "Home" });
  instance.setPage("Lobby");
  expect(wrapper.state("page")).toEqual("Lobby");
});

test(filename + " setGame sets nested game object in room state", () => {
  const wrapper = shallow(<App />);
  const instance = wrapper.instance();

  const text = "Error text";
  instance.setState({ room: { game: null } });
  instance.setGame({});
  expect(wrapper.state("room")).toEqual({ game: {} });
});

test(
  filename +
  " on joining, when username and roomname empty, errortext is /'Please complete all fields/'",
  () => {
    const wrapper = shallow(<App />);
    const instance = wrapper.instance();

    const nameText = "";
    const roomText = "";
    instance.joinRoom(roomText, nameText);
    expect(wrapper.state("errortext")).toBe("Please complete all fields");
  }
);

test(
  filename +
  " on joining, when username empty, errortext is /'Please enter a name/'",
  () => {
    const wrapper = shallow(<App />);
    const instance = wrapper.instance();

    const nameText = "";
    const roomText = "room";
    instance.joinRoom(roomText, nameText);
    expect(wrapper.state("errortext")).toEqual("Please enter a name");
  }
);

test(
  filename +
  " on joining, when username has only spaces, errortext is /'The name can't be only spaces/'",
  () => {
    const wrapper = shallow(<App />);
    const instance = wrapper.instance();

    const nameText = "    ";
    const roomText = "room";
    instance.joinRoom(roomText, nameText);
    expect(wrapper.state("errortext")).toEqual("The name can't be only spaces");
  }
);

test(
  filename +
  " on joining, when roomname empty, errortext is /'Please complete all fields/'",
  () => {
    const wrapper = shallow(<App />);
    const instance = wrapper.instance();

    const nameText = "name";
    const roomText = "";
    instance.joinRoom(roomText, nameText);
    expect(wrapper.state("errortext")).toEqual("Please complete all fields");
  }
);

test(
  filename +
  " on joining, when roomname not 4 characters, errortext is /'Invalid room code/'",
  () => {
    const wrapper = shallow(<App />);
    const instance = wrapper.instance();

    const nameText = "name";
    const roomText = "ro";
    instance.joinRoom(roomText, nameText);
    expect(wrapper.state("errortext")).toEqual("Invalid room code");
  }
);

test(
  filename +
  " on createroom, when username empty, errortext is /'Please enter a name/'",
  () => {
    const wrapper = shallow(<App />);
    const instance = wrapper.instance();

    const nameText = "";
    instance.createRoom(nameText);
    expect(wrapper.state("errortext")).toEqual("Please enter a name");
  }
);

test(
  filename +
  " on createroom, when username has only spaces, errortext is /'The name can't be only spaces/'",
  () => {
    const wrapper = shallow(<App />);
    const instance = wrapper.instance();

    const nameText = "    ";
    instance.createRoom(nameText);
    expect(wrapper.state("errortext")).toEqual("The name can't be only spaces");
  }
);

/******************
 * SUBCOMPONENTS
 ******************/

test(filename + " joinRoom is passed to Home component", () => {
  const mockJoin = jest.fn(() => { });
  const wrapper = shallow(<Home joinRoom={mockJoin} createRoom={() => { }} />);
  const instance = wrapper.instance();
  instance.props.joinRoom();
  expect(mockJoin).toBeCalledTimes(1);
});

test(filename + " createRoom is passed to Home component", () => {
  const mockCreate = jest.fn(() => { });
  const wrapper = shallow(<Home createRoom={mockCreate} joinRoom={() => { }} />);
  const instance = wrapper.instance();
  instance.props.createRoom();
  expect(mockCreate).toBeCalledTimes(1);
});

test(filename + " errortext is passed to Home component", () => {
  const emptyFunc = () => { };
  const text = "error";

  const wrapper = shallow(<App />);
  const instance = wrapper.instance();
  instance.setState({ errortext: text });

  const Hwrapper = shallow(
    <Home
      createRoom={emptyFunc}
      joinRoom={emptyFunc}
      errortext={wrapper.state("errortext")}
    />
  );
  const Hinstance = Hwrapper.instance();
  expect(Hinstance.props.errortext).toEqual(text);
});

test(filename + " loading is passed to Home component", () => {
  const emptyFunc = () => { };
  const wrapper = shallow(<App />);
  const instance = wrapper.instance();
  instance.setState({ loading: true });

  const Hwrapper = shallow(
    <Home
      createRoom={emptyFunc}
      joinRoom={emptyFunc}
      loading={wrapper.state("loading")}
    />
  );
  const Hinstance = Hwrapper.instance();
  expect(Hinstance.props.loading).toEqual(true);
});

test(filename + " errortext is passed to Lobby component", () => {
  const emptyFunc = () => { };
  const text = "error";

  const wrapper = shallow(<App />);
  const instance = wrapper.instance();
  instance.setState({ errortext: text });

  const Hwrapper = shallow(
    <Lobby errortext={wrapper.state("errortext")} players={[]} />
  );
  const Hinstance = Hwrapper.instance();
  expect(Hinstance.props.errortext).toEqual(text);
});

test(filename + " hostName is passed to Lobby component", () => {
  const emptyFunc = () => { };
  const name = "P1";

  const wrapper = shallow(<App />);
  const instance = wrapper.instance();
  instance.setState({ hostName: name });

  const Hwrapper = shallow(
    <Lobby hostName={wrapper.state("hostName")} players={[]} />
  );
  const Hinstance = Hwrapper.instance();
  expect(Hinstance.props.hostName).toEqual(name);
});

test(filename + " roomName is passed to Lobby component", () => {
  const emptyFunc = () => { };
  const room = "1234";

  const wrapper = shallow(<App />);
  const instance = wrapper.instance();
  instance.setState({ roomName: room });

  const Hwrapper = shallow(
    <Lobby roomName={wrapper.state("roomName")} players={[]} />
  );
  const Hinstance = Hwrapper.instance();
  expect(Hinstance.props.roomName).toEqual(room);
});

test(filename + " Players is passed to Lobby component", () => {
  const emptyFunc = () => { };
  const ps = [{ name: "P1" }, { name: "P2" }];

  const wrapper = shallow(<App />);
  const instance = wrapper.instance();
  instance.setState({ players: ps });

  const Hwrapper = shallow(<Lobby players={wrapper.state("players")} />);
  const Hinstance = Hwrapper.instance();
  expect(Hinstance.props.players).toEqual(ps);
});

/**********************
 *  FUNCTIONS
 **********************/

test(filename + " joinRoom sets state on success", async () => {
  const froomCode = "ABCD";
  const fuser = "ME";
  const fHost = "host1name";
  const fplayers = [{ name: fHost }, { name: fuser }];

  await axios.post.mockResolvedValue({
    status: 200,
    data: {
      name: fuser
    }
  });

  await axios.get.mockResolvedValue({
    status: 200,
    data: {
      roomCode: froomCode,
      players: fplayers
    }
  });

  const wrapper = shallow(<App />);
  const instance = wrapper.instance();

  // Must run await twice
  await instance.joinRoom(froomCode, fuser);
  await instance.joinRoom(froomCode, fuser);

  expect(wrapper.state("roomName")).toBe(froomCode);
  expect(wrapper.state("hostName")).toBe(fHost);
  expect(wrapper.state("players")).toBe(fplayers);
  expect(wrapper.state("user")).toEqual({ name: fuser });
  expect(wrapper.state("page")).toBe("Lobby");
  expect(wrapper.state("loading")).toBe(false);
});

test(filename + " joinRoom sets errortext on room not found", async () => {
  const etext = "Room not found.";

  axios.post.mockRejectedValue({
    response: {
      status: 404
    }
  });

  const wrapper = shallow(<App />);
  const instance = wrapper.instance();

  await instance.joinRoom("1234", "Player 1");
  await instance.joinRoom("1234", "Player 1");

  expect(wrapper.state("errortext")).toBe(etext);
  expect(wrapper.state("loading")).toBe(false);
});

test(filename + " joinRoom sets errortext on joining room with duplicate name", async () => {
  const etext = "Name already in use.";

  axios.post.mockRejectedValue({
    response: {
      status: 418
    }
  });

  const wrapper = shallow(<App />);
  const instance = wrapper.instance();

  await instance.joinRoom("1234", "Player 1");
  await instance.joinRoom("1234", "Player 1");

  expect(wrapper.state("errortext")).toBe(etext);
  expect(wrapper.state("loading")).toBe(false);
});

test(
  filename + " joinRoom sets errortext on room join failed with response",
  async () => {
    const etext = "Error joining room; please try again.";

    axios.post.mockRejectedValue({
      response: {
        status: 500
      }
    });

    const wrapper = shallow(<App />);
    const instance = wrapper.instance();

    await instance.joinRoom("1234", "Player 1");
    await instance.joinRoom("1234", "Player 1");

    expect(wrapper.state("errortext")).toBe(etext);
    expect(wrapper.state("loading")).toBe(false);
  }
);

test(
  filename + " joinRoom sets errortext on room join failed with response",
  async () => {
    const etext = "Internal Server Error.";

    axios.post.mockRejectedValue("Test Error");

    const wrapper = shallow(<App />);
    const instance = wrapper.instance();

    await instance.joinRoom("1234", "Player 1");
    await instance.joinRoom("1234", "Player 1");

    expect(wrapper.state("errortext")).toBe(etext);
    expect(wrapper.state("loading")).toBe(false);
  }
);

test(filename + " createRoom sets state on success", async () => {
  const froomCode = "ABCD";
  const fuser = "Me";
  const fplayers = [{ name: fuser }];
  const frole = "Empty";

  axios.post.mockResolvedValue({
    status: 200,
    data: {
      roomCode: froomCode,
      hostName: fuser,
      players: fplayers,
      role: frole,
      user: fuser
    }
  });

  const wrapper = shallow(<App />);
  const instance = wrapper.instance();

  await instance.createRoom("Me");

  expect(wrapper.state("roomName")).toBe(froomCode);
  expect(wrapper.state("hostName")).toBe(fuser);
  expect(wrapper.state("players")).toBe(fplayers);
  expect(wrapper.state("role")).toBe(frole);
  expect(wrapper.state("user")).toEqual({ name: fuser });
  expect(wrapper.state("page")).toBe("Lobby");
  expect(wrapper.state("loading")).toBe(false);
});

test(filename + " createRoom sets state on failure", async () => {
  const etext = "Error creating room; please try again.";

  axios.post.mockRejectedValue("Test error");

  const wrapper = shallow(<App />);
  const instance = wrapper.instance();

  await instance.createRoom("Player");
  await instance.createRoom("Player");

  expect(wrapper.state("errortext")).toBe(etext);
  expect(wrapper.state("loading")).toBe(false);
});

test(filename + " pollRoom sets state on success", async () => {
  const froomCode = "ABCD";
  const fuser = "ME";
  const fHost = "host1name";
  const fplayers = [{ name: fHost }, { name: fuser }];
  const froom = {
    players: fplayers,
    roomCode: froomCode,
    user: {
      name: fuser
    }
  };

  axios.get.mockResolvedValue({
    data: {
      roomCode: froomCode,
      players: fplayers,
      user: {
        name: fuser
      }
    }
  });

  const wrapper = shallow(<App />);
  const instance = wrapper.instance();

  await instance.pollRoom();

  expect(wrapper.state("room")).toEqual(froom);
  expect(wrapper.state("players")).toBe(fplayers);
  expect(wrapper.state("user")).toEqual({ name: fHost });
});