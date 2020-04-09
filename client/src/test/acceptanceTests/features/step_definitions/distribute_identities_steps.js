const { Given, When, Then, setDefaultTimeout } = require('cucumber');
const { Builder, By, Capabilities, until } = require('selenium-webdriver');

const expect = require('expect');

const chromeDriver = require("chromedriver");
setDefaultTimeout(30 * 1000);// milliseconds

const browserName = 'chrome';
const capabilityName = 'goog:chromeOptions';
let browserOptions = {
  'w3c': false,
  'args': [
    '--headless',
    '--disable-gpu',
    '--no-sandbox'
  ]
};

const capabilities = Capabilities.chrome().set(capabilityName, browserOptions);

let driver = new Builder()
  .forBrowser(browserName)
  .withCapabilities(capabilities)
  .build();

const testName = "Test Name";

Given('The host is on the Lobby Page and the current game selected is Spyfall', async function () {
  await driver.get('http://ec2-3-16-156-190.us-east-2.compute.amazonaws.com/');

  let usernameForm = await driver.findElement(By.name('username'));
  await usernameForm.sendKeys(testName);

  let createRoomBtn = await driver.findElement(By.xpath("//button[contains(text(), 'Create Room')]"));
  await createRoomBtn.click();

  await driver.wait(until.elementLocated(By.id("select-game")), 5000);
  let selectGameDropdown = await driver.findElement(By.id('select-game'));
  await selectGameDropdown.click();

  let avalonSelection = await driver.findElement(By.xpath("//option[@value='Spyfall']"));
  await avalonSelection.click();
});

Given('There are enough players to start the game', async function () {
  let roomCode = await driver.findElement(By.xpath("//input[@id='input-roomCode']")).getAttribute('value');
  let numPlayersToAdd = 2;

  for(let i = 0; i < numPlayersToAdd; i++) {
    await driver.executeScript('window.open(\'http://ec2-3-16-156-190.us-east-2.compute.amazonaws.com/\');');
    let windows = await driver.getAllWindowHandles();

    await driver.switchTo().window(windows[i+1]);
    await driver.wait(until.elementLocated(By.name("username")), 10000);

    let usernameForm = await driver.findElement(By.name('username'));
    await usernameForm.sendKeys('Player' + (i+1).toString(10));
    let roomCodeForm = await driver.findElement(By.name('roomname'));
    await roomCodeForm.sendKeys(roomCode);

    let joinRoomBtn = await driver.findElement(By.xpath("//button[contains(text(), 'Join Room')]"));
    await joinRoomBtn.click();
  }
});

When('The host clicks the start button', async function () {
  let windows = await driver.getAllWindowHandles();
  await driver.switchTo().window(windows[0]);

  let playerNumber = await driver.findElement(By.id("playerNumber"));
  await driver.wait(until.elementTextIs(playerNumber, "3"), 10000);

  let startBtn = await driver.findElement(By.xpath("//button[contains(text(), 'Start')]"));
  await startBtn.click();
});

Then('All players should be given a role', async function () {
  expect(await driver.wait(until.elementLocated(By.id("roleContainer")), 10000)).toBeTruthy();

  let windows = await driver.getAllWindowHandles();
  await driver.switchTo().window(windows[1]);
  expect(await driver.wait(until.elementLocated(By.id("roleContainer")), 10000)).toBeTruthy();

  await driver.switchTo().window(windows[2]);
  expect(await driver.wait(until.elementLocated(By.id("roleContainer")), 10000)).toBeTruthy();
});