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

const testName = "Test Name";

async function main () {

  // Given the host is on the Lobby Page
  const driver = await webdriverio.remote(opts);
  await driver.pause(5000);// Wait a few seconds for the starting splash page to disappear

  let usernameForm = await driver.$("//android.widget.EditText[@text='Player']");
  await usernameForm.setValue(testName);

  let createRoomBtn = await driver.$("//android.widget.TextView[@text='CREATE ROOM']");
  await createRoomBtn.click();

  await driver.pause(5000);// Wait a few seconds for the lobby to load

  // And the current game selected is Spyfall
  let selectGameDropdown = await driver.$("/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[1]/android.view.ViewGroup/android.view.ViewGroup/android.widget.TextView");
  await selectGameDropdown.click();

  let spyfallSelection = await driver.$("//android.widget.TextView[@text='Spyfall']");
  await spyfallSelection.click();

  // When the host chooses the game Avalon
  await selectGameDropdown.click();

  let avalonSelection = await driver.$("//android.widget.TextView[@text='Avalon']");
  await avalonSelection.click();

  await driver.pause(2000);

  // Then the description should change
  let avalonDescription =
    "Players are either Loyal Servants of Arthur fighting for Goodness and honor or aligned " +
    "with the Evil ways of Mordred. Good wins the game by successfully completing three Quests. " +
    "Evil wins if three Quests end in failure. Evil can also win by assassinating Merlin at game's " +
    "end or if a Quest cannot be undertaken.";

  let gameDescriptionBtn = await driver.$("//android.widget.TextView[@text='GAME DESCRIPTION']");
  await gameDescriptionBtn.click();
  await driver.pause(5000);

  let gameDescriptionBox = await driver.$("/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.view.ViewGroup[2]/android.view.ViewGroup[2]/android.widget.TextView[2]");
  const gameDescription = await gameDescriptionBox.getText();
  expect(gameDescription).toEqual(avalonDescription);
}

main();