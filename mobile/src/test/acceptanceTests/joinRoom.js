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

const hostName = "Host Name";
const playerName = "Player1";

async function main () {

  // Given a room has been created
  const driver = await webdriverio.remote(opts);
  await driver.pause(5000);// Wait a few seconds for the starting splash page to disappear

  let usernameForm = await driver.$("//android.widget.EditText[@text='Player']");
  await usernameForm.setValue(hostName);

  let createRoomBtn = await driver.$("//android.widget.TextView[@text='CREATE ROOM']");
  await createRoomBtn.click();

  await driver.pause(5000);// Wait a few seconds for the lobby to load

  let roomCodeTextView = await driver.$("/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout[1]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.widget.TextView[2]");
  const roomCode = await roomCodeTextView.getText();

  // And a player enters a valid name
  await driver.reset();
  await driver.pause(5000);// Wait a few seconds for the app to restart

  usernameForm  = await driver.$("//android.widget.EditText[@text='Player']");
  await usernameForm.setValue(playerName);

  // And a player enters a valid room code
  let roomCodeForm = await driver.$("//android.widget.EditText[@text='XXXX']");
  await roomCodeForm.setValue(roomCode);

  // When a player clicks on the Join Room button
  let joinRoomBtn = await driver.$("//android.widget.TextView[@text='JOIN ROOM']");
  await joinRoomBtn.click();

  // Then the player should join that room and be redirected the Lobby page
  await driver.pause(5000);
  let theHostIs = await driver.$("/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.widget.TextView[3]");
  const value = await theHostIs.getText();
  let theHostName = value.substring(13);
  expect(theHostName).toEqual(hostName);
}

main();