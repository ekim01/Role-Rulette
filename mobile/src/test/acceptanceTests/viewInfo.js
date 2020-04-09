const webdriverio = require("webdriverio");
const expect = require('expect');

const opts = {
  port: 4723,
  path: "/wd/hub",
  capabilities: {
    platformName: "Android",
    deviceName: "Android Emulator",
    app: "C:/The/Path/To/mobile-eddec14a2dd64aa99c80794caf00f152-signed.apk",
    automationName: "UiAutomator2",
    adbExecTimeout: "60000"
  }
};

const hostName = "Test Name";

async function main () {

  // Given the host has already created a room
  const driver = await webdriverio.remote(opts);
  await driver.pause(5000);// Wait a few seconds for the starting splash page to disappear

  let usernameForm = await driver.$("//android.widget.EditText[@text='Player']");
  await usernameForm.setValue(hostName);

  let createRoomBtn = await driver.$("//android.widget.TextView[@text='CREATE ROOM']");
  await createRoomBtn.click();

  await driver.pause(5000);// Wait a few seconds for the lobby to load

  let roomCodeTextView = await driver.$("/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout[1]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.widget.TextView[2]");
  const roomCode = await roomCodeTextView.getText();

  // When a player joins the room
  await driver.reset();
  await driver.pause(5000);// Wait a few seconds for the app to restart

  usernameForm  = await driver.$("//android.widget.EditText[@text='Player']");
  await usernameForm.setValue('Player1');

  let roomCodeForm = await driver.$("//android.widget.EditText[@text='XXXX']");
  await roomCodeForm.setValue(roomCode);

  let joinRoomBtn = await driver.$("//android.widget.TextView[@text='JOIN ROOM']");
  await joinRoomBtn.click();

  // Then the player can see information about the currently selected game
  await driver.pause(5000);
  let spyfallDescription =
    "A spy in your ranks wants to figure out where you are " +
    "while everyone else is trying to figure out who the spy is.";

  let gameDescriptionBtn = await driver.$("//android.widget.TextView[@text='GAME DESCRIPTION']");
  await gameDescriptionBtn.click();
  await driver.pause(5000);

  let gameDescriptionBox = await driver.$("/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.view.ViewGroup[2]/android.view.ViewGroup[2]/android.widget.TextView[2]");
  const gameDescription = await gameDescriptionBox.getText();
  expect(gameDescription).toBe(spyfallDescription);
}

main();