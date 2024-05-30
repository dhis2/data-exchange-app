import { Given, Then } from '@badeball/cypress-cucumber-preprocessor'

Given('a user visits the app', () => {
    cy.visit('/')
})

Then('the top-bar is visible', () => {
    cy.contains('Choose a data exchange').should('exist')
})
