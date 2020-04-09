Feature: Viewing Info and Identities
  As a Player, I want to be able to see information about the game I’m playing
    (game description, basic rules, description of all identities in play)
  As a Player I want to be able to view my identity during a game
  As a Player, I want to see who had what identity at the end of the game

  Scenario: The player see info when they join a room, when the game starts and when the game ends
    Given The host has already created a room
    When A player joins the room
    Then The player can see information about the currently selected game

    Given There are now enough players to start the game
    When The host starts the game
    Then The player can view their identity

    When The host ends the game
    Then The player can see the identity of other players