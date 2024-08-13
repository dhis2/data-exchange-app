import '@testing-library/jest-dom'
import { CustomDataProvider } from '@dhis2/app-runtime'
import {
    configure,
    fireEvent,
    render,
    waitFor,
    within,
} from '@testing-library/react'
import React from 'react'
import { MemoryRouter, Route } from 'react-router-dom'
import { QueryParamProvider } from 'use-query-params'
import { ReactRouter6Adapter } from 'use-query-params/adapters/react-router-6'
import { AppContext, UserContext } from '../context/index.js'
import {
    noPermissionsUserContext,
    testAttribute,
    testDataExchange,
    testOrganisationUnitGroup,
    testOrganisationUnitLevels,
    testRequest,
    testUserContext,
} from '../utils/builders.js'
import { EditItem } from './editItem.js'

const mockLastAnalyticsTableSuccess = '2024-07-07T21:47:58.383'
const mockServerDate = '2024-07-18T17:36:38.164'
const mockContextPath = 'debug.dhis2.org/dev'

/* eslint-disable react/prop-types */
jest.mock('@dhis2/analytics', () => ({
    ...jest.requireActual('@dhis2/analytics'),
    DataDimension: ({ onSelect }) => (
        <input
            data-test="fake-data-selector"
            onInput={(e) => onSelect({ items: [e.target.value] })}
        />
    ),
    PeriodDimension: ({ onSelect }) => (
        <input
            data-test="fake-period-selector"
            onInput={(e) => onSelect({ items: [e.target.value] })}
        />
    ),
    OrgUnitDimension: ({ onSelect }) => (
        <input
            data-test="fake-orgunit-selector"
            onInput={(e) =>
                onSelect({ items: [{ id: 'anId', name: e.target.value }] })
            }
        />
    ),
}))

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
            calendar: 'gregorian',
        },
    }),
}))

const setUp = (
    ui,
    {
        userContext = testUserContext(),
        attributes = [testAttribute(), testAttribute()],
        exchangeId = null,
        dataExchange = testDataExchange(),
    } = {}
) => {
    const exchangeIdOrDataExchangeId = exchangeId || dataExchange.id
    const customerProviderData = {
        attributes: { attributes },
        aggregateDataExchanges: (type) => {
            if (type === 'read') {
                return dataExchange.id === exchangeIdOrDataExchangeId
                    ? dataExchange
                    : null
            }
            if (type === 'create') {
                return {}
            }
            return undefined
        },
        [`aggregateDataExchanges/${exchangeIdOrDataExchangeId}`]: () => {
            return {}
        },
        analytics: { headers: [], metaData: { items: {}, dimensions: {} } },
        organisationUnits: { organisationUnits: [] },
        visualizations: { visualizations: [] },
        organisationUnitLevels: {
            organisationUnitLevels: testOrganisationUnitLevels(),
        },
        organisationUnitGroups: {
            organisationUnitGroups: [
                testOrganisationUnitGroup(),
                testOrganisationUnitGroup(),
            ],
        },
    }

    const screen = render(
        <CustomDataProvider data={customerProviderData} queryClientOptions={{}}>
            <MemoryRouter
                initialEntries={[`/edit/${exchangeIdOrDataExchangeId}`]}
            >
                <QueryParamProvider
                    ReactRouterRoute={Route}
                    adapter={ReactRouter6Adapter}
                >
                    <AppContext.Provider
                        value={{
                            aggregateDataExchanges: [
                                dataExchange,
                                testDataExchange(),
                            ],
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

    return { screen }
}

beforeEach(() => {
    configure({
        testIdAttribute: 'data-test',
    })
})

describe('<EditItem/>', () => {
    const createRequest = async (screen, { requestName, orgUnit }) => {
        const requestNameInput = await screen.findByLabelText('Request name')
        fireEvent.input(requestNameInput, { target: { value: requestName } })
        fireEvent.input(screen.getByTestId('fake-data-selector'), {
            target: { value: 'a data element' },
        })
        fireEvent.input(screen.getByTestId('fake-period-selector'), {
            target: { value: 'a period' },
        })
        fireEvent.input(screen.getByTestId('fake-orgunit-selector'), {
            target: { value: orgUnit },
        })
        const footer = screen.getByTestId('edit-request-footer')
        within(footer).getByText('Save request').click()
    }

    it('should display a warning if the user does not have permissions to add an exchange', async () => {
        const { screen } = setUp(<EditItem />, {
            userContext: noPermissionsUserContext(),
        })
        const warning = await screen.findByTestId('dhis2-uicore-noticebox')
        expect(warning).toBeInTheDocument()
        expect(warning).toHaveTextContent(
            'The requested exchange does not exist, or you do not have the relevant authorities to edit it.'
        )

        const backButton = screen.getByTestId('link-to-configuration-page')
        expect(backButton).toBeInTheDocument()
        expect(
            within(backButton).getByRole('link', {
                name: 'Back to configurations page',
            })
        ).toBeInTheDocument()
    })

    it('show the exchange information', async () => {
        const request = testRequest()
        const dataExchange = testDataExchange({ requests: [request] })

        const { screen } = setUp(<EditItem />, {
            userContext: testUserContext({ canAddExchange: true }),
            dataExchange,
        })

        expect(
            await screen.findByTestId('add-exchange-title')
        ).toHaveTextContent('Edit exchange')

        const exchangeNameInput = within(
            screen.getByTestId('exchange-name-input')
        ).getByLabelText('Exchange name')
        expect(exchangeNameInput).toHaveValue(dataExchange.name)

        const typeRadio = within(
            screen.getByTestId('exchange-types')
        ).getAllByRole('radio')

        expect(typeRadio[1].getAttribute('value')).toEqual('INTERNAL')

        dataExchange.target.type === 'INTERNAL'
            ? expect(typeRadio[0]).not.toBeChecked()
            : expect(typeRadio[0]).toBeChecked()

        dataExchange.target.type === 'INTERNAL'
            ? expect(typeRadio[1]).toBeChecked()
            : expect(typeRadio[1]).not.toBeChecked()

        const requestRow = await screen.findByTestId('dhis2-uicore-tablerow')
        expect(requestRow).toHaveTextContent(request.name)
    })

    it('edits an exchange info', async () => {
        const request = testRequest()
        const dataExchange = testDataExchange({
            requests: [request],
            targetType: 'INTERNAL',
        })
        const newExchangeName = 'new name'

        const { screen } = setUp(<EditItem />, {
            userContext: testUserContext({ canAddExchange: true }),
            dataExchange,
        })

        expect(
            await screen.findByTestId('add-exchange-title')
        ).toHaveTextContent('Edit exchange')

        const nameInput = within(
            screen.getByTestId('exchange-name-input')
        ).getByLabelText('Exchange name')
        fireEvent.input(nameInput, { target: { value: newExchangeName } })

        within(screen.getByTestId('edit-item-footer'))
            .getByText('Save exchange')
            .click()

        await waitFor(() =>
            expect(
                screen.getByTestId('saving-exchange-loader')
            ).toBeInTheDocument()
        )
    })

    it('deletes the exchange request', async () => {
        const request = testRequest()
        const dataExchange = testDataExchange({ requests: [request] })

        const { screen } = setUp(<EditItem />, {
            userContext: testUserContext({ canAddExchange: true }),
            dataExchange,
        })

        expect(
            await screen.findByTestId('add-exchange-title')
        ).toHaveTextContent('Edit exchange')

        const requestRow = await screen.findByTestId('dhis2-uicore-tablerow')
        within(requestRow).getByRole('button', { name: 'Delete' }).click()

        await waitFor(() => {
            const noRequestsRow = screen.getByTestId('dhis2-uicore-tablerow')
            expect(noRequestsRow).toHaveTextContent('No requests')
        })
    })

    it('adds an exchange request', async () => {
        const existingRequest = testRequest()
        const newRequestName = 'a new request'
        const dataExchange = testDataExchange({
            requests: [existingRequest],
            targetType: 'INTERNAL',
        })

        const { screen } = setUp(<EditItem />, {
            userContext: testUserContext({ canAddExchange: true }),
            dataExchange,
        })

        expect(
            await screen.findByTestId('add-exchange-title')
        ).toHaveTextContent('Edit exchange')

        screen.getByText('Add request').click()
        await createRequest(screen, { requestName: newRequestName })

        const requestRow = await screen.findAllByTestId('dhis2-uicore-tablerow')
        expect(requestRow).toHaveLength(2)
        expect(requestRow[0]).toHaveTextContent(existingRequest.name)
        expect(requestRow[1]).toHaveTextContent(newRequestName)

        within(screen.getByTestId('edit-item-footer'))
            .getByText('Save exchange')
            .click()

        await waitFor(() =>
            expect(
                screen.getByTestId('saving-exchange-loader')
            ).toBeInTheDocument()
        )
    })

    it('can not edit an external exchange target setup if not explicitly specified', async () => {
        const request = testRequest()
        const dataExchange = testDataExchange({
            requests: [request],
            targetType: 'EXTERNAL',
        })

        const { screen } = setUp(<EditItem />, {
            userContext: testUserContext({ canAddExchange: true }),
            dataExchange,
        })

        expect(
            await screen.findByTestId('add-exchange-title')
        ).toHaveTextContent('Edit exchange')

        const exchangeURLInput = within(
            await screen.findByTestId('exchange-url')
        ).getByLabelText('Target URL')
        expect(exchangeURLInput).toBeDisabled()
    })

    it('can edit an external exchange target setup if explicitly specified', async () => {
        const request = testRequest()
        const dataExchange = testDataExchange({
            requests: [request],
            targetType: 'EXTERNAL',
            externalURL: 'anExchangeUrl.com',
        })
        const { screen } = setUp(<EditItem />, {
            userContext: testUserContext({ canAddExchange: true }),
            dataExchange,
        })

        expect(
            await screen.findByTestId('add-exchange-title')
        ).toHaveTextContent('Edit exchange')

        within(screen.getByTestId('target-setup'))
            .queryByRole('button', {
                name: 'Edit target setup',
            })
            .click()

        const exchangeURLInput = within(
            await screen.findByTestId('exchange-url')
        ).getByLabelText('Target URL')
        expect(exchangeURLInput).not.toBeDisabled()

        fireEvent.input(exchangeURLInput, {
            target: { value: 'newExchangeUrl.com' },
        })

        const authRadio = within(
            screen.getByTestId('exchange-auth-method')
        ).getAllByRole('radio')
        expect(authRadio[1].getAttribute('value')).toEqual('PAT')
        authRadio[1].click()

        const tokenInput = within(
            screen.getByTestId('exchange-auth-pat')
        ).getByLabelText('Access token')
        fireEvent.input(tokenInput, { target: { value: 'exchangePAT' } })

        within(screen.getByTestId('edit-item-footer'))
            .getByText('Save exchange')
            .click()

        await waitFor(() =>
            expect(
                screen.getByTestId('saving-exchange-loader')
            ).toBeInTheDocument()
        )
    })

    it('can not edit an external exchange advanced options if not explicitly specified', async () => {
        const request = testRequest()
        const dataExchange = testDataExchange({
            requests: [request],
            targetType: 'EXTERNAL',
        })

        const { screen } = setUp(<EditItem />, {
            userContext: testUserContext({ canAddExchange: true }),
            dataExchange,
        })

        expect(
            await screen.findByTestId('add-exchange-title')
        ).toHaveTextContent('Edit exchange')

        screen.getByTestId('advanced-options').click()

        const generalIdSchemeRadio = within(
            screen.getByTestId('general-id-scheme-selector')
        ).getAllByRole('radio')
        generalIdSchemeRadio.map((r) => expect(r).toBeDisabled())

        const elementIdSchemeRadio = within(
            screen.getByTestId('element-id-scheme-selector')
        ).getAllByRole('radio')
        elementIdSchemeRadio.map((r) => expect(r).toBeDisabled())

        const orgUnitIdSchemeRadio = within(
            screen.getByTestId('org-unit-id-scheme-selector')
        ).getAllByRole('radio')
        orgUnitIdSchemeRadio.map((r) => expect(r).toBeDisabled())

        const categoryOptionComboSchemeRadio = within(
            screen.getByTestId('category-option-combo-scheme-selector')
        ).getAllByRole('radio')
        categoryOptionComboSchemeRadio.map((r) => expect(r).toBeDisabled())
    })

    it('can not edit an external exchange target advanced options if explicitly specified but auth info is not re-entered ', async () => {
        const request = testRequest()
        const dataExchange = testDataExchange({
            requests: [request],
            targetType: 'EXTERNAL',
            externalURL: 'a/url',
        })
        const { screen } = setUp(<EditItem />, {
            userContext: testUserContext({ canAddExchange: true }),
            dataExchange,
        })

        expect(
            await screen.findByTestId('add-exchange-title')
        ).toHaveTextContent('Edit exchange')

        screen.getByTestId('advanced-options').click()

        const editButton = await screen.findByRole('button', {
            name: 'Edit advanced options',
        })

        editButton.click()

        const generalIdSchemeRadio = within(
            screen.getByTestId('general-id-scheme-selector')
        ).getAllByRole('radio')
        generalIdSchemeRadio.map((r) => expect(r).not.toBeDisabled())
        generalIdSchemeRadio[1].click()

        const elementIdSchemeRadio = within(
            screen.getByTestId('element-id-scheme-selector')
        ).getAllByRole('radio')
        elementIdSchemeRadio.map((r) => expect(r).not.toBeDisabled())
        elementIdSchemeRadio[1].click()

        const orgUnitIdSchemeRadio = within(
            screen.getByTestId('org-unit-id-scheme-selector')
        ).getAllByRole('radio')
        orgUnitIdSchemeRadio.map((r) => expect(r).not.toBeDisabled())
        orgUnitIdSchemeRadio[1].click()

        const categoryOptionComboSchemeRadio = within(
            screen.getByTestId('category-option-combo-scheme-selector')
        ).getAllByRole('radio')
        categoryOptionComboSchemeRadio.map((r) => expect(r).not.toBeDisabled())
        categoryOptionComboSchemeRadio[1].click()

        within(screen.getByTestId('edit-item-footer'))
            .getByText('Save exchange')
            .click()

        const exchangeAutheInputWarning = within(
            screen.getByTestId('exchange-auth-pat')
        ).getByTestId('dhis2-uiwidgets-inputfield-validation')
        expect(exchangeAutheInputWarning).toBeInTheDocument()
        expect(exchangeAutheInputWarning).toHaveTextContent(
            'Please provide a value'
        )
        await waitFor(() =>
            expect(
                screen.queryByTestId('saving-exchange-loader')
            ).not.toBeInTheDocument()
        )
    })

    it('can edit an external exchange target advanced options if explicitly specified and auth info is re-entered', async () => {
        const request = testRequest()
        const dataExchange = testDataExchange({
            requests: [request],
            targetType: 'EXTERNAL',
            externalURL: 'a/url',
        })
        const { screen } = setUp(<EditItem />, {
            userContext: testUserContext({ canAddExchange: true }),
            dataExchange,
        })

        expect(
            await screen.findByTestId('add-exchange-title')
        ).toHaveTextContent('Edit exchange')

        screen.getByTestId('advanced-options').click()

        const editButton = await screen.findByRole('button', {
            name: 'Edit advanced options',
        })

        editButton.click()

        const generalIdSchemeRadio = within(
            screen.getByTestId('general-id-scheme-selector')
        ).getAllByRole('radio')
        generalIdSchemeRadio.map((r) => expect(r).not.toBeDisabled())
        generalIdSchemeRadio[1].click()

        const elementIdSchemeRadio = within(
            screen.getByTestId('element-id-scheme-selector')
        ).getAllByRole('radio')
        elementIdSchemeRadio.map((r) => expect(r).not.toBeDisabled())
        elementIdSchemeRadio[1].click()

        const orgUnitIdSchemeRadio = within(
            screen.getByTestId('org-unit-id-scheme-selector')
        ).getAllByRole('radio')
        orgUnitIdSchemeRadio.map((r) => expect(r).not.toBeDisabled())
        orgUnitIdSchemeRadio[1].click()

        const categoryOptionComboSchemeRadio = within(
            screen.getByTestId('category-option-combo-scheme-selector')
        ).getAllByRole('radio')
        categoryOptionComboSchemeRadio.map((r) => expect(r).not.toBeDisabled())
        categoryOptionComboSchemeRadio[1].click()

        const authRadio = within(
            screen.getByTestId('exchange-auth-method')
        ).getAllByRole('radio')
        expect(authRadio[1].getAttribute('value')).toEqual('PAT')
        authRadio[1].click()

        const tokenInput = within(
            screen.getByTestId('exchange-auth-pat')
        ).getByLabelText('Access token')
        fireEvent.input(tokenInput, { target: { value: 'exchangePAT' } })

        within(screen.getByTestId('edit-item-footer'))
            .getByText('Save exchange')
            .click()

        await waitFor(() =>
            expect(
                screen.getByTestId('saving-exchange-loader')
            ).toBeInTheDocument()
        )
    })
})
