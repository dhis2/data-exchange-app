import '@testing-library/jest-dom'
import { CustomDataProvider } from '@dhis2/app-runtime'
import {
    configure,
    render,
    waitFor,
    within,
    fireEvent,
} from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
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
import { EditItem } from './editItem.jsx'

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

const patchExchange = jest.fn()

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
        [`aggregateDataExchanges/${exchangeIdOrDataExchangeId}`]: (
            type,
            query
        ) => {
            if (type === 'json-patch') {
                patchExchange(query?.data)
            }
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
    afterEach(() => {
        jest.clearAllMocks()
    })

    const createRequest = async (
        screen,
        { requestName, orgUnit = 'fake-orgunit' }
    ) => {
        const requestNameInput = await screen.findByLabelText('Request name')
        await userEvent.type(requestNameInput, requestName)
        await userEvent.type(
            screen.getByTestId('fake-data-selector'),
            'a data element'
        )
        await userEvent.type(
            screen.getByTestId('fake-period-selector'),
            'a period'
        )
        await userEvent.type(
            screen.getByTestId('fake-orgunit-selector'),
            orgUnit
        )
        const footer = screen.getByTestId('edit-request-footer')
        await userEvent.click(within(footer).getByText('Save request'))
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
        await userEvent.type(nameInput, newExchangeName)

        await userEvent.click(
            within(screen.getByTestId('edit-item-footer')).getByText(
                'Save exchange'
            )
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
        await userEvent.click(
            within(requestRow).getByRole('button', { name: 'Delete' })
        )

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

        await userEvent.click(screen.getByText('Add request'))
        await createRequest(screen, { requestName: newRequestName })

        const requestRow = await screen.findAllByTestId('dhis2-uicore-tablerow')
        expect(requestRow).toHaveLength(2)
        expect(requestRow[0]).toHaveTextContent(existingRequest.name)
        expect(requestRow[1]).toHaveTextContent(newRequestName)

        await userEvent.click(
            within(screen.getByTestId('edit-item-footer')).getByText(
                'Save exchange'
            )
        )
    })

    it('can edit url, but not authentication details for an external exchange without confirming to edit authentication', async () => {
        const request = testRequest()
        const dataExchange = testDataExchange({
            requests: [request],
            targetType: 'EXTERNAL',
        })
        dataExchange.target.api.accessToken = 'fake_access_token'

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
        expect(exchangeURLInput).not.toBeDisabled()

        fireEvent.input(exchangeURLInput, {
            target: { value: 'newExchangeUrl.com' },
        })

        const tokenInput = within(
            screen.getByTestId('exchange-auth-pat')
        ).getByLabelText('Access token')
        expect(tokenInput).toBeDisabled()

        within(screen.getByTestId('edit-item-footer'))
            .getByText('Save exchange')
            .click()

        await waitFor(() =>
            expect(
                screen.getByTestId('saving-exchange-loader')
            ).toBeInTheDocument()
        )
    })

    it('can edit an external exchange authentication setup if explicitly specified', async () => {
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

        await userEvent.click(
            within(screen.getByTestId('target-setup')).queryByRole('button', {
                name: 'Edit target setup',
            })
        )

        const exchangeURLInput = within(
            await screen.findByTestId('exchange-url')
        ).getByLabelText('Target URL')
        expect(exchangeURLInput).not.toBeDisabled()

        await userEvent.type(exchangeURLInput, 'newExchangeUrl.com')

        const authRadio = within(
            screen.getByTestId('exchange-auth-method')
        ).getAllByRole('radio')
        expect(authRadio[1].getAttribute('value')).toEqual('PAT')
        await userEvent.click(authRadio[1])

        const tokenInput = within(
            screen.getByTestId('exchange-auth-pat')
        ).getByLabelText('Access token')
        await userEvent.type(tokenInput, 'exchangePAT')

        await userEvent.click(
            within(screen.getByTestId('edit-item-footer')).getByText(
                'Save exchange'
            )
        )
    })

    it('can edit an external exchange input id scheme options without confirming to edit authentication details', async () => {
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

        const generalIdSchemeRadio = within(
            screen.getByTestId('general-id-scheme-selector')
        ).getAllByRole('radio')
        generalIdSchemeRadio.map((r) => expect(r).not.toBeDisabled())

        const elementIdSchemeRadio = within(
            screen.getByTestId('element-id-scheme-selector')
        ).getAllByRole('radio')
        elementIdSchemeRadio.map((r) => expect(r).not.toBeDisabled())

        const orgUnitIdSchemeRadio = within(
            screen.getByTestId('org-unit-id-scheme-selector')
        ).getAllByRole('radio')
        orgUnitIdSchemeRadio.map((r) => expect(r).not.toBeDisabled())

        const categoryOptionComboSchemeRadio = within(
            screen.getByTestId('category-option-combo-scheme-selector')
        ).getAllByRole('radio')
        categoryOptionComboSchemeRadio.map((r) => expect(r).not.toBeDisabled())
        await userEvent.click(categoryOptionComboSchemeRadio[1])

        await userEvent.click(
            within(screen.getByTestId('edit-item-footer')).getByText(
                'Save exchange'
            )
        )

        await waitFor(() =>
            expect(
                screen.queryByTestId('saving-exchange-loader')
            ).not.toBeInTheDocument()
        )
    })

    it('loads None (follows Input general ID scheme) option if no ID scheme is specified', async () => {
        const request = testRequest()
        const dataExchange = testDataExchange({
            requests: [request],
            targetType: 'INTERNAL',
            inputIdSchemes: { idScheme: 'UID' },
        })

        const { screen } = setUp(<EditItem />, {
            userContext: testUserContext({ canAddExchange: true }),
            dataExchange,
        })

        expect(
            await screen.findByTestId('add-exchange-title')
        ).toHaveTextContent('Edit exchange')

        const defaultElementIdSchemeRadio = within(
            screen.getByTestId('element-id-scheme-selector')
        ).getByRole('radio', { name: 'None (follows Input general ID scheme)' })

        expect(defaultElementIdSchemeRadio).toBeChecked()

        const defaultOrgUnitIdSchemeRadio = within(
            screen.getByTestId('org-unit-id-scheme-selector')
        ).getByRole('radio', { name: 'None (follows Input general ID scheme)' })

        expect(defaultOrgUnitIdSchemeRadio).toBeChecked()

        const defaultCategoryOptionComboSchemeRadio = within(
            screen.getByTestId('category-option-combo-scheme-selector')
        ).getByRole('radio', { name: 'None (follows Input general ID scheme)' })

        expect(defaultCategoryOptionComboSchemeRadio).toBeChecked()
    })

    it('displays appropriate ID scheme selections based on exchange values', async () => {
        const request = testRequest()
        const dataExchange = testDataExchange({
            requests: [request],
            targetType: 'INTERNAL',
            inputIdSchemes: {
                idScheme: 'UID',
                dataElementIdScheme: 'CODE',
                orgUnitIdScheme: 'ATTRIBUTE:attribute001',
                categoryOptionComboIdScheme: 'UID',
            },
        })
        const attributes = [
            testAttribute({ displayName: 'Taco Friday', id: 'attribute001' }),
            testAttribute(),
            testAttribute(),
        ]

        const { screen } = setUp(<EditItem />, {
            userContext: testUserContext({ canAddExchange: true }),
            dataExchange,
            attributes,
        })

        expect(
            await screen.findByTestId('add-exchange-title')
        ).toHaveTextContent('Edit exchange')

        const codeElementIdSchemeRadio = within(
            screen.getByTestId('element-id-scheme-selector')
        ).getByRole('radio', { name: 'Code' })

        expect(codeElementIdSchemeRadio).toBeChecked()

        const attributeOrgUnitIdSchemeRadio = within(
            screen.getByTestId('org-unit-id-scheme-selector')
        ).getByRole('radio', { name: 'Attribute' })

        expect(attributeOrgUnitIdSchemeRadio).toBeChecked()
        expect(
            within(screen.getByTestId('org-unit-id-scheme-selector')).getByText(
                'Taco Friday'
            )
        ).toBeInTheDocument()

        const idCategoryOptionComboSchemeRadio = within(
            screen.getByTestId('category-option-combo-scheme-selector')
        ).getByRole('radio', { name: 'ID' })

        expect(idCategoryOptionComboSchemeRadio).toBeChecked()
    })

    // ToDo: couldn't get this test working reliably after react-18/vite upgrade (and it already had an extended timeout signaling it might have been flaky)
    it.skip('does not post anything for ID schemes when None option is selected', async () => {
        const request = testRequest()
        const dataExchange = testDataExchange({
            requests: [request],
            targetType: 'INTERNAL',
            inputIdSchemes: {
                idScheme: 'UID',
                dataElementIdScheme: 'CODE',
                orgUnitIdScheme: 'UID',
                categoryOptionComboIdScheme: 'CODE',
            },
        })

        const { screen } = setUp(<EditItem />, {
            userContext: testUserContext({ canAddExchange: true }),
            dataExchange,
        })

        const user = userEvent.setup()

        await screen.findByTestId('add-exchange-title')

        const defaultElementIdSchemeRadio = within(
            screen.getByTestId('element-id-scheme-selector')
        ).getByRole('radio', { name: 'None (follows Input general ID scheme)' })
        await user.click(defaultElementIdSchemeRadio)

        const defaultOrgUnitIdSchemeRadio = within(
            screen.getByTestId('org-unit-id-scheme-selector')
        ).getByRole('radio', { name: 'None (follows Input general ID scheme)' })
        await user.click(defaultOrgUnitIdSchemeRadio)

        const defaultCategoryOptionComboSchemeRadio = within(
            screen.getByTestId('category-option-combo-scheme-selector')
        ).getByRole('radio', { name: 'None (follows Input general ID scheme)' })
        await user.click(defaultCategoryOptionComboSchemeRadio)

        const saveExchange = within(
            screen.getByTestId('edit-item-footer')
        ).getByText('Save exchange')
        await user.click(saveExchange)

        const expectedPayload = [
            {
                op: 'add',
                path: '/target/request',
                value: {
                    idScheme: 'UID',
                },
            },
        ]

        expect(patchExchange).toHaveBeenCalled()
        expect(patchExchange).toHaveBeenCalledWith(expectedPayload)
    }, 7000)

    it('posts expected id schemes based on selections', async () => {
        const request = testRequest()
        const dataExchange = testDataExchange({
            requests: [request],
            targetType: 'INTERNAL',
            inputIdSchemes: {
                idScheme: 'UID',
                categoryOptionComboIdScheme: 'ATTRIBUTE:snorkmaiden',
            },
        })
        const attributes = [
            testAttribute({
                name: 'Snorkmaiden',
                displayName: 'Snorkmaiden',
                id: 'snorkmaiden',
            }),
            testAttribute(),
            testAttribute(),
        ]

        const { screen } = setUp(<EditItem />, {
            userContext: testUserContext({ canAddExchange: true }),
            dataExchange,
            attributes,
        })

        const user = userEvent.setup()

        await screen.findByTestId('add-exchange-title')

        const idElementIdSchemeRadio = within(
            screen.getByTestId('element-id-scheme-selector')
        ).getByRole('radio', { name: 'ID' })
        await user.click(idElementIdSchemeRadio)

        const codeOrgUnitIdSchemeRadio = within(
            screen.getByTestId('org-unit-id-scheme-selector')
        ).getByRole('radio', { name: 'Code' })
        await user.click(codeOrgUnitIdSchemeRadio)

        const saveExchange = within(
            screen.getByTestId('edit-item-footer')
        ).getByText('Save exchange')
        await user.click(saveExchange)

        const expectedPayload = [
            {
                op: 'add',
                path: '/target/request',
                value: {
                    categoryOptionComboIdScheme: 'ATTRIBUTE:snorkmaiden',
                    dataElementIdScheme: 'UID',
                    idScheme: 'UID',
                    orgUnitIdScheme: 'CODE',
                },
            },
        ]

        expect(patchExchange).toHaveBeenCalled()
        expect(patchExchange).toHaveBeenCalledWith(expectedPayload)
    })

    it('posts change to target when password is updated', async () => {
        const user = userEvent.setup()
        const request = testRequest()
        const dataExchange = testDataExchange({
            requests: [request],
            targetType: 'EXTERNAL',
            externalURL: 'a/url',
        })
        dataExchange.target.api.username = 'dog'
        dataExchange.target.api.password = 'cat'

        const { screen } = setUp(<EditItem />, {
            userContext: testUserContext({ canAddExchange: true }),
            dataExchange,
        })

        await screen.findByTestId('add-exchange-title')

        const confirmEditButton = within(
            screen.getByTestId('target-setup')
        ).queryByRole('button', {
            name: 'Edit authentication details',
        })

        await user.click(confirmEditButton)

        const passwordInput = within(
            screen.getByTestId('exchange-auth-basic')
        ).getByLabelText('Password')
        await user.type(passwordInput, 'dog_password')

        const saveExchange = within(
            screen.getByTestId('edit-item-footer')
        ).getByText('Save exchange')
        await user.click(saveExchange)

        const expectedPayload = [
            {
                op: 'add',
                path: '/target/api/password',
                value: 'dog_password',
            },
            {
                op: 'remove',
                path: '/target/api/accessToken',
            },
        ]

        expect(patchExchange).toHaveBeenCalled()
        expect(patchExchange).toHaveBeenCalledWith(expectedPayload)
    })
})
