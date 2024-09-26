import '@testing-library/jest-dom'
import { Provider } from '@dhis2/app-runtime'
import { render } from '@testing-library/react'
import React from 'react'
import { MemoryRouter, Route } from 'react-router-dom'
import { QueryParamProvider } from 'use-query-params'
import { ReactRouter6Adapter } from 'use-query-params/adapters/react-router-6'
import { TitleBar } from '../title-bar/index.js'

const mockLastAnalyticsTableSuccess = '2024-07-07T12:00:00.000'
const mockContextPath = 'debug.dhis2.org/dev'

const CONFIG_DEFAULTS = {
    baseUrl: 'https://debug.dhis2.org/dev',
    apiVersion: '41',
    systemInfo: {
        lastAnalyticsTableSuccess: mockLastAnalyticsTableSuccess,
        serverTimeZoneId: 'Etc/UTC',
        contextPath: `https://${mockContextPath}`,
    },
}

const setUp = (
    ui,
    {
        timezone = 'Etc/UTC',
        lastAnalyticsTableSuccess = mockLastAnalyticsTableSuccess,
    } = {}
) => {
    const routerParams = ''
    const configUpdated = { ...CONFIG_DEFAULTS }
    configUpdated.systemInfo.serverTimeZoneId = timezone
    configUpdated.systemInfo.lastAnalyticsTableSuccess =
        lastAnalyticsTableSuccess

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

describe('Title Bar (last updated)', () => {
    beforeEach(() => {
        jest.useFakeTimers('modern')
    })

    afterEach(() => {
        jest.useRealTimers()
    })

    it('shows time difference without correction if server/client is same time zone', () => {
        jest.setSystemTime(new Date('2024-07-07T13:00:00.000').getTime())
        const { screen } = setUp(<TitleBar />)
        expect(
            screen.getByText('Source data was generated an hour ago')
        ).toBeInTheDocument()
    })

    // server has last updated of 12:00 in Kampala, our system time is 13:00 UTC (which is 16:00 Kampala)
    it('corrects for time zone (Kampala)', () => {
        jest.setSystemTime(new Date('2024-07-07T13:00:00.000').getTime())
        const { screen } = setUp(<TitleBar />, { timezone: 'Africa/Kampala' })
        expect(
            screen.getByText('Source data was generated 4 hours ago')
        ).toBeInTheDocument()
    })

    // server has last updated of 12:00 in Vientaine, our system time is 13:00 UTC (which is 20:00 Vientiane)
    it('corrects for time zone (Vientiane)', () => {
        jest.setSystemTime(new Date('2024-07-07T13:00:00.000').getTime())
        const { screen } = setUp(<TitleBar />, { timezone: 'Asia/Vientiane' })
        expect(
            screen.getByText('Source data was generated 8 hours ago')
        ).toBeInTheDocument()
    })

    // server has last updated of 12:00 in Oslo, our system time is 13:00 UTC (which is 15:00 Oslo, summer time)
    it('corrects for time zone (Oslo Summer)', () => {
        jest.setSystemTime(new Date('2024-07-07T13:00:00.000').getTime())
        const { screen } = setUp(<TitleBar />, { timezone: 'Europe/Oslo' })
        expect(
            screen.getByText('Source data was generated 3 hours ago')
        ).toBeInTheDocument()
    })

    // server has last updated of 12:00 in Oslo, our system time is 13:00 UTC (which is 14:00 Oslo, summer time)
    it('corrects for time zone (Oslo Winter)', () => {
        jest.setSystemTime(new Date('2024-01-07T13:00:00.000').getTime())
        const { screen } = setUp(<TitleBar />, {
            timezone: 'Europe/Oslo',
            lastAnalyticsTableSuccess: '2024-01-07T12:00:00.000',
        })
        expect(
            screen.getByText('Source data was generated 2 hours ago')
        ).toBeInTheDocument()
    })
})
