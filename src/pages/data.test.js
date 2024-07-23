import '@testing-library/jest-dom'
import { CustomDataProvider } from '@dhis2/app-runtime'
import { configure, render, waitFor, within } from '@testing-library/react'
import React from 'react'
import { MemoryRouter, Route } from 'react-router-dom'
import { QueryParamProvider } from 'use-query-params'
import { ReactRouter6Adapter } from 'use-query-params/adapters/react-router-6'
import { formatData } from '../components/view/data-workspace/requests-display'
import { getRelativeTimeDifference } from '../components/view/data-workspace/title-bar'
import { getReportText } from '../components/view/submit-modal/submit-modal'
import { AppContext, UserContext } from '../context'
import {
    testDataExchange,
    testDataExchangeSourceData,
    testImportSummary,
    testRequest,
    testUserContext,
} from '../utils/builders.js'
import { DataPage } from './data'

const lastAnalyticsTableSuccess = '2024-07-07T21:47:58.383'
const serverDate = '2024-07-18T17:36:38.164'
const contextPath = 'debug.dhis2.org/dev'
let mockImportSummariesResponse = {}

jest.mock('@dhis2/app-runtime', () => ({
    ...jest.requireActual('@dhis2/app-runtime'),
    useConfig: () => ({
        baseUrl: 'https://debug.dhis2.org/dev',
        apiVersion: '41',
        systemInfo: {
            lastAnalyticsTableSuccess,
            serverDate,
            serverTimeZoneId: 'Etc/UTC',
            contextPath: `https://${contextPath}`,
        },
    }),
    useDataEngine: jest.fn().mockReturnValue({
        mutate: () => {
            return mockImportSummariesResponse
        },
    }),
}))

const setUp = (
    ui,
    {
        aggregateDataExchanges = [testDataExchange(), testDataExchange()],
        exchangeId = null,
        exchangeData = testDataExchangeSourceData(),
        loadExchangeDataForever = false,
        importSummaryResponse = { importSummaries: [testImportSummary()] },
    } = {}
) => {
    mockImportSummariesResponse = importSummaryResponse
    const routerParams = exchangeId ? `?exchangeId=${exchangeId}` : ''
    const aggregateDataExchangesData =
        exchangeId &&
        aggregateDataExchanges.find((exchange) => exchange.id === exchangeId)

    const customerProviderData = aggregateDataExchangesData
        ? {
              aggregateDataExchanges: (_, params) => {
                  return params.id === exchangeId
                      ? Promise.resolve(aggregateDataExchangesData)
                      : Promise.resolve([exchangeData])
              },
          }
        : {}

    const screen = render(
        <CustomDataProvider
            data={customerProviderData}
            queryClientOptions={{}}
            options={{ loadForever: loadExchangeDataForever }}
        >
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
                        <UserContext.Provider value={testUserContext()}>
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
        const { screen, aggregateDataExchanges } = setUp(<DataPage />, {
            aggregateDataExchanges: exchanges,
        })

        screen.getByTestId('dhis2-ui-selectorbaritem').click()
        const menuItems = await screen.findAllByTestId('dhis2-uicore-menuitem')
        expect(menuItems).toHaveLength(2)
        menuItems.map((menuItem, i) => {
            expect(menuItem).toHaveTextContent(exchanges[i].displayName)
        })
    })

    it('should display a genera message when no exchange is selected ', async () => {
        const { screen, aggregateDataExchanges } = setUp(<DataPage />)

        expect(screen.getByTestId('entry-screen-message')).toBeInTheDocument()
    })

    it('should select and clear the selected exchange', async () => {
        const anExchange = testDataExchange()
        const exchanges = [anExchange, testDataExchange()]
        const { screen, router } = setUp(<DataPage />, {
            aggregateDataExchanges: exchanges,
        })

        screen.getByTestId('dhis2-ui-selectorbaritem').click()

        const menuItems = await screen.findAllByTestId('dhis2-uicore-menuitem')
        within(menuItems[0]).queryByText(anExchange.displayName).click()
        expect(screen.getByTestId('data-exchange-selector')).toHaveTextContent(
            anExchange.displayName
        )

        const headerBar = screen.getByTestId('dhis2-ui-selectorbar')
        within(headerBar)
            .queryByRole('button', { name: 'Clear selections' })
            .click()
        expect(screen.getByTestId('data-exchange-selector')).toHaveTextContent(
            'Choose a data exchange'
        )
    })

    it('should display the correct exchange specified in url if the param is present', async () => {
        const anExchange = testDataExchange()
        const exchanges = [anExchange, testDataExchange()]
        const { screen, router } = setUp(<DataPage />, {
            aggregateDataExchanges: exchanges,
            exchangeId: anExchange.id,
        })

        expect(screen.getByTestId('data-exchange-selector')).toHaveTextContent(
            anExchange.displayName
        )
    })

    it('should display a preview table once an exchange id selected', async () => {
        const anExchange = testDataExchange()

        const exchanges = [anExchange]
        const exchangeData = testDataExchangeSourceData()
        const { screen, router } = setUp(<DataPage />, {
            aggregateDataExchanges: exchanges,
            exchangeId: anExchange.id,
            exchangeData,
        })

        const titleBar = await screen.findByTestId('title-bar')
        expect(titleBar).toHaveTextContent(anExchange.displayName)
        expect(titleBar).toHaveTextContent(
            `${anExchange.source.requests.length} data report`
        )
        const timeDifference = getRelativeTimeDifference({
            startTimestamp: lastAnalyticsTableSuccess,
            endTimestamp: serverDate,
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
        expect(
            within(dataTable).getByTestId('dhis2-uicore-tablehead')
        ).toHaveTextContent(formattedData.title)
        const tableRows = within(dataTable).getAllByTestId(
            'dhis2-uicore-datatablerow'
        )
        expect(tableRows).toHaveLength(3)
        formattedData.headers.map((tableHeader) =>
            expect(tableRows[0]).toHaveTextContent(tableHeader.name)
        )
        formattedData.rows[0].map((firstRowCell) =>
            expect(tableRows[1]).toHaveTextContent(firstRowCell)
        )
        formattedData.rows[1].map((secondRowCell) =>
            expect(tableRows[2]).toHaveTextContent(secondRowCell)
        )
    })

    it('should show a submit modal for internal exchange when the user clicks on the submit data button', async () => {
        const anExchangeRequest = testRequest()
        const anExchange = testDataExchange({
            targetType: 'INTERNAL',
            requests: [anExchangeRequest],
        })

        const exchanges = [anExchange]
        const exchangeData = testDataExchangeSourceData()
        const { screen, router } = setUp(<DataPage />, {
            aggregateDataExchanges: exchanges,
            exchangeId: anExchange.id,
            exchangeData,
        })

        const bottomBar = await screen.findByTestId('bottom-bar')
        within(bottomBar).getByRole('button', { name: 'Submit data' }).click()
        const submitModal = await screen.findByTestId('dhis2-uicore-card')
        expect(submitModal).toBeInTheDocument()
        expect(submitModal).toHaveTextContent(
            `1 report to ${anExchange.displayName} internally at ${contextPath}`
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
        const { screen, router } = setUp(<DataPage />, {
            aggregateDataExchanges: exchanges,
            exchangeId: anExchange.id,
            exchangeData,
        })

        const bottomBar = await screen.findByTestId('bottom-bar')
        within(bottomBar).getByRole('button', { name: 'Submit data' }).click()
        const submitModal = await screen.findByTestId('dhis2-uicore-card')
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
        const { screen, router } = setUp(<DataPage />, {
            aggregateDataExchanges: exchanges,
            exchangeId: anExchange.id,
            importSummaryResponse: { importSummaries },
        })

        const bottomBar = await screen.findByTestId('bottom-bar')

        const submitButton = within(bottomBar).getByRole('button', {
            name: 'Submit data',
        })
        submitButton.click()

        const submitModal = await screen.findByTestId('dhis2-uicore-card')
        within(submitModal).getByTestId('confirm-submission-button').click()

        waitFor(() => expect(submitButton).toBeDisabled())
        const successTag = await screen.findByTestId('dhis2-uicore-tag')
        expect(successTag).toBeInTheDocument()

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
        const { screen, router } = setUp(<DataPage />, {
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

        const submitModal = await screen.findByTestId('dhis2-uicore-card')
        within(submitModal).getByTestId('confirm-submission-button').click()

        waitFor(() => expect(submitButton).toBeDisabled())
        const warning = await screen.findByTestId('warning')
        expect(warning).toBeInTheDocument()
        expect(warning).toHaveTextContent('There was a problem submitting data')
    })

    it('should show a progress bar when loading content', async () => {
        const anExchange = testDataExchange()
        const exchanges = [anExchange]

        const { screen, router } = setUp(<DataPage />, {
            aggregateDataExchanges: exchanges,
            exchangeId: anExchange.id,
            loadExchangeDataForever: true,
        })

        const loader = await screen.findByTestId('dhis2-uicore-circularloader')
        expect(loader).toBeInTheDocument()
    })

    it('should display a warning if there are no requests', async () => {
        const anExchange = testDataExchange({ requests: null })
        const exchanges = [anExchange, testDataExchange()]
        const { screen, router } = setUp(<DataPage />, {
            aggregateDataExchanges: exchanges,
            exchangeId: anExchange.id,
        })

        expect(
            await screen.findByTestId('no-exchange-data-warning')
        ).toBeInTheDocument()
    })
})
