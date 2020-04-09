Feature: Create Room
  As a Host I want to be able to create a room that other players can join

  Scenario: The host enters name and creates a room
    Given The host is on the Home page
    And The host enters a valid name
    When The host clicks the Create Room button
    Then The host should be redirected the Lobby page