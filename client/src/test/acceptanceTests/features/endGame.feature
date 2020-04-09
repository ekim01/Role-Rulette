Feature: End Game
  As a Host I want to be able to end a game/session that the current players have finished

  Scenario: The host ends the game
    Given A game has been started
    When The host clicks the End Game button
    Then All players should go to the End Game screen