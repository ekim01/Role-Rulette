Feature: Join Room
  As a Player I want to be able to join a room

  Scenario: A player enters a room code and joins the room
    Given A room has been created
    And A player enters a valid name
    And A player enters a valid room code
    When A player clicks on the Join Room button
    Then The player should join that room and be redirected the Lobby page