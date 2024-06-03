import { Given, Then, When } from '@badeball/cypress-cucumber-preprocessor'

Given('user opens app with no selections', () => {
    cy.visit('/')
})

Given('user opens app with selections', () => {
    cy.visit('/#/?exchangeId=ioHMBgeK50L&requestIndex=0')
})

Then('the entry screen text displays', () => {
    cy.contains('Choose a data exchange to get started').should('exist')
})

When('user clicks on exchange selector', () => {
    cy.get('[data-test="data-exchange-selector"]').click()
})

When('user selects {string} exchange', (exchangeName) => {
    cy.get(`[data-test="data-exchange-selector-contents"]`)
        .contains(exchangeName)
        .click()
})

Then('data displays for {string} exchange', (exchangeName) => {
    cy.contains(exchangeName).should('exist')
    cy.contains('1 data report').should('exist')
})

Then('the first report is selected', () => {
    cy.url().should('include', 'requestIndex=0')
})

When('user clicks on Clear selections', () => {
    cy.contains('button', 'Clear selections').click()
})

Then('url does not contain any selections', () => {
    cy.url().should('not.include', 'exchangeId')
    cy.url().should('not.include', 'requestIndex')
})
