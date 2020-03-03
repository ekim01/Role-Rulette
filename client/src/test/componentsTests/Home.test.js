import React from "react";
import { mount, EnzymeAdapter, shallow } from 'enzyme';
import axios from "axios";
import enzyme from 'enzyme';
import Home from "../../components/Home";
import Adapter from 'enzyme-adapter-react-16';

const filename = "Home.js";

enzyme.configure({ adapter: new Adapter() });

// ===============
// STATE
// ===============

test(filename + ' roomname state initializes to null', () => {
    const wrapper = shallow(<Home />);

    expect(wrapper.state('roomname')).toBe('');
});

test(filename + ' playername state initializes to null', () => {
    const wrapper = shallow(<Home />);

    expect(wrapper.state('username')).toBe('');
});

test(filename + ' errortext state initializes to null', () => {
    const wrapper = shallow(<Home />);

    expect(wrapper.state('errortext')).toBe('');
});

test(filename + ' updates roomname state', () => {
    const wrapper = shallow(<Home />);
    const instance = wrapper.instance();

    const newRoom = 'ABCD';
    instance.setState({ 'roomname': newRoom });

    expect(wrapper.state('roomname')).toBe(newRoom);
});

test(filename + ' updates playername state', () => {
    const wrapper = shallow(<Home />);
    const instance = wrapper.instance();

    const newPlayer = 'Player1';
    instance.setState({ 'playername': newPlayer });

    expect(wrapper.state('playername')).toBe(newPlayer);
});

test(filename + ' updates errortext state', () => {
    const wrapper = shallow(<Home />);
    const instance = wrapper.instance();

    const newText = 'Error text';
    instance.setState({ 'errortext': newText });

    expect(wrapper.state('errortext')).toBe(newText);
});

// ==================================
// FUNCTIONS
// ==================================

// ------------------
// changeHandler
// ------------------

test(filename + ' changeHandler updates state', () => {
    const wrapper = shallow(<Home />);
    const instance = wrapper.instance();

    const newPlayer2 = 'Player2';
    const changeEvent = { 'target': { 'name': 'playername', 'value': newPlayer2 } };
    instance.changeHandler(changeEvent);

    expect(wrapper.state('playername')).toBe(newPlayer2);
});

// ------------------
// roomnameHandler
// ------------------

test(filename + ' roomChangeHandler calls changeHandler', () => {
    const wrapper = shallow(<Home />);
    const instance = wrapper.instance();

    const FakeHandler = jest.spyOn(instance, 'changeHandler');

    const changeEvent = { 'target': { 'name': 'roomname', 'value': 'ABCD' } };
    instance.roomnameHandler(changeEvent);

    expect(FakeHandler).toHaveBeenCalled();
});

test(filename + ' roomChangeHandler changes characters to uppercase', () => {
    const wrapper = shallow(<Home />);
    const instance = wrapper.instance();

    const newRoom = 'azC1';

    const changeEvent = { 'target': { 'name': 'roomname', 'value': newRoom } };
    instance.roomnameHandler(changeEvent);

    expect(wrapper.state('roomname')).not.toBe(newRoom);
    expect(wrapper.state('roomname')).toBe(newRoom.toUpperCase());
});

// ------------------
// joinRoom
// ------------------