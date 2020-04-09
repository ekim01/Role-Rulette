const { Given, When, Then, setDefaultTimeout } = require('cucumber');
const { Builder, By, Capabilities, until } = require('selenium-webdriver');

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

Given('The host is on the Lobby Page', async function () {
  await driver.get('http://ec2-3-16-156-190.us-east-2.compute.amazonaws.com/');

  let usernameForm = await driver.findElement(By.name('username'));
  await usernameForm.sendKeys(testName);

  let createRoomBtn = await driver.findElement(By.xpath("//button[contains(text(), 'Create Room')]"));
  await createRoomBtn.click();
});

Given('The current game selected is Spyfall', async function () {
  await driver.wait(until.elementLocated(By.id("select-game")), 5000);
  let selectGameDropdown = await driver.findElement(By.id('select-game'));
  await selectGameDropdown.click();

  let spyfallSelection = await driver.findElement(By.xpath("//option[@value='Spyfall']"));
  await spyfallSelection.click();
});

When('The host chooses the game Avalon', async function () {
  let selectGameDropdown = await driver.findElement(By.id('select-game'));
  await selectGameDropdown.click();

  let avalonSelection = await driver.findElement(By.xpath("//option[@value='Avalon']"));
  await avalonSelection.click();
});

Then('The description should change', async function () {
  let avalonDescription =
    "Players are either Loyal Servants of Arthur fighting for Goodness and honor or aligned " +
    "with the Evil ways of Mordred. Good wins the game by successfully completing three Quests. " +
    "Evil wins if three Quests end in failure. Evil can also win by assassinating Merlin at game's " +
    "end or if a Quest cannot be undertaken.";

  let gameDescription = await driver.findElement(By.id('input-desc'));
  await driver.wait(until.elementTextIs(gameDescription, avalonDescription), 20000);
});