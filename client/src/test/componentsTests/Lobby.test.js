import React from "react";
import { mount, EnzymeAdapter, shallow } from "enzyme";
import axios from "axios";
import enzyme from "enzyme";
import Home from "../../components/Home";
import Lobby from "../../components/Lobby";
import Adapter from "enzyme-adapter-react-16";
import { SPYFALL_MINPLAYERS, SPYFALL_MAXPLAYERS } from "../../Utilities/constants";

const filename = "Home.js";

jest.mock("axios");
enzyme.configure({ adapter: new Adapter() });

// ===============
// STATE
// ===============

test(filename + " roomname state initializes to null", () => {
  const wrapper = shallow(<Home joinRoom={()=>{}} createRoom={()=>{}} errortext={''} />);
  expect(wrapper.state("roomname")).toBe("");
});

test(filename + " playername state initializes to null", () => {
  const wrapper = shallow(<Home joinRoom={()=>{}} createRoom={()=>{}} errortext={''} />);
  expect(wrapper.state("username")).toBe("");
});



// ==================================
// FUNCTIONS
// ==================================


// ------------------
// changeHandler
// ------------------

test(filename + " changeHandler updates state", () => {
  const wrapper = shallow(<Home joinRoom={()=>{}} createRoom={()=>{}} />);
  const instance = wrapper.instance();

  const newPlayer2 = "Player2";
  const changeEvent = { target: { name: "playername", value: newPlayer2 } };
  instance.changeHandler(changeEvent);

  expect(wrapper.state("playername")).toBe(newPlayer2);
});

// ------------------
// roomnameHandler
// -----------------d-

test(filename + " roomChangeHadler calls changeHandler", () => {
  const wrapper = shallow(<Home joinRoom={()=>{}} createRoom={()=>{}} errortext={''} />);
  const instance = wrapper.instance();

  const FakeHandler = jest.spyOn(instance, "changeHandler");

  const changeEvent = { target: { name: "roomname", value: "ABCD" } };
  instance.roomnameHandler(changeEvent);

  expect(FakeHandler).toHaveBeenCalled();
});

// ------------------
// playernameHandler
// ------------------


test(filename + " playernameHandler calls changeHandler", () => {
  const wrapper = shallow(<Home joinRoom={()=>{}} createRoom={()=>{}} errortext={''} />);
  const instance = wrapper.instance();

  const FakeHandler = jest.spyOn(instance, "changeHandler");

  const changeEvent = { target: { name: "username", value: "ABCDEFG" } };
  instance.playernameHandler(changeEvent);

  expect(FakeHandler).toHaveBeenCalled();
});

test(filename + " roomChangeHadler changes characters to uppercase", () => {
  const wrapper = shallow(<Home joinRoom={()=>{}} createRoom={()=>{}} errortext={''} />);
  const instance = wrapper.instance();

  const newRoom = "azC1";

  const changeEvent = { target: { name: "roomname", value: newRoom } };
  instance.roomnameHandler(changeEvent);

  expect(wrapper.state("roomname")).not.toBe(newRoom);
  expect(wrapper.state("roomname")).toBe(newRoom.toUpperCase());
});

// ------------------
// startGame
// ------------------

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