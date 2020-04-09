import React from "react";
import renderer, { create } from "react-test-renderer";
import { shallow } from "enzyme";
import axios from "axios";
import enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import App from "./../App";
import Role from "../components/Role";
import Home from "../components/Home";
import Lobby from "../components/Lobby";
import EndScreen from "../components/EndScreen";

/***************************
 * Setup
 ***************************/
const filename = "App.js ";
enzyme.configure({ adapter: new Adapter() });


const fakePoll = jest.fn().mockResolvedValue({ role: "123" });

// Stop Polling intervals from initializing
Role.prototype.componentDidMount = function() {
  return;
};
Lobby.prototype.componentDidMount = function() {
  return;
};

describe("<App />", () => {
  it("has 1 child", () => {
    const tree = renderer.create(<App />).toJSON();
    expect(tree.children.length).toBe(1);
  });
});

it("renders correctly", () => {
  const tree = renderer.create(<App />).toJSON();
  expect(tree).toMatchSnapshot();
});

/***************************
 * STATE INITIALIZATION
 ***************************/

test(filename + " user state initializes to null", () => {
  const wrapper = shallow(<App />);
  expect(wrapper.state("user")).toEqual({});
});
test(filename + " room state initializes to null", () => {
  const wrapper = shallow(<App />);
  expect(wrapper.state("room")).toEqual({});
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
test(filename + " errortext state initializes to null", () => {
  const wrapper = shallow(<App />);
  expect(wrapper.state("errortext")).toBe("");
});
test(filename + " page state initializes to Home", () => {
  const wrapper = shallow(<App />);
  expect(wrapper.state("page")).toBe("Home");
});
test(filename + " roleName state initializes to false", () => {
  const wrapper = shallow(<App />);
  expect(wrapper.state("roleName")).toBe("");
});
test(filename + " roleDesc state initializes to false", () => {
  const wrapper = shallow(<App />);
  expect(wrapper.state("roleDesc")).toBe("");
});

test(filename + " goalDesc state initializes to false", () => {
  const wrapper = shallow(<App />);
  expect(wrapper.state("goalDesc")).toBe("");
});

/***************************
 * STATE CHANGES
 ***************************/

test(filename + " updates state", () => {
  const wrapper = shallow(<App />);
  const instance = wrapper.instance();

  const newRoom = { name: "ABCD" };
  const newroomName = newRoom.name;
  const newPlayer = { name: "Player1" };
  const newRole = "Role 1";
  const newRoleDesc = "Do the thing";
  const newGoalDesc = "Do it";
  const newPlayers = ["Player 1", "Player 2", "Player 3"];
  const ahostName = "ABCDEFG";
  const newText = "Error text";
  const newPage = "Lobby";

  instance.setState({ room: newRoom });
  instance.setState({ user: newPlayer });
  instance.setState({ roleName: newRole });
  instance.setState({ roleDesc: newRoleDesc });
  instance.setState({ goalDesc: newGoalDesc });
  instance.setState({ players: newPlayers });
  instance.setState({ roomName: newroomName });
  instance.setState({ hostName: ahostName });
  instance.setState({ errortext: newText });
  instance.setState({ page: newPage });

  expect(wrapper.state("room")).toBe(newRoom);
  expect(wrapper.state("user")).toBe(newPlayer);
  expect(wrapper.state("roleName")).toBe(newRole);
  expect(wrapper.state("roleDesc")).toBe(newRoleDesc);
  expect(wrapper.state("goalDesc")).toBe(newGoalDesc);
  expect(wrapper.state("players")).toBe(newPlayers);
  expect(wrapper.state("roomName")).toBe(newroomName);
  expect(wrapper.state("hostName")).toBe(ahostName);
  expect(wrapper.state("errortext")).toBe(newText);
  expect(wrapper.state("page")).toBe(newPage);
});

/******************************
 * SNAPSHOT TESTS & RENDERING
 *****************************/

describe(filename + " Home component", () => {
  test("Matches the snapshot", () => {
    const home = create(
      <Home setHomeName={() => {}} setPlayers={() => {}} setRole={() => {}} setRoomName={() => {}} 
        setUser={() => {}} setPage={() => {}} setRoom={() => {}} />
    ).toJSON();
    expect(home).toMatchSnapshot();
  });
});

const fakeRoom = { game: { title: "" } };
const fakeUser = { name: "test"}
describe(filename + " Role component", () => {
  const pList = [{ user: "Hi", key: "121312312" }];
  test("Matches the snapshot", () => {
    const role = create(
      <Role 
        hostName={""}
        roomName={""}
        players={pList}
        room={fakeRoom}
        user={fakeUser}
        pollRoom={fakePoll}
        setPage={() => {}}
        setErrorText={() => {}}
        roleName={""}
        roleDesc={""}
        goalDesc={""}
      />
      )
      .toJSON();
    expect(role).toMatchSnapshot();
  });
});


describe(filename + " Lobby component", () => {
  const pList = [{ user: "Hi", key: "121312312" }];
  test("Matches the snapshot", () => {
    const lobby = renderer
      .create(
        <Lobby
          hostName={""}
          roomName={""}
          players={pList}
          room={fakeRoom}
          user={fakeUser}
          pollRoom={fakePoll}
          setPage={() => {}}
          setGame={() => {}}
          setErrorText={() => {}}
        />
      )
      .toJSON();
    expect(lobby).toMatchSnapshot();
  });
});

describe(filename + " EndScreen component", () => {
  const pList = [{ name: "name", role: {name: "roleName"}}];
  test("Matches the snapshot", () => {
    const end = renderer
      .create(
        <EndScreen
          players={pList}
          setPage={() => {}}
        />
      )
      .toJSON();
    expect(end).toMatchSnapshot();
  });
});

/*********************
 * FUNCTIONS
 ********************/

test(filename + " setGame sets room game", () => {
  const wrapper = shallow(<App />);
  const instance = wrapper.instance();
  const fgame = { a: "b" };
  instance.setGame(fgame);
  expect(wrapper.state("room").game).toBe(fgame);
});

test(filename + " setRoom sets room state", () => {
  const wrapper = shallow(<App />);
  const instance = wrapper.instance();
  const froom = { a: "b" };
  instance.setRoom(froom);
  expect(wrapper.state("room")).toBe(froom);
});

test(filename + " setPage sets page state", () => {
  const wrapper = shallow(<App />);
  const instance = wrapper.instance();

  instance.setState({ page: "Home" });
  instance.setPage("Lobby");
  expect(wrapper.state("page")).toEqual("Lobby");
});

test(filename + " setUser sets user state", () => {
  const wrapper = shallow(<App />);
  const instance = wrapper.instance();
  const fuser = { a: "b" };
  instance.setUser(fuser);
  expect(wrapper.state("user")).toBe(fuser);
});

const frole = { name: "name", roleDescription: "desc", goalDescription: "goal" };

test(filename + " setRole sets roleName state", () => {
  const wrapper = shallow(<App />);
  const instance = wrapper.instance();
  instance.setState({roleName: "temp"});
  instance.setRole(frole);
  expect(wrapper.state("roleName")).toEqual("name");
});

test(filename + " setRole sets roleDesc state", () => {
  const wrapper = shallow(<App />);
  const instance = wrapper.instance();
  instance.setState({roleDesc: "temp"});
  instance.setRole(frole);
  expect(wrapper.state("roleDesc")).toEqual("desc");
});

test(filename + " setRole sets goalDesc state", () => {
  const wrapper = shallow(<App />);
  const instance = wrapper.instance();
  instance.setState({roleDesc: "temp"});
  instance.setRole(frole);
  expect(wrapper.state("goalDesc")).toEqual("goal");
});

test(filename + " setPlayers sets players state", () => {
  const wrapper = shallow(<App />);
  const instance = wrapper.instance();
  const flist = ["one","two"];
  instance.setState({players: ["temp","array"]});
  instance.setPlayers(flist);
  expect(wrapper.state("players")).toBe(flist);
});

test(filename + " setErrorText sets errortext state", () => {
  const wrapper = shallow(<App />);
  const instance = wrapper.instance();

  const text = "Error text";
  instance.setState({ errortext: text });
  instance.setErrorText("New Error Text");
  expect(wrapper.state("errortext")).toEqual("New Error Text");
});

test(filename + " setHostName sets hostName state", () => {
  const wrapper = shallow(<App />);
  const instance = wrapper.instance();

  instance.setState({ hostName: "Host" });
  instance.setHostName("newHost");
  expect(wrapper.state("hostName")).toEqual("newHost");
});

test(filename + " setRoomName sets roomName state", () => {
  const wrapper = shallow(<App />);
  const instance = wrapper.instance();

  instance.setState({ roomName: "roomName" });
  instance.setRoomName("newRoomName");
  expect(wrapper.state("roomName")).toEqual("newRoomName");
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
  expect(wrapper.state("hostName")).toEqual(fHost);

});

/******************
 * SUBCOMPONENTS
 ******************/

// HOME

test(filename + " setHostName is passed to Home component", () => {
  const mocksetHost = jest.fn(() => {});
  const wrapper = shallow(<Home setHostName={mocksetHost} />);
  const instance = wrapper.instance();
  instance.props.setHostName();
  expect(mocksetHost).toBeCalledTimes(1);
});

test(filename + " setPlayers is passed to Home component", () => {
  const mocksetPlayers = jest.fn(() => {});
  const wrapper = shallow(<Home setPlayers={mocksetPlayers} />);
  const instance = wrapper.instance();
  instance.props.setPlayers();
  expect(mocksetPlayers).toBeCalledTimes(1);
});

test(filename + " setRole is passed to Home component", () => {
  const mocksetRole = jest.fn(() => {});
  const wrapper = shallow(<Home setRole={mocksetRole} />);
  const instance = wrapper.instance();
  instance.props.setRole();
  expect(mocksetRole).toBeCalledTimes(1);
});

test(filename + " setRoomName is passed to Home component", () => {
  const mocksetRN = jest.fn(() => {});
  const wrapper = shallow(<Home setRoomName={mocksetRN} />);
  const instance = wrapper.instance();
  instance.props.setRoomName();
  expect(mocksetRN).toBeCalledTimes(1);
});

test(filename + " setUser is passed to Home component", () => {
  const mocksetUser = jest.fn(() => {});
  const wrapper = shallow(<Home setUser={mocksetUser} />);
  const instance = wrapper.instance();
  instance.props.setUser();
  expect(mocksetUser).toBeCalledTimes(1);
});

test(filename + " setPage is passed to Home component", () => {
  const mocksetPage = jest.fn(() => {});
  const wrapper = shallow(<Home setPage={mocksetPage} />);
  const instance = wrapper.instance();
  instance.props.setPage();
  expect(mocksetPage).toBeCalledTimes(1);
});

test(filename + " setRoom is passed to Home component", () => {
  const mocksetRoom = jest.fn(() => {});
  const wrapper = shallow(<Home setRoom={mocksetRoom} />);
  const instance = wrapper.instance();
  instance.props.setRoom();
  expect(mocksetRoom).toBeCalledTimes(1);
});

test(filename + " setHostName is passed to Home component", () => {
  const mockSetHost = jest.fn(() => {});
  const wrapper = shallow(<Home setHostName={mockSetHost} />);
  const instance = wrapper.instance();
  instance.props.setHostName();
  expect(mockSetHost).toBeCalledTimes(1);
});

// LOBBY

test(filename + " room is passed to Lobby component", () => {
  const emptyFunc = () => {};
  const mockRoom = { name: "Room1", game: "Spyfall" };

  const wrapper = shallow(<App />);
  const instance = wrapper.instance();
  instance.setState({ room: mockRoom });

  const Hwrapper = shallow(<Lobby room={wrapper.state("room")} />);
  const Hinstance = Hwrapper.instance();
  expect(Hinstance.props.room).toEqual(mockRoom);
});

test(filename + " user is passed to Lobby component", () => {
  const mockUser = { name: "P1", role: { description: "spy" } };

  const wrapper = shallow(<App />);
  const instance = wrapper.instance();
  instance.setState({ user: mockUser });

  const Hwrapper = shallow(<Lobby user={wrapper.state("user")} />);
  const Hinstance = Hwrapper.instance();
  expect(Hinstance.props.user).toEqual(mockUser);
});

test(filename + " Players is passed to Lobby component", () => {
  const ps = [{ name: "P1" }, { name: "P2" }];

  const wrapper = shallow(<App />);
  const instance = wrapper.instance();
  instance.setState({ players: ps });

  const Hwrapper = shallow(<Lobby players={wrapper.state("players")} />);
  const Hinstance = Hwrapper.instance();
  expect(Hinstance.props.players).toEqual(ps);
});

test(filename + " setPage is passed to Lobby component", () => {
  const mocksetPage = jest.fn(() => {});
  const wrapper = shallow(<Lobby setPage={mocksetPage} />);
  const instance = wrapper.instance();
  instance.props.setPage();
  expect(mocksetPage).toBeCalledTimes(1);
});

test(filename + " pollRoom is passed to Lobby component", () => {
  const mockpollRoom = jest.fn(() => {});
  const wrapper = shallow(<Lobby pollRoom={mockpollRoom} />);
  const instance = wrapper.instance();
  instance.props.pollRoom();
  expect(mockpollRoom).toBeCalledTimes(1);
});

test(filename + " setGame is passed to Lobby component", () => {
  const mocksetGame = jest.fn(() => {});
  const wrapper = shallow(<Lobby setGame={mocksetGame} />);
  const instance = wrapper.instance();
  instance.props.setGame();
  expect(mocksetGame).toBeCalledTimes(1);
});

test(filename + " setErrorText is passed to Lobby component", () => {
  const mocksetErrorText = jest.fn(() => {});
  const wrapper = shallow(<Lobby setErrorText={mocksetErrorText} />);
  const instance = wrapper.instance();
  instance.props.setErrorText();
  expect(mocksetErrorText).toBeCalledTimes(1);
});

// ROLE

test(filename + " hostName is passed to Role component", () => {
  const mockHN = "Name";
  const wrapper = shallow(<App />);
  const instance = wrapper.instance();
  instance.setState({ hostName: mockHN });

  const Hwrapper = shallow(
    <Role hostName={wrapper.state("hostName")} room={fakeRoom} />
  );
  const Hinstance = Hwrapper.instance();
  expect(Hinstance.props.hostName).toEqual(mockHN);
});

test(filename + " roomName is passed to Role component", () => {
  const mockRMN = "Name";
  const wrapper = shallow(<App />);
  const instance = wrapper.instance();
  instance.setState({ roomName: mockRMN });

  const Hwrapper = shallow(
    <Role roomName={wrapper.state("roomName")} room={fakeRoom} />
  );
  const Hinstance = Hwrapper.instance();
  expect(Hinstance.props.roomName).toEqual(mockRMN);
});

test(filename + " roleName is passed to Role component", () => {
  const mockRN = "Name";
  const wrapper = shallow(<App />);
  const instance = wrapper.instance();
  instance.setState({ roleName: mockRN });

  const Hwrapper = shallow(
    <Role roleName={wrapper.state("roleName")} room={fakeRoom} />
  );
  const Hinstance = Hwrapper.instance();
  expect(Hinstance.props.roleName).toEqual(mockRN);
});

test(filename + " roleDesc is passed to Role component", () => {
  const mockRD = "Desc";
  const wrapper = shallow(<App />);
  const instance = wrapper.instance();
  instance.setState({ roleDesc: mockRD });

  const Hwrapper = shallow(
    <Role roleDesc={wrapper.state("roleDesc")} room={fakeRoom} />
  );
  const Hinstance = Hwrapper.instance();
  expect(Hinstance.props.roleDesc).toEqual(mockRD);
});

test(filename + " goalDesc is passed to Role component", () => {
  const mockGD = "Goal";
  const wrapper = shallow(<App />);
  const instance = wrapper.instance();
  instance.setState({ goalDesc: mockGD });

  const Hwrapper = shallow(
    <Role goalDesc={wrapper.state("goalDesc")} room={fakeRoom} />
  );
  const Hinstance = Hwrapper.instance();
  expect(Hinstance.props.goalDesc).toEqual(mockGD);
});

test(filename + " room is passed to Role component", () => {
  const mockRoom = { name: "Room1", game: { title: "Spyfall" } };

  const wrapper = shallow(<App />);
  const instance = wrapper.instance();
  instance.setState({ room: mockRoom });

  const Hwrapper = shallow(<Role room={wrapper.state("room")} />);
  const Hinstance = Hwrapper.instance();
  expect(Hinstance.props.room).toEqual(mockRoom);
});

test(filename + " user is passed to Role component", () => {
  const mockUser = { name: "P1", role: { description: "spy" } };

  const wrapper = shallow(<App />);
  const instance = wrapper.instance();
  instance.setState({ user: mockUser });

  const Hwrapper = shallow(
    <Role user={wrapper.state("user")} room={fakeRoom} />
  );
  const Hinstance = Hwrapper.instance();
  expect(Hinstance.props.user).toEqual(mockUser);
});

test(filename + " Players is passed to Role component", () => {
  const ps = [{ name: "P1" }, { name: "P2" }];

  const wrapper = shallow(<App />);
  const instance = wrapper.instance();
  instance.setState({ players: ps });

  const Hwrapper = shallow(
    <Role players={wrapper.state("players")} room={fakeRoom} />
  );
  const Hinstance = Hwrapper.instance();
  expect(Hinstance.props.players).toEqual(ps);
});

test(filename + " setPage is passed to Role component", () => {
  const mocksetPage = jest.fn(() => {});
  const wrapper = shallow(<Role setPage={mocksetPage} room={fakeRoom} />);
  const instance = wrapper.instance();
  instance.props.setPage();
  expect(mocksetPage).toBeCalledTimes(1);
});

test(filename + " pollRoom is passed to Role component", () => {
  const mockpollRoom = jest.fn(() => {});
  const wrapper = shallow(<Role pollRoom={mockpollRoom} room={fakeRoom} />);
  const instance = wrapper.instance();
  instance.props.pollRoom();
  expect(mockpollRoom).toBeCalledTimes(1);
});

test(filename + " setErrorText is passed to Role component", () => {
  const mocksetErrorText = jest.fn(() => {});
  const wrapper = shallow(
    <Role setErrorText={mocksetErrorText} room={fakeRoom} />
  );
  const instance = wrapper.instance();
  instance.props.setErrorText();
  expect(mocksetErrorText).toBeCalledTimes(1);
});

// END SCREEN

test(filename + " Players is passed to Endscreen component", () => {
  const ps = [{ name: "P1" }, { name: "P2" }];

  const wrapper = shallow(<App />);
  const instance = wrapper.instance();
  instance.setState({ players: ps });

  const Hwrapper = shallow(<EndScreen players={wrapper.state("players")} />);
  const Hinstance = Hwrapper.instance();
  expect(Hinstance.props.players).toEqual(ps);
});

test(filename + " setPage is passed to Endscreen component", () => {
  const mocksetPage = jest.fn(() => {});
  const wrapper = shallow(<EndScreen setPage={mocksetPage} />);
  const instance = wrapper.instance();
  instance.props.setPage();
  expect(mocksetPage).toBeCalledTimes(1);
});
