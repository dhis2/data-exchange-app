import '@testing-library/jest-dom'
import {configure, render, within} from '@testing-library/react'
import React from 'react'
import {testDataExchange, testDataExchangeSourceData, testUserContext} from '../utils/builders.js'
import {QueryParamProvider} from "use-query-params";
import {AppContext, UserContext} from '../context/index.js'
import {DataPage} from "./data";
import {CustomDataProvider} from "@dhis2/app-runtime";
import {MemoryRouter, Route} from "react-router-dom";
import {ReactRouter6Adapter} from "use-query-params/adapters/react-router-6";
import {getRelativeTimeDifference} from "../components/view/data-workspace/title-bar";
import {formatData} from "../components/view/data-workspace/requests-display";

const lastAnalyticsTableSuccess = "2024-07-07T21:47:58.383"
const serverDate = "2024-07-18T17:36:38.164"

jest.mock('@dhis2/app-runtime', () => ({
    ...jest.requireActual('@dhis2/app-runtime'),
    useConfig: () => ({
        baseUrl: 'https://debug.dhis2.org/dev',
        apiVersion: '41',
        systemInfo: {
            lastAnalyticsTableSuccess ,
            serverDate,
            serverTimeZoneId: "Etc/UTC"
        }
    }),
}))


const setUp = (
    ui,
    {
        aggregateDataExchanges = [testDataExchange(), testDataExchange()],
        exchangeId= null,
        exchangeData = testDataExchangeSourceData()
    } = {}
) => {
    const routerParams = exchangeId ? `?exchangeId=${exchangeId}` : ''
    const aggregateDataExchangesData = exchangeId && aggregateDataExchanges.find(exchange => exchange.id === exchangeId)

    const customerProviderData = aggregateDataExchangesData
        ? {
        aggregateDataExchanges: (_, params) => {
            return params.id ===  exchangeId
                ? Promise.resolve(aggregateDataExchangesData)
                : Promise.resolve([exchangeData])
        }
    } : {}


    const screen = render(
        <CustomDataProvider
            data={customerProviderData}
            queryClientOptions={{}}
        >
            <MemoryRouter initialEntries={[routerParams]}>
                <QueryParamProvider ReactRouterRoute={Route} adapter={ReactRouter6Adapter}>
                    <AppContext.Provider
                        value={{ aggregateDataExchanges, refetchExchanges: () => {} }}
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
        const {screen, aggregateDataExchanges} = setUp(
            <DataPage/>, {aggregateDataExchanges: exchanges})

        screen.getByTestId('dhis2-ui-selectorbaritem').click()
        const menuItems = await screen.findAllByTestId('dhis2-uicore-menuitem')
        expect(menuItems).toHaveLength(2)
        menuItems.map((menuItem, i) => {
            expect(menuItem).toHaveTextContent(
                exchanges[i].displayName
            )
        })
    })

    it('should select and  clear the selected exchange', async () => {
        let anExchange = testDataExchange();
        const exchanges = [anExchange, testDataExchange()]
        const { screen, router } = setUp(
            <DataPage />, {aggregateDataExchanges: exchanges})

        screen.getByTestId('dhis2-ui-selectorbaritem').click()

        const menuItems = await screen.findAllByTestId('dhis2-uicore-menuitem')
        within(menuItems[0]).queryByText(anExchange.displayName).click()
        expect(screen.getByTestId('data-exchange-selector')).toHaveTextContent(anExchange.displayName)

        const headerBar = screen.getByTestId('dhis2-ui-selectorbar')
        within(headerBar).queryByRole('button', { name: 'Clear selections' }).click()
        expect(screen.getByTestId('data-exchange-selector')).toHaveTextContent('Choose a data exchange')

    })

    it('should display the correct exchange specified in url if the param is present', async () => {
        let anExchange = testDataExchange();
        const exchanges = [anExchange, testDataExchange()]
        const { screen, router } = setUp(
            <DataPage />, {aggregateDataExchanges: exchanges, exchangeId: anExchange.id})

        expect(screen.getByTestId('data-exchange-selector')).toHaveTextContent(anExchange.displayName)

    })

    it('should display a preview table once an exchange id selected', async () => {
        let anExchange = testDataExchange();
        const exchanges = [anExchange, testDataExchange()]
        const exchangeData = testDataExchangeSourceData()
        const { screen, router } = setUp(
            <DataPage />, {
                aggregateDataExchanges: exchanges,
                exchangeId: anExchange.id,
                exchangeData
            })

        const titleBar = await screen.findByTestId('title-bar')
        expect(titleBar).toHaveTextContent(anExchange.displayName)
        expect(titleBar).toHaveTextContent(`${anExchange.source.requests.length} data report`)
        const timeDifference  = getRelativeTimeDifference({
            startTimestamp: lastAnalyticsTableSuccess,
            endTimestamp: serverDate,
        })
        expect(titleBar).toHaveTextContent(`Source data was generated ${timeDifference} ago`)


        const tabBar = await screen.findByTestId('dhis2-uicore-tabbar')
        expect(within(tabBar).getAllByTestId('dhis2-uicore-tab')).toHaveLength(anExchange.source.requests.length)
        anExchange.source.requests.map(request => {
            expect(tabBar).toHaveTextContent(request.name)
        })

        const dataTable = await screen.findByTestId('dhis2-uicore-datatable')
        const formattedData = formatData(exchangeData)[0]
        expect(dataTable).toBeInTheDocument()
        expect(within(dataTable).getByTestId('dhis2-uicore-tablehead')).toHaveTextContent(formattedData.title)

    })

    it('should display a warning if there are no requests', async () => {
        let anExchange = testDataExchange({requests: null});
        const exchanges = [anExchange, testDataExchange()]
        const { screen, router } = setUp(
            <DataPage />, {aggregateDataExchanges: exchanges, exchangeId: anExchange.id})


        expect(await screen.findByTestId('no-exchange-data-warning')).toBeInTheDocument()

    })

    xit('should display a warning if there are no exchange data', async () => {
        let anExchange = testDataExchange();
        const exchanges = [anExchange, testDataExchange()]
        const { screen, router } = setUp(
            <DataPage />,
            {
                aggregateDataExchanges: exchanges,
                exchangeId: anExchange.id,
                exchangeData: null
            })


        expect(await screen.findByTestId('no-report-data-warning')).toBeInTheDocument()

    })


})


