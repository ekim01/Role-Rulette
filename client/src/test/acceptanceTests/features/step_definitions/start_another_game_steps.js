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

Given('A game has ended', async function () {
  // Create Room
  await driver.get('http://ec2-3-16-156-190.us-east-2.compute.amazonaws.com/');

  let usernameForm = await driver.findElement(By.name('username'));
  await usernameForm.sendKeys(testName);

  let createRoomBtn = await driver.findElement(By.xpath("//button[contains(text(), 'Create Room')]"));
  await createRoomBtn.click();

  // Join Room
  await driver.wait(until.elementLocated(By.xpath("//input[@id='input-roomCode']")), 10000);
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

  // Start Game
  let windows = await driver.getAllWindowHandles();
  await driver.switchTo().window(windows[0]);

  let playerNumber = await driver.findElement(By.id("playerNumber"));
  await driver.wait(until.elementTextIs(playerNumber, "3"), 10000);

  let startBtn = await driver.findElement(By.xpath("//button[contains(text(), 'Start')]"));
  await startBtn.click();

  // End Game
  await driver.wait(until.elementLocated(By.xpath("//button[contains(text(), 'End Game')]")), 10000);
  let endBtn = await driver.findElement(By.xpath("//button[contains(text(), 'End Game')]"));
  await endBtn.click();
});

Given('The host clicks the Back to Lobby button', async function () {
  await driver.wait(until.elementLocated(By.xpath("//button[contains(text(), 'Back to Lobby')]")), 10000);
  let backToLobbyBtn = await driver.findElement(By.xpath("//button[contains(text(), 'Back to Lobby')]"));
  await backToLobbyBtn.click();
});

When('The host clicks the Start button to start another game', async function () {
  await driver.wait(until.elementLocated(By.xpath("//button[contains(text(), 'Start')]")), 10000);
  let startBtn = await driver.findElement(By.xpath("//button[contains(text(), 'Start')]"));
  await startBtn.click();
});

Then('All players are given new roles', async function () {
  expect(await driver.wait(until.elementLocated(By.id("roleContainer")), 10000)).toBeTruthy();

  let windows = await driver.getAllWindowHandles();
  await driver.switchTo().window(windows[1]);
  expect(await driver.wait(until.elementLocated(By.id("roleContainer")), 10000)).toBeTruthy();

  await driver.switchTo().window(windows[2]);
  expect(await driver.wait(until.elementLocated(By.id("roleContainer")), 10000)).toBeTruthy();
});