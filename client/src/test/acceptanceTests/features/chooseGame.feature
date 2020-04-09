Feature: Choose Game
  As a Host I want to be able to select the game type that will be played from a preloaded list

  Scenario: The host chooses the game Avalon
    Given The host is on the Lobby Page
    And The current game selected is Spyfall
    When The host chooses the game Avalon
    Then The description should change