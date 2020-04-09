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

const hostName = "Test Name";

Given('The host has already created a room', async function () {
  await driver.get('http://ec2-3-16-156-190.us-east-2.compute.amazonaws.com/');

  let usernameForm = await driver.findElement(By.name('username'));
  await usernameForm.sendKeys(hostName);

  let createRoomBtn = await driver.findElement(By.xpath("//button[contains(text(), 'Create Room')]"));
  await createRoomBtn.click();
});

When('A player joins the room', async function () {
  // Entering player name
  await driver.executeScript('window.open(\'http://ec2-3-16-156-190.us-east-2.compute.amazonaws.com/\');');
  let windows = await driver.getAllWindowHandles();

  await driver.switchTo().window(windows[1]);
  await driver.wait(until.elementLocated(By.name("username")), 10000);

  let usernameForm = await driver.findElement(By.name('username'));
  await usernameForm.sendKeys("Player1");

  // Entering room code
  windows = await driver.getAllWindowHandles();

  await driver.switchTo().window(windows[0]);
  await driver.wait(until.elementLocated(By.xpath("//input[@id='input-roomCode']")), 10000);
  let roomCode = await driver.findElement(By.xpath("//input[@id='input-roomCode']")).getAttribute('value');

  await driver.switchTo().window(windows[1]);
  await driver.wait(until.elementLocated(By.name('roomname')), 10000);
  let roomCodeForm = await driver.findElement(By.name('roomname'));
  await roomCodeForm.sendKeys(roomCode);

  // Joining room
  let joinRoomBtn = await driver.findElement(By.xpath("//button[contains(text(), 'Join Room')]"));
  await joinRoomBtn.click();
});

Then('The player can see information about the currently selected game', async function () {
  let spyfallDescription =
    "A spy in your ranks wants to figure out where you are " +
    "while everyone else is trying to figure out who the spy is.";

  await driver.wait(until.elementLocated(By.id('input-desc')), 10000);
  let gameDescription = await driver.findElement(By.id('input-desc')).getText();
  expect(gameDescription).toBe(spyfallDescription);
});

Given('There are now enough players to start the game', async function () {
  // Entering player name
  await driver.executeScript('window.open(\'http://ec2-3-16-156-190.us-east-2.compute.amazonaws.com/\');');
  let windows = await driver.getAllWindowHandles();

  await driver.switchTo().window(windows[2]);
  await driver.wait(until.elementLocated(By.name("username")), 10000);

  let usernameForm = await driver.findElement(By.name('username'));
  await usernameForm.sendKeys("Player2");

  // Entering room code
  windows = await driver.getAllWindowHandles();

  await driver.switchTo().window(windows[0]);
  await driver.wait(until.elementLocated(By.xpath("//input[@id='input-roomCode']")), 10000);
  let roomCode = await driver.findElement(By.xpath("//input[@id='input-roomCode']")).getAttribute('value');

  await driver.switchTo().window(windows[2]);
  await driver.wait(until.elementLocated(By.name('roomname')), 10000);
  let roomCodeForm = await driver.findElement(By.name('roomname'));
  await roomCodeForm.sendKeys(roomCode);

  // Joining room
  let joinRoomBtn = await driver.findElement(By.xpath("//button[contains(text(), 'Join Room')]"));
  await joinRoomBtn.click();
});

When('The host starts the game', async function () {
  let windows = await driver.getAllWindowHandles();
  await driver.switchTo().window(windows[0]);

  let playerNumber = await driver.findElement(By.id("playerNumber"));
  await driver.wait(until.elementTextIs(playerNumber, "3"), 10000);

  let startBtn = await driver.findElement(By.xpath("//button[contains(text(), 'Start')]"));
  await startBtn.click();
});

Then('The player can view their identity', async function () {
  expect(await driver.wait(until.elementLocated(By.id("roleContainer")), 10000)).toBeTruthy();

  let windows = await driver.getAllWindowHandles();
  await driver.switchTo().window(windows[1]);
  expect(await driver.wait(until.elementLocated(By.id("roleContainer")), 10000)).toBeTruthy();

  await driver.switchTo().window(windows[2]);
  expect(await driver.wait(until.elementLocated(By.id("roleContainer")), 10000)).toBeTruthy();
});

When('The host ends the game', async function () {
  let windows = await driver.getAllWindowHandles();
  await driver.switchTo().window(windows[0]);

  await driver.wait(until.elementLocated(By.xpath("//button[contains(text(), 'End Game')]")), 10000);
  let endBtn = await driver.findElement(By.xpath("//button[contains(text(), 'End Game')]"));
  await endBtn.click();
});

Then('The player can see the identity of other players', async function () {
  let windows = await driver.getAllWindowHandles();
  await driver.switchTo().window(windows[1]);
  expect(await driver.wait(until.elementLocated(By.id("roleContainer")), 10000)).toBeTruthy();
});