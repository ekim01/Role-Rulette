import { restrictInputAlphanumeric } from "../../Utilities/common";

const filename = 'Utilities.js';


const func = 'restrictInputAlphanumeric';
const event = {
    preventDefault() { },
    key: '!'
};

test(filename + ' ' + func + ' doesen\'t prevent default on alphanumeric recieved', () => {
    const FakeDef = jest.spyOn(event, 'preventDefault');

    event.key = 'a';
    restrictInputAlphanumeric(event);
    expect(FakeDef).not.toHaveBeenCalled();

    event.key = 'Z';
    restrictInputAlphanumeric(event);
    expect(FakeDef).not.toHaveBeenCalled();

    event.key = '0';
    restrictInputAlphanumeric(event);
    expect(FakeDef).not.toHaveBeenCalled();
});

test(filename + ' ' + func + ' prevents default on non-alphanumeric recieved', () => {
    const FakeDef2 = jest.spyOn(event, 'preventDefault');
    event.key = '!';
    restrictInputAlphanumeric(event);
    expect(FakeDef2).toHaveBeenCalled();
});