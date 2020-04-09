import React from "react";
import { shallow } from "enzyme";
import axios from "axios";
import enzyme from "enzyme";
import Home from "../../components/Home";
import Adapter from "enzyme-adapter-react-16";

import Dialog, { DialogContent } from "react-native-popup-dialog";

const filename = "Home.js";
enzyme.configure({ adapter: new Adapter() });

// ===============
// STATE
// ===============

test(filename + " roomname state initializes to null", () => {
  const wrapper = shallow(<Home />);
  expect(wrapper.state("roomname")).toBe("");
});

test(filename + " username state initializes to null", () => {
  const wrapper = shallow(<Home />);
  expect(wrapper.state("username")).toBe("");
});

test(filename + " loading state initializes to false", () => {
  const wrapper = shallow(<Home />);
  expect(wrapper.state("loading")).toBe(false);
});

test(filename + " errortext state initializes to null", () => {
  const wrapper = shallow(<Home />);
  expect(wrapper.state("errortext")).toBe("");
});

// ==================================
// FUNCTIONS
// ==================================

test(filename + " roomChangeHandler changes characters to uppercase", () => {
  const wrapper = shallow(<Home />);
  const instance = wrapper.instance();

  const newRoom = "azC1";

  instance.roomnameHandler(newRoom);

  expect(wrapper.state("roomname")).not.toBe(newRoom);
  expect(wrapper.state("roomname")).toBe(newRoom.toUpperCase());
});

test(filename + " playernameHandler changes username properly", () => {
  const wrapper = shallow(<Home />);
  const instance = wrapper.instance();

  const newUser = "azC1";

  instance.playernameHandler(newUser);

  expect(wrapper.state("username")).toBe(newUser);
});

test(filename + "When username passed to checkUsername is empty, return is Please enter a name", () => {
  const wrapper = shallow(<Home />);
  const instance = wrapper.instance();

  expect(instance.checkUsername("")).toBe("Please enter a name");
});

test(filename + "When username passed to checkUsername is just spaces, return is Please enter a name", () => {
  const wrapper = shallow(<Home />);
  const instance = wrapper.instance();

  expect(instance.checkUsername("      ")).toBe("The name can't be only spaces");
});

test(filename + " setLoadingState sets errortext state to empty", () => {
  const wrapper = shallow(<Home />);
  const instance = wrapper.instance();

  const newText = "Error text";
  instance.setState({ errortext: newText });
  instance.setLoadingState();
  expect(wrapper.state("errortext").length).toBe(0);
});

test(filename + " setLoadingState sets loading state to true", () => {
  const wrapper = shallow(<Home />);
  const instance = wrapper.instance();

  instance.setState({ loading: false });
  instance.setLoadingState();
  expect(wrapper.state("loading")).toEqual(true);
});

/**************
 * RENDERING
 *************/

describe(
  filename + " Doesn't render loading screen on not loading state",
  () => {
    const wrapper = shallow(<Home loading={false} />);
    const instance = wrapper.instance();

    const result = instance.render();
    expect(result.props.children).not.toContainEqual(
      <Dialog visible={false} />
    );
  }
);

describe(
  filename + " Renders loading screen on loading state",
  () => {
    const wrapper = shallow(<Home loading={true} />);
    const instance = wrapper.instance();

    const result = instance.render();
    expect(result.props.children).not.toContainEqual(
      <Dialog visible={true} />
    );
  }
);

// ------------------
// joinroomHandlerHandler user input
// ------------------

test(
  filename +
  " on joining, when username and roomname empty, errortext is /'Please complete all fields/'",
  () => {
    const mockPersist = jest.fn(() => { })
    const wrapper = shallow(<Home />);
    const instance = wrapper.instance();

    instance.setState({ username: "", roomname: "" });
    const changeEvent = { persist: mockPersist };
    instance.joinroomHandler(changeEvent);
    expect(wrapper.state("errortext")).toBe("Please complete all fields");
  }
);

test(
  filename +
  " on joining, when username empty, errortext is /'Please enter a name/'",
  () => {
    const mockPersist = jest.fn(() => { })
    const wrapper = shallow(<Home />);
    const instance = wrapper.instance();

    instance.setState({ username: "", roomname: "room" });
    const changeEvent = { persist: mockPersist };
    instance.joinroomHandler(changeEvent);
    expect(wrapper.state("errortext")).toEqual("Please enter a name");
  }
);

test(
  filename +
  " on joining, when username has only spaces, errortext is /'The name can't be only spaces/'",
  () => {
    const mockPersist = jest.fn(() => { })
    const wrapper = shallow(<Home />);
    const instance = wrapper.instance();

    instance.setState({ username: "    ", roomname: "room" });
    const changeEvent = { persist: mockPersist };
    instance.joinroomHandler(changeEvent);
    expect(wrapper.state("errortext")).toEqual("The name can't be only spaces");
  }
);

test(
  filename +
  " on joining, when roomname empty, errortext is /'Please complete all fields/'",
  () => {
    const mockPersist = jest.fn(() => { })
    const wrapper = shallow(<Home />);
    const instance = wrapper.instance();

    instance.setState({ username: "name", roomname: "" });
    const changeEvent = { persist: mockPersist };
    instance.joinroomHandler(changeEvent);
    expect(wrapper.state("errortext")).toEqual("Please complete all fields");
  }
);

test(
  filename +
  " on joining, when roomname not 4 characters, errortext is /'Invalid room code/'",
  () => {
    const mockPersist = jest.fn(() => { })
    const wrapper = shallow(<Home />);
    const instance = wrapper.instance();

    instance.setState({ username: "name", roomname: "ro" });
    const changeEvent = { persist: mockPersist };
    instance.joinroomHandler(changeEvent);
    expect(wrapper.state("errortext")).toEqual("Invalid room code");
  }
);

// ------------------
// createroomHandler user input
// ------------------

test(
  filename +
  " on createroom, when username empty, errortext is /'Please enter a name/'",
  () => {
    const mockPersist = jest.fn(() => { })
    const wrapper = shallow(<Home />);
    const instance = wrapper.instance();

    instance.setState({ username: "" });
    const changeEvent = { persist: mockPersist };
    instance.createroomHandler(changeEvent);
    expect(wrapper.state("errortext")).toEqual("Please enter a name");
  }
);

test(
  filename +
  " on createroom, when username has only spaces, errortext is /'The name can't be only spaces/'",
  () => {
    const mockPersist = jest.fn(() => { })
    const wrapper = shallow(<Home />);
    const instance = wrapper.instance();

    instance.setState({ username: "    " });
    const changeEvent = { persist: mockPersist };
    instance.createroomHandler(changeEvent);
    expect(wrapper.state("errortext")).toEqual("The name can't be only spaces");
  }
);

// ------------------
// joinroomHandlerHandler state
// ------------------

test(filename + " joinroomHandler sets state on success", async () => {
  // Setter mocks
  const mockRoomName = jest.fn((text) => (text))
  const mockHostName = jest.fn((text) => (text))
  const mockPlayers = jest.fn((text) => (text))
  const mockUser = jest.fn((text) => (text))
  const mockPage = jest.fn((text) => (text))

  const mockPersist = jest.fn(() => { })
  const froomCode = "ABCD";
  const fuser = "ME";
  const fHost = "host1name";
  const fplayers = [{ name: fHost }, { name: fuser }];

  axios.post.mockResolvedValue({
    status: 200,
    data: {
      name: fuser
    }
  });

  axios.get.mockResolvedValue({
    status: 200,
    data: {
      roomCode: froomCode,
      players: fplayers
    }
  });

  const wrapper = shallow(<Home setRoomName={mockRoomName} setHostName={mockHostName} setPlayers={mockPlayers} setUser={mockUser} setPage={mockPage} />);
  const instance = wrapper.instance();
  instance.setState({ username: fuser, roomname: froomCode });
  const changeEvent = { persist: mockPersist };

  // Must run await twice
  await instance.joinroomHandler(changeEvent);
  await instance.joinroomHandler(changeEvent);

  expect(mockRoomName.mock.calls[0][0]).toBe(froomCode);
  expect(mockHostName.mock.calls[0][0]).toBe(fHost);
  expect(mockPlayers.mock.calls[0][0]).toBe(fplayers);
  expect(mockUser.mock.calls[0][0]).toEqual({ name: fuser });
  expect(mockPage.mock.calls[0][0]).toBe("Lobby");
});

test(filename + " joinroomHandler sets errortext on room not found", async () => {
  const mockPersist = jest.fn(() => {})
  const etext = "Room not found.";

  axios.post.mockRejectedValue({
    response: {
      status: 404
    }
  });

  const wrapper = shallow(<Home />);
  const instance = wrapper.instance();
  instance.setState({ username: "Player 1", roomname: "1234" });
  const changeEvent = { persist: mockPersist };

  await instance.joinroomHandler(changeEvent);

  expect(wrapper.state("errortext")).toBe(etext);
  expect(wrapper.state("loading")).toBe(false);
});

test(
  filename + " joinroomHandler sets errortext on room join failed with response",
  async () => {
    const mockPersist = jest.fn(() => {})
    const etext = "Error joining room; please try again.";

    axios.post.mockRejectedValue({
      response: {
        status: 500
      }
    });

    const wrapper = shallow(<Home />);
    const instance = wrapper.instance();
    instance.setState({ username: "Player 1", roomname: "1234" });
    const changeEvent = { persist: mockPersist };

    await instance.joinroomHandler(changeEvent);

    expect(wrapper.state("errortext")).toBe(etext);
    expect(wrapper.state("loading")).toBe(false);
  }
);

test(
  filename + " joinroomHandler sets errortext on room join failed with response",
  async () => {
    const mockPersist = jest.fn(() => {})
    const etext = "Internal Server Error.";

    axios.post.mockRejectedValue("Test Error");

    const wrapper = shallow(<Home />);
    const instance = wrapper.instance();
    instance.setState({ username: "Player 1", roomname: "1234" });
    const changeEvent = { persist: mockPersist };

    await instance.joinroomHandler(changeEvent);

    expect(wrapper.state("errortext")).toBe(etext);
    expect(wrapper.state("loading")).toBe(false);
  }
);

// ------------------
// createroomHandler state
// ------------------

test(filename + " createroomHandler sets state on success", async () => {
  // Setter mocks
  const mockRoomName = jest.fn((text) => (text))
  const mockHostName = jest.fn((text) => (text))
  const mockPlayers = jest.fn((text) => (text))
  const mockUser = jest.fn((text) => (text))
  const mockPage = jest.fn((text) => (text))
  const mockRole = jest.fn((text) => (text))

  const mockPersist = jest.fn(() => { })
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

  const wrapper = shallow(<Home setRoomName={mockRoomName} setHostName={mockHostName} setPlayers={mockPlayers} setUser={mockUser} setPage={mockPage} setRole={mockRole} />);
  const instance = wrapper.instance();
  instance.setState({ username: "Me" });
  const changeEvent = { persist: mockPersist };

  await instance.createroomHandler(changeEvent);

  expect(mockRoomName.mock.calls[0][0]).toBe(froomCode);
  expect(mockHostName.mock.calls[0][0]).toBe(fuser);
  expect(mockPlayers.mock.calls[0][0]).toBe(fplayers);
  expect(mockUser.mock.calls[0][0]).toEqual({ name: fuser });
  expect(mockPage.mock.calls[0][0]).toBe("Lobby");
  expect(mockRole.mock.calls[0][0]).toBe(frole);
});

test(filename + " createroomHandler sets state on failure", async () => {
  const mockPersist = jest.fn(() => { })
  const etext = "Error creating room; please try again.";

  axios.post.mockRejectedValue("Test error");

  const wrapper = shallow(<Home />);
  const instance = wrapper.instance();
  instance.setState({ username: "Player" });
  const changeEvent = { persist: mockPersist };

  await instance.createroomHandler(changeEvent);

  expect(wrapper.state("errortext")).toBe(etext);
  expect(wrapper.state("loading")).toBe(false);
});