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

Given('The host is on the Home page', async function () {
  await driver.get('http://ec2-3-16-156-190.us-east-2.compute.amazonaws.com/');
});

When('The host enters a valid name', async function () {
  let usernameForm = await driver.findElement(By.name('username'));
  await usernameForm.sendKeys(testName);
});

When('The host clicks the Create Room button', async function () {
  let createRoomBtn = await driver.findElement(By.xpath("//button[contains(text(), 'Create Room')]"));
  await createRoomBtn.click();
});

Then('The host should be redirected the Lobby page', async function () {
  await driver.wait(until.elementLocated(By.xpath("//li[@class='list-group-item list-group-item-primary']")), 5000);

  let theHostIs = await driver.findElement(By.xpath("//li[@class='list-group-item list-group-item-primary']")).getText();
  let hostName = theHostIs.substring(13);
  expect(hostName).toEqual(testName);
});