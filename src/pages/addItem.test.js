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
    testUserContext,
} from '../utils/builders.js'
import { AddItem } from './addItem.js'

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
    } = {}
) => {
    const customerProviderData = {
        attributes: { attributes },
        aggregateDataExchanges: (type) => {
            if (type === 'create') {
                return {}
            }
            return undefined
        },
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
            <MemoryRouter>
                <QueryParamProvider
                    ReactRouterRoute={Route}
                    adapter={ReactRouter6Adapter}
                >
                    <AppContext.Provider
                        value={{
                            aggregateDataExchanges: [
                                testDataExchange(),
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

describe('<AddItem/>', () => {
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
        const { screen } = setUp(<AddItem />, {
            userContext: noPermissionsUserContext(),
        })
        const warning = await screen.findByTestId('dhis2-uicore-noticebox')
        expect(warning).toBeInTheDocument()
        const backButton = screen.getByTestId('link-to-configuration-page')
        expect(backButton).toBeInTheDocument()
        expect(
            within(backButton).getByRole('link', {
                name: 'Back to configurations page',
            })
        ).toBeInTheDocument()
    })

    it('creates an internal exchange', async () => {
        const exchangeName = 'an exchange name'
        const requestName = 'a request name'
        const orgUnit = 'an org unit'

        const { screen } = setUp(<AddItem />, {
            userContext: testUserContext({ canAddExchange: true }),
        })

        expect(
            await screen.findByTestId('add-exchange-title')
        ).toHaveTextContent('Add exchange')

        const exchangeNameInput = within(
            screen.getByTestId('exchange-name-input')
        ).getByLabelText('Exchange name')
        fireEvent.input(exchangeNameInput, { target: { value: exchangeName } })

        const typeRadio = within(
            screen.getByTestId('exchange-types')
        ).getAllByRole('radio')
        expect(typeRadio[1].getAttribute('value')).toEqual('INTERNAL')
        typeRadio[1].click()

        screen.getByText('Add request').click()
        await createRequest(screen, { requestName, orgUnit })

        const requestRow = await screen.findByTestId('dhis2-uicore-tablerow')
        expect(requestRow).toHaveTextContent(requestName)
        expect(requestRow).toHaveTextContent(orgUnit)

        within(screen.getByTestId('edit-item-footer'))
            .getByText('Save exchange')
            .click()

        waitFor(() =>
            expect(
                screen.getByTestId('saving-exchange-loader')
            ).toBeInTheDocument()
        )
    })

    it('creates an external exchange with auth token', async () => {
        const exchangeName = 'an exchange name'
        const exchangeURL = 'a/url'
        const exchangePAT = 'anAuthToken'
        const requestName = 'a request name'
        const orgUnit = 'an org unit'

        const { screen } = setUp(<AddItem />, {
            userContext: testUserContext({ canAddExchange: true }),
        })

        expect(
            await screen.findByTestId('add-exchange-title')
        ).toHaveTextContent('Add exchange')

        const nameInput = within(
            screen.getByTestId('exchange-name-input')
        ).getByLabelText('Exchange name')
        fireEvent.input(nameInput, { target: { value: exchangeName } })

        const typeRadio = within(
            screen.getByTestId('exchange-types')
        ).getAllByRole('radio')
        expect(typeRadio[0].getAttribute('value')).toEqual('EXTERNAL')
        typeRadio[0].click()

        const exchangeURLInput = within(
            await screen.findByTestId('exchange-url')
        ).getByLabelText('Target URL')
        fireEvent.input(exchangeURLInput, { target: { value: exchangeURL } })

        const authRadio = within(
            screen.getByTestId('exchange-auth-method')
        ).getAllByRole('radio')
        expect(authRadio[1].getAttribute('value')).toEqual('PAT')
        authRadio[1].click()

        const tokenInput = within(
            screen.getByTestId('exchange-auth-pat')
        ).getByLabelText('Access token')
        fireEvent.input(tokenInput, { target: { value: exchangePAT } })

        screen.getByText('Add request').click()
        await createRequest(screen, { requestName, orgUnit })

        const requestRow = await screen.findByTestId('dhis2-uicore-tablerow')
        expect(requestRow).toHaveTextContent(requestName)
        expect(requestRow).toHaveTextContent(orgUnit)

        within(screen.getByTestId('edit-item-footer'))
            .getByText('Save exchange')
            .click()

        waitFor(() =>
            expect(
                screen.getByTestId('saving-exchange-loader')
            ).toBeInTheDocument()
        )
    })

    it('creates an external exchange with basic auth', async () => {
        const exchangeName = 'an exchange name'
        const exchangeURL = 'a/url'
        const exchangeUserName = 'userame'
        const exchangePassword = 'password'
        const requestName = 'a request name'
        const orgUnit = 'an org unit'

        const { screen } = setUp(<AddItem />, {
            userContext: testUserContext({ canAddExchange: true }),
        })

        expect(
            await screen.findByTestId('add-exchange-title')
        ).toHaveTextContent('Add exchange')

        const nameInput = within(
            screen.getByTestId('exchange-name-input')
        ).getByLabelText('Exchange name')
        fireEvent.input(nameInput, { target: { value: exchangeName } })

        const typeRadio = within(
            screen.getByTestId('exchange-types')
        ).getAllByRole('radio')
        expect(typeRadio[0].getAttribute('value')).toEqual('EXTERNAL')
        typeRadio[0].click()

        const exchangeURLInput = within(
            await screen.findByTestId('exchange-url')
        ).getByLabelText('Target URL')
        fireEvent.input(exchangeURLInput, { target: { value: exchangeURL } })

        const authRadio = within(
            screen.getByTestId('exchange-auth-method')
        ).getAllByRole('radio')
        expect(authRadio[0].getAttribute('value')).toEqual('BASIC')
        authRadio[0].click()

        const authFields = screen.getByTestId('exchange-auth-basic')
        fireEvent.input(within(authFields).getByLabelText('Username'), {
            target: { value: exchangeUserName },
        })
        fireEvent.input(within(authFields).getByLabelText('Password'), {
            target: { value: exchangePassword },
        })

        screen.getByText('Add request').click()
        await createRequest(screen, { requestName, orgUnit })

        const requestRow = await screen.findByTestId('dhis2-uicore-tablerow')
        expect(requestRow).toHaveTextContent(requestName)
        expect(requestRow).toHaveTextContent(orgUnit)

        within(screen.getByTestId('edit-item-footer'))
            .getByText('Save exchange')
            .click()

        waitFor(() =>
            expect(
                screen.getByTestId('saving-exchange-loader')
            ).toBeInTheDocument()
        )
    })

    it('creates an internal exchange with codes as ID schemes', async () => {
        const exchangeName = 'an exchange name'
        const requestName = 'a request name'
        const orgUnit = 'an org unit'

        const { screen } = setUp(<AddItem />, {
            userContext: testUserContext({ canAddExchange: true }),
        })

        expect(
            await screen.findByTestId('add-exchange-title')
        ).toHaveTextContent('Add exchange')

        const exchangeNameInput = within(
            screen.getByTestId('exchange-name-input')
        ).getByLabelText('Exchange name')
        fireEvent.input(exchangeNameInput, { target: { value: exchangeName } })

        const typeRadio = within(
            screen.getByTestId('exchange-types')
        ).getAllByRole('radio')
        typeRadio[1].click()

        screen.getByText('Add request').click()
        await createRequest(screen, { requestName, orgUnit })

        screen.getByTestId('advanced-options').click()

        const generalIdSchemeRadio = within(
            screen.getByTestId('general-id-scheme-selector')
        ).getAllByRole('radio')
        expect(generalIdSchemeRadio).toHaveLength(3)
        generalIdSchemeRadio[1].click()

        const elementIdSchemeRadio = within(
            screen.getByTestId('element-id-scheme-selector')
        ).getAllByRole('radio')
        expect(elementIdSchemeRadio).toHaveLength(3)
        elementIdSchemeRadio[1].click()

        const orgUnitIdSchemeRadio = within(
            screen.getByTestId('org-unit-id-scheme-selector')
        ).getAllByRole('radio')
        expect(orgUnitIdSchemeRadio).toHaveLength(3)
        orgUnitIdSchemeRadio[1].click()

        const categoryOptionComboSchemeRadio = within(
            screen.getByTestId('category-option-combo-scheme-selector')
        ).getAllByRole('radio')
        expect(categoryOptionComboSchemeRadio).toHaveLength(3)
        categoryOptionComboSchemeRadio[1].click()

        within(screen.getByTestId('edit-item-footer'))
            .getByText('Save exchange')
            .click()

        waitFor(() =>
            expect(
                screen.getByTestId('saving-exchange-loader')
            ).toBeInTheDocument()
        )
    })

    it('creates an internal exchange with attribute as ID schemes', async () => {
        const exchangeName = 'an exchange name'
        const requestName = 'a request name'
        const orgUnit = 'an org unit'

        const attributes = [
            testAttribute({ displayName: 'brenda' }),
            testAttribute(),
            testAttribute(),
        ]
        const { screen } = setUp(<AddItem />, {
            userContext: testUserContext({ canAddExchange: true }),
            attributes,
        })

        expect(
            await screen.findByTestId('add-exchange-title')
        ).toHaveTextContent('Add exchange')

        const exchangeNameInput = within(
            screen.getByTestId('exchange-name-input')
        ).getByLabelText('Exchange name')
        fireEvent.input(exchangeNameInput, { target: { value: exchangeName } })

        const typeRadio = within(
            screen.getByTestId('exchange-types')
        ).getAllByRole('radio')
        typeRadio[1].click()

        screen.getByText('Add request').click()
        await createRequest(screen, { requestName, orgUnit })

        screen.getByTestId('advanced-options').click()

        const generalIdPicker = screen.getByTestId('general-id-scheme-selector')
        const generalIdSchemeRadio =
            within(generalIdPicker).getAllByRole('radio')
        expect(generalIdSchemeRadio).toHaveLength(3)
        generalIdSchemeRadio[2].click()
        within(generalIdPicker).getByTestId('dhis2-uicore-select-input').click()
        const generalAttributeOptions = within(
            await screen.findByTestId('dhis2-uicore-select-menu-menuwrapper')
        ).getAllByTestId('dhis2-uicore-singleselectoption')
        expect(generalAttributeOptions).toHaveLength(3)
        attributes.map((attribute, i) =>
            expect(generalAttributeOptions[i]).toHaveTextContent(
                attribute.displayName
            )
        )
        generalAttributeOptions[0].click()

        const elementIdPicker = screen.getByTestId('element-id-scheme-selector')
        const elementIdSchemeRadio =
            within(elementIdPicker).getAllByRole('radio')
        expect(elementIdSchemeRadio).toHaveLength(3)
        elementIdSchemeRadio[2].click()
        within(elementIdPicker).getByTestId('dhis2-uicore-select-input').click()
        const elementAttributeOptions = within(
            await screen.findByTestId('dhis2-uicore-select-menu-menuwrapper')
        ).getAllByTestId('dhis2-uicore-singleselectoption')
        expect(elementAttributeOptions).toHaveLength(3)
        attributes.map((attribute, i) =>
            expect(elementAttributeOptions[i]).toHaveTextContent(
                attribute.displayName
            )
        )
        elementAttributeOptions[0].click()

        const orgUnitIdPicker = screen.getByTestId(
            'org-unit-id-scheme-selector'
        )
        const orgUnitIdSchemeRadio =
            within(orgUnitIdPicker).getAllByRole('radio')
        expect(orgUnitIdSchemeRadio).toHaveLength(3)
        orgUnitIdSchemeRadio[2].click()
        within(orgUnitIdPicker).getByTestId('dhis2-uicore-select-input').click()
        const orgUnitAttributeOptions = within(
            await screen.findByTestId('dhis2-uicore-select-menu-menuwrapper')
        ).getAllByTestId('dhis2-uicore-singleselectoption')
        expect(orgUnitAttributeOptions).toHaveLength(3)
        attributes.map((attribute, i) =>
            expect(orgUnitAttributeOptions[i]).toHaveTextContent(
                attribute.displayName
            )
        )
        orgUnitAttributeOptions[0].click()

        const categoryOptionComboIdPicker = screen.getByTestId(
            'category-option-combo-scheme-selector'
        )
        const categoryOptionComboSchemeRadio = within(
            categoryOptionComboIdPicker
        ).getAllByRole('radio')
        expect(categoryOptionComboSchemeRadio).toHaveLength(3)
        categoryOptionComboSchemeRadio[2].click()
        within(categoryOptionComboIdPicker)
            .getByTestId('dhis2-uicore-select-input')
            .click()
        const categoryOptionComboAttributeOptions = within(
            await screen.findByTestId('dhis2-uicore-select-menu-menuwrapper')
        ).getAllByTestId('dhis2-uicore-singleselectoption')
        expect(categoryOptionComboAttributeOptions).toHaveLength(3)
        attributes.map((attribute, i) =>
            expect(categoryOptionComboAttributeOptions[i]).toHaveTextContent(
                attribute.displayName
            )
        )
        categoryOptionComboAttributeOptions[0].click()

        within(screen.getByTestId('edit-item-footer'))
            .getByText('Save exchange')
            .click()

        waitFor(() =>
            expect(
                screen.getByTestId('saving-exchange-loader')
            ).toBeInTheDocument()
        )
    })
})
