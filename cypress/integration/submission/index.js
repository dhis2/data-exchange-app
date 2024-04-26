import { Given, Then, When } from 'cypress-cucumber-preprocessor/steps'

const exchangeNameMap = {
    'Internal data exchange': 'ioHMBgeK50L',
}

Given('user opens app for {string} exchange', (exchangeName) => {
    cy.visit(`/#/?exchangeId=${exchangeNameMap[exchangeName]}&requestIndex=0`)
})

When('user clicks submit button', () => {
    cy.contains('button', 'Submit data').click()
})

Then('submit confirmation displays for {string} exchange', (exchangeName) => {
    // '1 report to Internal data exchange internally at localhost:8080'
    // eslint-disable-next-line no-useless-escape
    const regex = new RegExp(`\d* reports* to ${exchangeName}`, 'g')
    cy.contains(regex)
})

When('user clicks No, cancel', () => {
    cy.contains('button', 'No, cancel').click()
})

When('user clicks Yes, submit and succeeds', () => {
    cy.intercept(
        'POST',
        /api[/][0-9]*[/]aggregateDataExchanges[/][A-Za-z0-9]*[/]exchange/,
        {
            response: {
                responseType: 'ImportSummaries',
                status: 'SUCCESS',
                imported: 1,
                updated: 2,
                deleted: 3,
                ignored: 4,
                importSummaries: [
                    {
                        responseType: 'ImportSummary',
                        status: 'SUCCESS',
                        importCount: {
                            imported: 1,
                            updated: 2,
                            ignored: 3,
                            deleted: 4,
                        },
                        conflicts: [],
                        dataSetComplete: 'false',
                    },
                ],
                total: 10,
            },
        }
    )

    cy.contains('button', 'Yes, submit').click()
})

When('user clicks Close', () => {
    cy.contains('button', 'Close').click()
})

Then('the submit button is disabled', () => {
    cy.contains('button', 'Submit data').should('be.disabled')
})

When('user clicks Yes, submit and fails', () => {
    cy.intercept(
        'POST',
        /api[/][0-9]*[/]aggregateDataExchanges[/][A-Za-z0-9]*[/]exchange/,
        {
            response: {
                responseType: 'ImportSummaries',
                status: 'ERROR',
                importSummaries: [
                    {
                        responseType: 'ImportSummary',
                        status: 'ERROR',
                        conflicts: [],
                        dataSetComplete: 'false',
                    },
                ],
            },
        }
    )

    cy.contains('button', 'Yes, submit').click()
})

Then('an error message displays', () => {
    cy.contains('There was a problem submitting data').should('be.visible')
})

Then('Try again button displays and is clickable', () => {
    cy.contains('button', 'Try again').should('be.visible')
    cy.contains('button', 'Try again').should('not.be.disabled')
})

Then('Submit button is not disabled', () => {
    cy.contains('button', 'Submit data').should('exist')
    cy.contains('button', 'Submit data').should('not.be.disabled')
})

// to fix
Then('the submission summary displays', () => {
    cy.contains('Data submitted successfully').should('exist')
    cy.get(`[data-test="success-counts-table"]`)
        .find('tbody tr:nth-child(1) > td:nth-child(2)')
        .should('contain', '1')
    cy.get(`[data-test="success-counts-table"]`)
        .find('tbody tr:nth-child(1) > td:nth-child(3)')
        .should('contain', '2')
    cy.get(`[data-test="success-counts-table"]`)
        .find('tbody tr:nth-child(1) > td:nth-child(4)')
        .should('contain', '3')
})
