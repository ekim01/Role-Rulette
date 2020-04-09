const { Given, When, Then, setDefaultTimeout } = require('cucumber');
const { Builder, By, Capabilities, until } = require('selenium-webdriver');

const expect = require('expect');

const chromeDriver = require("chromedriver");
setDefaultTimeout(30 * 1000);// milliseconds

const browserName = 'chrome';// Switch to 'firefox' if desired
const capabilityName = 'goog:chromeOptions';// Switch to 'moz:firefoxOptions' if desired
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

const hostName = "Host Name";
const playerName = "Player1";

Given('A room has been created', async function () {
  await driver.get('http://ec2-3-16-156-190.us-east-2.compute.amazonaws.com/');

  let usernameForm = await driver.findElement(By.name('username'));
  await usernameForm.sendKeys(hostName);

  let createRoomBtn = await driver.findElement(By.xpath("//button[contains(text(), 'Create Room')]"));
  await createRoomBtn.click();
});

Given('A player enters a valid name', async function () {
  await driver.executeScript('window.open(\'http://ec2-3-16-156-190.us-east-2.compute.amazonaws.com/\');');
  let windows = await driver.getAllWindowHandles();

  await driver.switchTo().window(windows[1]);
  await driver.wait(until.elementLocated(By.name("username")), 10000);

  let usernameForm = await driver.findElement(By.name('username'));
  await usernameForm.sendKeys(playerName);
});

Given('A player enters a valid room code', async function () {
  let windows = await driver.getAllWindowHandles();

  await driver.switchTo().window(windows[0]);
  await driver.wait(until.elementLocated(By.xpath("//input[@id='input-roomCode']")), 10000);
  let roomCode = await driver.findElement(By.xpath("//input[@id='input-roomCode']")).getAttribute('value');

  await driver.switchTo().window(windows[1]);
  await driver.wait(until.elementLocated(By.name('roomname')), 10000);
  let roomCodeForm = await driver.findElement(By.name('roomname'));
  await roomCodeForm.sendKeys(roomCode);
});

When('A player clicks on the Join Room button', async function () {
  let joinRoomBtn = await driver.findElement(By.xpath("//button[contains(text(), 'Join Room')]"));
  await joinRoomBtn.click();
});

Then('The player should join that room and be redirected the Lobby page', async function () {
  // The player can see the host name
  await driver.wait(until.elementLocated(By.xpath("//li[@class='list-group-item list-group-item-primary']")), 5000);

  let theHostIs = await driver.findElement(By.xpath("//li[@class='list-group-item list-group-item-primary']")).getText();
  let theHostName = theHostIs.substring(13);
  expect(theHostName).toEqual(hostName);

  // The host can see the newly added player
  let windows = await driver.getAllWindowHandles();
  await driver.switchTo().window(windows[0]);

  await driver.wait(until.elementLocated(By.id("playerNumber")), 5000);
  let playerNumber = await driver.findElement(By.id("playerNumber"));
  await driver.wait(until.elementTextIs(playerNumber, "2"), 10000);

  let allPlayersList = await driver.findElements(By.xpath("//li[@class='list-group-item']"));
  let foundPlayer = false;

  for(let i = 0; i<allPlayersList.length; i++) {
    let currPlayerName = await allPlayersList[i].getText();
    if(currPlayerName.localeCompare(playerName) === 0)
      foundPlayer = true;
  }
  expect(foundPlayer).toBe(true)
});