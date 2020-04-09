Feature: Start Another Game
  As a Host, I want to be able to start another game with the same players and settings, after the current game ends.

  Scenario: The host starts a new game
    Given A game has ended
    And The host clicks the Back to Lobby button
    When The host clicks the Start button to start another game
    Then All players are given new roles