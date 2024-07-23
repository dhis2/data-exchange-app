Feature: Navigation using top bar works

    Scenario: The app loads with entry text when there are no selections
        Given user opens app with no selections
        Then the entry screen text displays

    Scenario: The app loads data when user selects a valid exchange
        Given user opens app with no selections
        When user clicks on exchange selector
        And user selects "Internal data exchange" exchange
        Then data displays for "Internal data exchange" exchange
        And the first report is selected

    Scenario: The selections clear when user clicks clear selections
        Given user opens app with selections
        And user clicks on Clear selections
        Then the entry screen text displays
        And url does not contain any selections


