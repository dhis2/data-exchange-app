import '@testing-library/jest-dom'
import { configure, render, within } from '@testing-library/react'
import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { AppContext, UserContext } from '../context/index.js'
import { testDataExchange, testUserContext } from '../utils/builders.js'
import { EditPage } from './editOverview.js'

jest.mock('@dhis2/ui', () => {
    const ui = jest.requireActual('@dhis2/ui')

    return {
        __esModule: true,
        ...ui,
        SharingDialog: () => <div data-test="mock-sharing-dialog" />,
    }
})

const setUp = (
    ui,
    {
        aggregateDataExchanges = [testDataExchange(), testDataExchange()],
        userContext = testUserContext(),
    } = {}
) => {
    const originalWarn = console.warn
    jest.spyOn(console, 'warn').mockImplementation((value) => {
        if (!value.match(/No server timezone/)) {
            originalWarn(value)
        }
    })

    const screen = render(
        <BrowserRouter>
            <AppContext.Provider
                value={{ aggregateDataExchanges, refetchExchanges: () => {} }}
            >
                <UserContext.Provider value={userContext}>
                    {ui}
                </UserContext.Provider>
            </AppContext.Provider>
        </BrowserRouter>
    )
    return { screen, aggregateDataExchanges, userContext }
}

beforeEach(() => {
    configure({
        testIdAttribute: 'data-test',
    })
})

describe('<EditPage/>', () => {
    it('should display every data exchange', () => {
        const { screen, aggregateDataExchanges } = setUp(<EditPage />)
        const exchangeCards = screen.queryAllByTestId('data-exchange-card')
        expect(exchangeCards).toHaveLength(2)

        exchangeCards.map((exchangeCard, i) => {
            expect(exchangeCard).toHaveTextContent(
                aggregateDataExchanges[i].displayName
            )
            expect(exchangeCard).toHaveTextContent(
                new RegExp(aggregateDataExchanges[i].target, 'i')
            )
            expect(exchangeCard).toHaveTextContent(
                `${aggregateDataExchanges[i].source.requests} requests`
            )
        })
    })

    it('should display the edit button when user has the right permission', () => {
        const { screen } = setUp(<EditPage />, {
            userContext: testUserContext({ canAddExchange: true }),
        })
        const exchangeCards = screen.queryAllByTestId('data-exchange-card')
        exchangeCards.map((exchangeCard) => {
            expect(
                within(exchangeCard).queryByRole('button', { name: 'Edit' })
            ).toBeInTheDocument()
        })
    })

    it('should not display the edit button when user does not have the right permission', () => {
        const { screen } = setUp(<EditPage />, {
            userContext: testUserContext({ canAddExchange: false }),
        })
        const exchangeCards = screen.queryAllByTestId('data-exchange-card')
        exchangeCards.map((exchangeCard) => {
            expect(
                within(exchangeCard).queryByRole('button', { name: 'Edit' })
            ).not.toBeInTheDocument()
        })
    })

    it('should display the delete button when user has the right permission', () => {
        const { screen } = setUp(<EditPage />, {
            userContext: testUserContext({ canDeleteExchange: true }),
        })
        const exchangeCards = screen.queryAllByTestId('data-exchange-card')
        exchangeCards.map((exchangeCard) => {
            expect(
                within(exchangeCard).queryByRole('button', { name: 'Delete' })
            ).toBeInTheDocument()
        })
    })

    it('should not display the delete button when user does not have the right permission', () => {
        const { screen } = setUp(<EditPage />, {
            userContext: testUserContext({ canDeleteExchange: false }),
        })
        const exchangeCards = screen.queryAllByTestId('data-exchange-card')
        exchangeCards.map((exchangeCard) => {
            expect(
                within(exchangeCard).queryByRole('button', { name: 'Delete' })
            ).not.toBeInTheDocument()
        })
    })

    it('should display the sharing button when user has the right permission', () => {
        const { screen } = setUp(<EditPage />, {
            aggregateDataExchanges: [
                testDataExchange({ writeMetadataAccess: true }),
            ],
            userContext: testUserContext({ canAddExchange: true }),
        })
        const exchangeCards = screen.queryAllByTestId('data-exchange-card')
        exchangeCards.map((exchangeCard) => {
            expect(
                within(exchangeCard).queryByRole('button', { name: 'Sharing' })
            ).toBeInTheDocument()
        })
    })

    it('should not display the sharing button when user does not have metadata write access', () => {
        const { screen } = setUp(<EditPage />, {
            aggregateDataExchanges: [
                testDataExchange({ writeMetadataAccess: false }),
            ],
            userContext: testUserContext({ canAddExchange: true }),
        })
        const exchangeCards = screen.queryAllByTestId('data-exchange-card')
        exchangeCards.map((exchangeCard) => {
            expect(
                within(exchangeCard).queryByRole('button', { name: 'Sharing' })
            ).not.toBeInTheDocument()
        })
    })

    it('should not display the sharing button when user does not have add exchange permissions', () => {
        const { screen } = setUp(<EditPage />, {
            aggregateDataExchanges: [
                testDataExchange({ writeMetadataAccess: true }),
            ],
            userContext: testUserContext({ canAddExchange: false }),
        })
        const exchangeCards = screen.queryAllByTestId('data-exchange-card')
        exchangeCards.map((exchangeCard) => {
            expect(
                within(exchangeCard).queryByRole('button', { name: 'Sharing' })
            ).not.toBeInTheDocument()
        })
    })

    it('should open a sharing dialog when the sharing button is clicked', async () => {
        const { screen } = setUp(<EditPage />, {
            aggregateDataExchanges: [
                testDataExchange({
                    writeMetadataAccess: true,
                }),
            ],
            userContext: testUserContext({ canAddExchange: true }),
        })
        const exchangeCard = screen.queryByTestId('data-exchange-card')
        within(exchangeCard).getByRole('button', { name: 'Sharing' }).click()

        expect(screen.getByTestId('mock-sharing-dialog')).toBeInTheDocument()
    })
})
