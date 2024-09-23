import '@testing-library/jest-dom'
import { Provider } from '@dhis2/app-runtime'
import { render } from '@testing-library/react'
import React from 'react'
import { MemoryRouter, Route } from 'react-router-dom'
import { QueryParamProvider } from 'use-query-params'
import { ReactRouter6Adapter } from 'use-query-params/adapters/react-router-6'
import { useAppContext } from '../../../../context/app-context/use-app-context.js'
import { testDataExchange } from '../../../../utils/builders.js'
import { EditItemsList } from '../items-list.js'

const mockLastAnalyticsTableSuccess = '2024-07-07T12:00:00.000'
const mockContextPath = 'debug.dhis2.org/dev'

jest.mock('../../../../context/app-context/use-app-context.js', () => ({
    useAppContext: jest.fn(() => ({
        aggregateDataExchanges: [],
    })),
}))

const CONFIG_DEFAULTS = {
    baseUrl: 'https://debug.dhis2.org/dev',
    apiVersion: '41',
    systemInfo: {
        lastAnalyticsTableSuccess: mockLastAnalyticsTableSuccess,
        serverTimeZoneId: 'Etc/UTC',
        contextPath: `https://${mockContextPath}`,
    },
}

const setUp = (ui, { timezone = 'Etc/UTC', dateFormat } = {}) => {
    const routerParams = ''
    const configUpdated = { ...CONFIG_DEFAULTS }
    configUpdated.systemInfo.serverTimeZoneId = timezone
    configUpdated.systemInfo.dateFormat = dateFormat

    const screen = render(
        <Provider config={configUpdated}>
            <MemoryRouter initialEntries={[routerParams]}>
                <QueryParamProvider
                    ReactRouterRoute={Route}
                    adapter={ReactRouter6Adapter}
                >
                    {ui}
                </QueryParamProvider>
            </MemoryRouter>
        </Provider>
    )

    return { screen }
}

describe('exchange card dates', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('shows in yyyy-mm-dd if specified', () => {
        const mockExchange = testDataExchange({
            created: '2021-10-11T12:00:00',
            readDataAccess: true,
        })
        useAppContext.mockImplementationOnce(() => ({
            aggregateDataExchanges: [mockExchange],
        }))

        const { screen } = setUp(<EditItemsList />, {
            dateFormat: 'yyyy-mm-dd',
        })
        expect(screen.getByText('Created 2021-10-11')).toBeInTheDocument()
    })

    it('shows in dd-mm-yyyy if specified', () => {
        const mockExchange = testDataExchange({
            created: '2021-10-11T12:00:00',
            readDataAccess: true,
        })
        useAppContext.mockImplementationOnce(() => ({
            aggregateDataExchanges: [mockExchange],
        }))

        const { screen } = setUp(<EditItemsList />, {
            dateFormat: 'dd-mm-yyyy',
        })
        expect(screen.getByText('Created 11-10-2021')).toBeInTheDocument()
    })

    it('shows in yyyy-mm-dd by default', () => {
        const mockExchange = testDataExchange({
            created: '2021-10-11T12:00:00',
            readDataAccess: true,
        })
        useAppContext.mockImplementationOnce(() => ({
            aggregateDataExchanges: [mockExchange],
        }))

        const { screen } = setUp(<EditItemsList />)
        expect(screen.getByText('Created 2021-10-11')).toBeInTheDocument()
    })

    it('pads date values', () => {
        const mockExchange = testDataExchange({
            created: '2021-01-01T12:00:00',
            readDataAccess: true,
        })
        useAppContext.mockImplementationOnce(() => ({
            aggregateDataExchanges: [mockExchange],
        }))

        const { screen } = setUp(<EditItemsList />)
        expect(screen.getByText('Created 2021-01-01')).toBeInTheDocument()
    })

    // if server is in Vientiane, and client is UTC, then 2021-01-11T01:00 Vientaine is 2021-01-10 UTC
    it('displays date based on client time zone', () => {
        const mockExchange = testDataExchange({
            created: '2021-01-11T01:00:00',
            readDataAccess: true,
        })
        useAppContext.mockImplementationOnce(() => ({
            aggregateDataExchanges: [mockExchange],
        }))

        const { screen } = setUp(<EditItemsList />, {
            timezone: 'Asia/Vientiane',
        })
        expect(screen.getByText('Created 2021-01-10')).toBeInTheDocument()
    })
})
