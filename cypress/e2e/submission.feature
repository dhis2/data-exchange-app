Feature: Submission works

    Scenario: The submission confirmation modal opens
        Given user opens app for "Internal data exchange" exchange
        When user clicks submit button
        Then submit confirmation displays for "Internal data exchange" exchange

    Scenario: The submission confirmation modal allows submission if opened/closed/opened
        Given user opens app for "Internal data exchange" exchange
        When user clicks submit button
        When user clicks No, cancel
        When user clicks submit button
        Then submit confirmation displays for "Internal data exchange" exchange

    Scenario: If submission is successful, counts of updated/imported display
        Given user opens app for "Internal data exchange" exchange
        When user clicks submit button
        When user clicks Yes, submit and succeeds
        Then the submission summary displays

    Scenario: If submission is successful and modal is closed, user cannot submit again
        Given user opens app for "Internal data exchange" exchange
        When user clicks submit button
        When user clicks Yes, submit and succeeds
        When user clicks Close
        Then the submit button is disabled

    Scenario: If submission fails, user can try again
        Given user opens app for "Internal data exchange" exchange
        When user clicks submit button
        When user clicks Yes, submit and fails
        Then an error message displays
        Then Try again button displays and is clickable

    Scenario: If submission fails, closes modal, can hit submit again
        Given user opens app for "Internal data exchange" exchange
        When user clicks submit button
        When user clicks Yes, submit and fails
        When user clicks Close
        Then Submit button is not disabled
