## Role Roulette – GitHub Workflow & Code Review

(WIP)

## Branches
### master
* Our “Snap-shottable” branch
* Always in good condition (not broken)
* Merge develop into master (as a group?) once a major collection of user stories are complete and tested (As “releases”)
* Non-squashed

### develop
* The base branch for development

## Branching
* Each user story will be developed on a branch from `develop`
* Each dev task collection of a user story will be a branch off of the larger user story
* Merges into `develop` and user story branches must be squashed

## Pull Requests
* Must be done any time you want to merge your branch (dev task) into the user story branch, or from user story branch into develop
* Merging from develop to master -- dont squash

## Merging Pull Requests
* Must pass review process below before it can be merged
* Remember to delete your branches after they’ve been merged
* Remember to ensure your project runs and passes tests before submitting a pull request, and before merging
* Ensure your branch is up to date with the target branch before merging
* Merge Conflicts
    * Using a merge conflict helper tool is recommended (ex. GitHub site / desktop)
    * Think through the merge conflicts. If you’re unsure, ask the person who wrote the conflicting lines, or post a message in slack for anyone to help

## Review Checklist
* Link to the trello item is given in the PR description, along with a very brief overall summary
* Passes all task-specific acceptance criteria listed in the trello item
    * (Everything outlined in the task/story description is either finished, or an explanation why it wasn’t implemented is provided)
* The app can be run, the changes can be observed in-app (if applicable) 
* Code quality meets programming practices
    * Code passes linter
    * Code can be reasonably understood, comments are provided otherwise
    * No obvious code smells
    * Architecturally sound (Folder structure is organized)
* Must have thorough enough testing (X% Coverage)
    * The code is written to be testable (ex. you can use dependency injection)
    * Edge cases are tested. 
* Passes all GitHub CI checks

## Review Process
* Every pull request must be **approved** by 3 other members
* Review will involve looking in the `diff` for violations of the criteria above
* Reviewers will run the project at that branch to verify everything works as intended
* Reviewers will give feedback  / suggestions on the pull requests, and **approve** them only when their feedback has been addressed / dismissed

## Programming Practices
### General
* Variable names are informative
* Variable name formatting is consistent (camelCase)
* Functions are modular as possible (Maximum 40 lines)
* Code can be reasonably understood, comments are provided otherwise
    * (Try to write code in such a way that it can be understood without comments)
* Avoid obvious code smells

### Testing
* Try to make tests as you’re developing (or follow TDD)
* Test all edge cases