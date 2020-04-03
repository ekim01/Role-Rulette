// Join

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

test(filename + " roomChangeHadler changes characters to uppercase", () => {
  const wrapper = shallow(<Home />);
  const instance = wrapper.instance();

  const newRoom = "azC1";

  instance.roomnameHandler(newRoom);

  expect(wrapper.state("roomname")).not.toBe(newRoom);
  expect(wrapper.state("roomname")).toBe(newRoom.toUpperCase());
});

/**************
 * RENDERING
 *************/

describe(
  filename + " Doesen't render loading screen on not loading state",
  () => {
    const wrapper = shallow(<Home loading={false} />);
    const instance = wrapper.instance();

    const result = instance.render();
    expect(result.props.children).not.toContainEqual(
      <Dialog visible={false} />
    );
  }
);

/*

test(
  filename +
    "on joining, when username and roomname empty, errortext is /'Please complete all fields/'",
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
    "on joining, when username empty, errortext is /'Please enter a name/'",
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
    "on joining, when username has only spaces, errortext is /'The name can't be only spaces/'",
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
    "on joining, when roomname empty, errortext is /'Please complete all fields/'",
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
    "on joining, when roomname not 4 characters, errortext is /'Invalid room code/'",
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
    "on createroom, when username empty, errortext is /'Please enter a name/'",
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
    "on createroom, when username has only spaces, errortext is /'The name can't be only spaces/'",
  () => {
    const wrapper = shallow(<App />);
    const instance = wrapper.instance();

    const nameText = "    ";
    instance.createRoom(nameText);
    expect(wrapper.state("errortext")).toEqual("The name can't be only spaces");
  }
);

///////////////////////////////////////////////

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

*/
