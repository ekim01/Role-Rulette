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

const hostName = "Host Name";
const playerName = "Player1";

Given('The room has been created', async function () {
  await driver.get('http://ec2-3-16-156-190.us-east-2.compute.amazonaws.com/');

  let usernameForm = await driver.findElement(By.name('username'));
  await usernameForm.sendKeys(hostName);

  let createRoomBtn = await driver.findElement(By.xpath("//button[contains(text(), 'Create Room')]"));
  await createRoomBtn.click();
});

Given('A player enters the room', async function () {
  await driver.executeScript('window.open(\'http://ec2-3-16-156-190.us-east-2.compute.amazonaws.com/\');');
  let windows = await driver.getAllWindowHandles();

  await driver.switchTo().window(windows[1]);
  await driver.wait(until.elementLocated(By.name("username")), 10000);

  let usernameForm = await driver.findElement(By.name('username'));
  await usernameForm.sendKeys(playerName);

  await driver.switchTo().window(windows[0]);
  await driver.wait(until.elementLocated(By.xpath("//input[@id='input-roomCode']")), 10000);
  let roomCode = await driver.findElement(By.xpath("//input[@id='input-roomCode']")).getAttribute('value');

  await driver.switchTo().window(windows[1]);
  await driver.wait(until.elementLocated(By.name('roomname')), 10000);
  let roomCodeForm = await driver.findElement(By.name('roomname'));
  await roomCodeForm.sendKeys(roomCode);

  let joinRoomBtn = await driver.findElement(By.xpath("//button[contains(text(), 'Join Room')]"));
  await joinRoomBtn.click();
});

When('The player clicks on the Leave button', async function () {
  await driver.wait(until.elementLocated(By.xpath("//button[contains(text(), 'Leave')]")), 10000);
  let leaveBtn = await driver.findElement(By.xpath("//button[contains(text(), 'Leave')]"));
  await leaveBtn.click();
});

Then('The player should return to the Home page', async function () {
  expect(await driver.wait(until.elementLocated(By.xpath("//label[contains(text(), 'Enter a name:')]")), 10000)).toBeTruthy();
});