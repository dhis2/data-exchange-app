import { Given, Then } from 'cypress-cucumber-preprocessor/steps'

Given('a user visits the app', () => {
    cy.visit('/')
})

Then('the top-bar is visible', () => {
    cy.contains('Choose a data exchange').should('exist')
})
