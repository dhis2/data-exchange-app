import '@testing-library/jest-dom'
import { CustomDataProvider } from '@dhis2/app-runtime'
import { act, configure, render, waitFor, within } from '@testing-library/react'
import React from 'react'
import { MemoryRouter, Route } from 'react-router-dom'
import { QueryParamProvider } from 'use-query-params'
import { ReactRouter6Adapter } from 'use-query-params/adapters/react-router-6'
import { formatData } from '../components/view/data-workspace/requests-display/index.js'
import { getRelativeTimeDifference } from '../components/view/data-workspace/title-bar/index.js'
import { getReportText } from '../components/view/submit-modal/submit-modal.js'
import { AppContext, UserContext } from '../context/index.js'
import {
    addOnlyPermissionsUserContext,
    allPermissionsUserContext,
    noPermissionsUserContext,
    testDataExchange,
    testDataExchangeSourceData,
    testImportSummary,
    testRequest,
    testUserContext,
} from '../utils/builders.js'
import { DataPage } from './data.js'

const mockLastAnalyticsTableSuccess = '2024-07-07T21:47:58.383'
const mockServerDate = '2024-07-18T17:36:38.164'
const mockContextPath = 'debug.dhis2.org/dev'

jest.mock('@dhis2/app-runtime', () => ({
    ...jest.requireActual('@dhis2/app-runtime'),
    useConfig: () => ({
        baseUrl: 'https://debug.dhis2.org/dev',
        apiVersion: '41',
        systemInfo: {
            lastAnalyticsTableSuccess: mockLastAnalyticsTableSuccess,
            serverDate: mockServerDate,
            serverTimeZoneId: 'Etc/UTC',
            contextPath: `https://${mockContextPath}`,
        },
    }),
}))

const setUp = (
    ui,
    {
        aggregateDataExchanges = [testDataExchange(), testDataExchange()],
        exchangeId = null,
        exchangeData = [testDataExchangeSourceData()],
        importSummaryResponse = { importSummaries: [testImportSummary()] },
        userContext = testUserContext(),
    } = {}
) => {
    const routerParams = exchangeId ? `?exchangeId=${exchangeId}` : ''

    const customerProviderData = {
        aggregateDataExchanges: (type, params) => {
            const sourceDataRegExpr = /^[\w\d]+\/sourceData$/
            return sourceDataRegExpr.test(params.id)
                ? Promise.resolve(exchangeData)
                : Promise.resolve(
                      aggregateDataExchanges.find(
                          (exchange) => exchange.id === params.id
                      )
                  )
        },
        [`aggregateDataExchanges/${exchangeId}/exchange`]: (type) =>
            type === 'create' ? importSummaryResponse : undefined,
    }

    const screen = render(
        <CustomDataProvider data={customerProviderData} queryClientOptions={{}}>
            <MemoryRouter initialEntries={[routerParams]}>
                <QueryParamProvider
                    ReactRouterRoute={Route}
                    adapter={ReactRouter6Adapter}
                >
                    <AppContext.Provider
                        value={{
                            aggregateDataExchanges,
                            refetchExchanges: () => {},
                        }}
                    >
                        <UserContext.Provider value={userContext}>
                            {ui}
                        </UserContext.Provider>
                    </AppContext.Provider>
                </QueryParamProvider>
            </MemoryRouter>
        </CustomDataProvider>
    )

    return { screen, aggregateDataExchanges }
}

beforeEach(() => {
    configure({
        testIdAttribute: 'data-test',
    })
})

describe('<DataPage/>', () => {
    it('should display a drop down to select an exchange', async () => {
        const exchanges = [testDataExchange(), testDataExchange()]
        const { screen } = setUp(<DataPage />, {
            aggregateDataExchanges: exchanges,
        })

        screen.getByTestId('dhis2-ui-selectorbaritem').click()
        const menuItems = await screen.findAllByTestId('dhis2-uicore-menuitem')
        expect(menuItems).toHaveLength(2)
        menuItems.map((menuItem, i) => {
            expect(menuItem).toHaveTextContent(exchanges[i].displayName)
        })
    })

    it('should display a general message when no exchange is selected ', async () => {
        const { screen } = setUp(<DataPage />)

        expect(screen.getByTestId('entry-screen-message')).toBeInTheDocument()
    })

    it('should show an edit configurations button when the user all permissions', async () => {
        const { screen } = setUp(<DataPage />, {
            userContext: allPermissionsUserContext(),
        })

        expect(screen.getByTestId('configurations-button')).toBeInTheDocument()
    })

    it('should show an edit configurations button when the user has add only permissions', async () => {
        const { screen } = setUp(<DataPage />, {
            userContext: addOnlyPermissionsUserContext(),
        })

        expect(screen.getByTestId('configurations-button')).toBeInTheDocument()
    })

    it('should not show an edit configurations button when the user has no permissions', async () => {
        const { screen } = setUp(<DataPage />, {
            userContext: noPermissionsUserContext(),
        })

        expect(
            screen.queryByTestId('configurations-button')
        ).not.toBeInTheDocument()
    })

    it('should select and clear the selected exchange', async () => {
        const anExchange = testDataExchange()
        const exchanges = [anExchange, testDataExchange()]
        const { screen } = setUp(<DataPage />, {
            aggregateDataExchanges: exchanges,
        })

        screen.getByTestId('dhis2-ui-selectorbaritem').click()

        const menuItems = await screen.findAllByTestId('dhis2-uicore-menuitem')
        within(menuItems[0]).queryByText(anExchange.displayName).click()
        expect(screen.getByTestId('data-exchange-selector')).toHaveTextContent(
            anExchange.displayName
        )

        const loader = screen.getByTestId('dhis2-uicore-circularloader')
        expect(loader).toBeInTheDocument()

        const headerBar = screen.getByTestId('dhis2-ui-selectorbar')
        within(headerBar)
            .queryByRole('button', { name: 'Clear selections' })
            .click()
        expect(screen.getByTestId('data-exchange-selector')).toHaveTextContent(
            'Choose a data exchange'
        )
    })

    it('should show a progress bar when loading content', async () => {
        const anExchange = testDataExchange()
        const exchanges = [anExchange]

        const { screen } = setUp(<DataPage />, {
            aggregateDataExchanges: exchanges,
            exchangeId: anExchange.id,
        })

        const loader = await screen.getByTestId('dhis2-uicore-circularloader')
        expect(loader).toBeInTheDocument()
    })

    it('should display a warning if there are no requests', async () => {
        const anExchange = testDataExchange({ requests: null })
        const exchanges = [anExchange, testDataExchange()]
        const { screen } = setUp(<DataPage />, {
            aggregateDataExchanges: exchanges,
            exchangeId: anExchange.id,
        })

        expect(
            await screen.findByTestId('no-exchange-data-warning')
        ).toBeInTheDocument()
    })

    it('should display the correct exchange specified in url if the param is present', async () => {
        const anExchange = testDataExchange()
        const exchanges = [anExchange, testDataExchange()]
        const { screen } = setUp(<DataPage />, {
            aggregateDataExchanges: exchanges,
            exchangeId: anExchange.id,
        })

        expect(screen.getByTestId('data-exchange-selector')).toHaveTextContent(
            anExchange.displayName
        )

        const loader = screen.getByTestId('dhis2-uicore-circularloader')
        expect(loader).toBeInTheDocument()
    })

    it('should display a preview table once an exchange is selected', async () => {
        const anExchange = testDataExchange()

        const exchanges = [anExchange]
        const exchangeData = testDataExchangeSourceData()
        const { screen } = setUp(<DataPage />, {
            aggregateDataExchanges: exchanges,
            exchangeId: anExchange.id,
            exchangeData: [exchangeData],
        })

        const titleBar = await screen.findByTestId('title-bar')
        expect(titleBar).toHaveTextContent(anExchange.displayName)
        expect(titleBar).toHaveTextContent(
            `${anExchange.source.requests.length} data report`
        )
        const timeDifference = getRelativeTimeDifference({
            startTimestamp: mockLastAnalyticsTableSuccess,
            endTimestamp: mockServerDate,
        })
        expect(titleBar).toHaveTextContent(
            `Source data was generated ${timeDifference} ago`
        )

        const tabBar = await screen.findByTestId('dhis2-uicore-tabbar')
        expect(within(tabBar).getAllByTestId('dhis2-uicore-tab')).toHaveLength(
            anExchange.source.requests.length
        )
        anExchange.source.requests.map((request) => {
            expect(tabBar).toHaveTextContent(request.name)
        })

        const dataTable = await screen.findByTestId('dhis2-uicore-datatable')
        const formattedData = formatData(exchangeData)[0]
        expect(dataTable).toBeInTheDocument()
        expect(
            within(dataTable).getByTestId('dhis2-uicore-tablehead')
        ).toHaveTextContent(formattedData.title)
        const tableRows = within(dataTable).getAllByTestId(
            'dhis2-uicore-datatablerow'
        )
        expect(tableRows).toHaveLength(3)

        expect(tableRows[0]).toHaveTextContent(
            formattedData.headers.map((h) => h.name).join('')
        )
        expect(tableRows[1]).toHaveTextContent(formattedData.rows[0].join(''))
        expect(tableRows[2]).toHaveTextContent(formattedData.rows[1].join(''))
    })

    it('can show the correct data once another tab is clicked on', async () => {
        const anExchange = testDataExchange({
            requests: [testRequest(), testRequest()],
        })

        const exchanges = [anExchange]
        const exchangesData = [
            testDataExchangeSourceData(),
            testDataExchangeSourceData(),
        ]
        const { screen } = setUp(<DataPage />, {
            aggregateDataExchanges: exchanges,
            exchangeId: anExchange.id,
            exchangeData: exchangesData,
        })

        const tabBar = await screen.findByTestId('dhis2-uicore-tabbar')
        const tabs = within(tabBar).getAllByTestId('dhis2-uicore-tab')
        expect(tabs).toHaveLength(anExchange.source.requests.length)
        tabs[1].click()

        const dataTable = await screen.findByTestId('dhis2-uicore-datatable')
        const formattedData = formatData(exchangesData[1])[0]
        expect(dataTable).toBeInTheDocument()
        expect(
            within(dataTable).getByTestId('dhis2-uicore-tablehead')
        ).toHaveTextContent(formattedData.title)
        const tableRows = within(dataTable).getAllByTestId(
            'dhis2-uicore-datatablerow'
        )
        expect(tableRows).toHaveLength(3)

        expect(tableRows[0]).toHaveTextContent(
            formattedData.headers.map((h) => h.name).join('')
        )
        expect(tableRows[1]).toHaveTextContent(formattedData.rows[0].join(''))
        expect(tableRows[2]).toHaveTextContent(formattedData.rows[1].join(''))
    })

    it('should show a submit modal for internal exchange when the user clicks on the submit data button', async () => {
        const anExchangeRequest = testRequest()
        const anExchange = testDataExchange({
            targetType: 'INTERNAL',
            requests: [anExchangeRequest],
        })

        const exchanges = [anExchange]
        const exchangeData = testDataExchangeSourceData()
        const { screen } = setUp(<DataPage />, {
            aggregateDataExchanges: exchanges,
            exchangeId: anExchange.id,
            exchangeData: [exchangeData],
        })

        const bottomBar = await screen.findByTestId('bottom-bar')
        within(bottomBar).getByRole('button', { name: 'Submit data' }).click()
        const submitModal = await screen.findByTestId('submit-modal-content')
        expect(submitModal).toBeInTheDocument()
        expect(submitModal).toHaveTextContent(
            `1 report to ${anExchange.displayName} internally at ${mockContextPath}`
        )
        expect(submitModal).toHaveTextContent(
            getReportText({
                name: anExchangeRequest.name,
                orgUnits: exchangeData.metaData.dimensions.ou,
                periods: exchangeData.metaData.dimensions.pe.map(
                    (period) => exchangeData.metaData?.items[period]?.name
                ),
            })
        )
    })

    it('should show a submit modal for external exchange when the user clicks on the submit data button', async () => {
        const externalURL = 'a/url'
        const anExchangeRequest = testRequest()
        const anExchange = testDataExchange({
            targetType: 'EXTERNAL',
            externalURL: externalURL,
            requests: [anExchangeRequest],
        })
        const exchanges = [anExchange]
        const exchangeData = testDataExchangeSourceData()
        const { screen } = setUp(<DataPage />, {
            aggregateDataExchanges: exchanges,
            exchangeId: anExchange.id,
            exchangeData: [exchangeData],
        })

        const bottomBar = await screen.findByTestId('bottom-bar')
        within(bottomBar).getByRole('button', { name: 'Submit data' }).click()
        const submitModal = await screen.findByTestId('submit-modal-content')
        expect(submitModal).toBeInTheDocument()
        expect(submitModal).toHaveTextContent(
            `1 report to ${anExchange.displayName} at ${externalURL}`
        )
        expect(submitModal).toHaveTextContent(
            getReportText({
                name: anExchangeRequest.name,
                orgUnits: exchangeData.metaData.dimensions.ou,
                periods: exchangeData.metaData.dimensions.pe.map(
                    (period) => exchangeData.metaData?.items[period]?.name
                ),
            })
        )
    })

    it('show the results when a exchange data is submitted successfully', async () => {
        const importSummaries = [testImportSummary(), testImportSummary()]
        const anExchange = testDataExchange({
            requests: [testRequest(), testRequest()],
        })

        const exchanges = [anExchange]
        const { screen } = setUp(<DataPage />, {
            aggregateDataExchanges: exchanges,
            exchangeId: anExchange.id,
            importSummaryResponse: { importSummaries },
        })

        const bottomBar = await screen.findByTestId('bottom-bar')

        const submitButton = within(bottomBar).getByRole('button', {
            name: 'Submit data',
        })
        submitButton.click()

        const submitModal = await screen.findByTestId('submit-modal-content')
        within(submitModal).getByTestId('confirm-submission-button').click()

        const successTag = await screen.findByTestId('dhis2-uicore-tag')
        expect(successTag).toBeInTheDocument()

        await act(async () => {})
        waitFor(() => {
            expect(submitButton).toBeDisabled()
        })

        const summaryBoxes = screen.getAllByTestId('summary-box')
        expect(summaryBoxes).toHaveLength(3)
        expect(summaryBoxes[0]).toHaveTextContent(
            `${
                importSummaries[0].importCount.imported +
                importSummaries[1].importCount.imported
            }imported`
        )
        expect(summaryBoxes[1]).toHaveTextContent(
            `${
                importSummaries[0].importCount.updated +
                importSummaries[1].importCount.updated
            }updated`
        )
        expect(summaryBoxes[2]).toHaveTextContent(
            `${
                importSummaries[0].importCount.ignored +
                importSummaries[1].importCount.ignored
            }ignored`
        )

        const summariesRows = within(submitModal).getAllByTestId(
            'dhis2-uicore-datatablerow'
        )
        expect(summariesRows).toHaveLength(3)
        expect(summariesRows[1]).toHaveTextContent(
            anExchange.source.requests[0].name
        )
        expect(summariesRows[1]).toHaveTextContent(
            importSummaries[0].importCount.imported
        )
        expect(summariesRows[1]).toHaveTextContent(
            importSummaries[0].importCount.updated
        )
        expect(summariesRows[1]).toHaveTextContent(
            importSummaries[0].importCount.ignored
        )

        expect(summariesRows[2]).toHaveTextContent(
            anExchange.source.requests[1].name
        )
        expect(summariesRows[2]).toHaveTextContent(
            importSummaries[1].importCount.imported
        )
        expect(summariesRows[2]).toHaveTextContent(
            importSummaries[1].importCount.updated
        )
        expect(summariesRows[2]).toHaveTextContent(
            importSummaries[1].importCount.ignored
        )
    })

    it('show an error when a exchange data is submitted un-successfully', async () => {
        const importSummariesWithError = [
            testImportSummary(),
            testImportSummary({ status: 'ERROR' }),
        ]
        const anExchange = testDataExchange({
            requests: [testRequest(), testRequest()],
        })

        const exchanges = [anExchange]
        const { screen } = setUp(<DataPage />, {
            aggregateDataExchanges: exchanges,
            exchangeId: anExchange.id,
            importSummaryResponse: {
                importSummaries: importSummariesWithError,
                status: 'ERROR',
            },
        })

        const bottomBar = await screen.findByTestId('bottom-bar')

        const submitButton = within(bottomBar).getByRole('button', {
            name: 'Submit data',
        })
        submitButton.click()

        const submitModal = await screen.findByTestId('submit-modal-content')
        within(submitModal).getByTestId('confirm-submission-button').click()

        const warning = await screen.findByTestId('warning')
        expect(warning).toBeInTheDocument()
        expect(warning).toHaveTextContent('There was a problem submitting data')
    })

    it('show an error when a exchange data when submitting data fails', async () => {
        jest.mock('@dhis2/app-runtime', () => ({
            ...jest.requireActual('@dhis2/app-runtime'),
            useDataEngine: jest.fn().mockRejectedValue('OH NO'),
        }))
        const importSummariesWithError = [
            testImportSummary(),
            testImportSummary({ status: 'ERROR' }),
        ]
        const anExchange = testDataExchange({
            requests: [testRequest(), testRequest()],
        })

        const exchanges = [anExchange]
        const { screen } = setUp(<DataPage />, {
            aggregateDataExchanges: exchanges,
            exchangeId: anExchange.id,
            importSummaryResponse: {
                importSummaries: importSummariesWithError,
                status: 'ERROR',
            },
        })

        const bottomBar = await screen.findByTestId('bottom-bar')

        const submitButton = within(bottomBar).getByRole('button', {
            name: 'Submit data',
        })
        submitButton.click()

        const submitModal = await screen.findByTestId('submit-modal-content')
        within(submitModal).getByTestId('confirm-submission-button').click()

        const warning = await screen.findByTestId('warning')
        expect(warning).toBeInTheDocument()
        expect(warning).toHaveTextContent('There was a problem submitting data')
    })
})
