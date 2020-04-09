Feature: Distribute Identities
  As a Host I want to distribute identities/roles to all players according to the game type

  Scenario: The host starts the game
    Given The host is on the Lobby Page and the current game selected is Spyfall
    And There are enough players to start the game
    When The host clicks the start button
    Then All players should be given a role