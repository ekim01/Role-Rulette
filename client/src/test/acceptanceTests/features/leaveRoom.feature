Feature: Leave Room
  As a Player, I can leave the room I'm currently in

  Scenario: A player leaves the room
    Given The room has been created
    And A player enters the room
    When The player clicks on the Leave button
    Then The player should return to the Home page