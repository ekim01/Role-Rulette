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

  // Given the host is on the Home page
  const driver = await webdriverio.remote(opts);
  await driver.pause(5000);// wait a few seconds for the starting splash page to disappear

  // And the host enters a valid name
  let usernameForm  = await driver.$("//android.widget.EditText[@text='Player']");
  await usernameForm.setValue(testName);

  // When the host clicks the Create Room button
  let createRoomBtn = await driver.$("//android.widget.TextView[@text='CREATE ROOM']");
  await createRoomBtn.click();

  // Then the host should be redirected the Lobby page
  await driver.pause(5000);
  let theHostIs = await driver.$("/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.widget.TextView[3]");
  const value = await theHostIs.getText();
  let hostName = value.substring(13);
  expect(hostName).toEqual(testName);
}

main();