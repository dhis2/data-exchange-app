import { ReactFinalForm } from '@dhis2/ui'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import React from 'react'
import { FeatureToggleProvider, UserContext } from '../../../context/index.js'
import { EXCHANGE_TYPES } from '../shared/index.js'
import { AdvancedOptions } from './advanced-options.js'

jest.mock('@dhis2/app-runtime', () => ({
    ...jest.requireActual('@dhis2/app-runtime'),
    useConfig: jest.fn(() => ({
        apiVersion: 42,
    })),
}))

const { Form } = ReactFinalForm

const setUp = (children, { hasSkipAuditInfoAuthority = false } = {}) => {
    render(
        <FeatureToggleProvider>
            <UserContext.Provider
                value={{ hasSkipAuditInfoAuthority: hasSkipAuditInfoAuthority }}
            >
                <Form onSubmit={noop} initialValues={{}}>
                    {() => <>{children}</>}
                </Form>
            </UserContext.Provider>
        </FeatureToggleProvider>
    )
}

const noop = () => {}

const SKIP_AUDIT_TEXT = 'Skip audit, meaning audit values will not be generated'
const INTERNAL_WARNING =
    'You do not have the Skip data import audit authority. In order for the data to not be ignored on submit, the exchange will need to be executed by a user who has this authority.'
const EXTERNAL_WARNING =
    'When selecting to skip audits, the authentication for the external server will need to have the Skip data import audit authority. If the authentication details do not have this authority, the data will be ignored on submit.'

// general functionality is covered in the addItem.js integration test
// these tests are to determine that warnings display appropriately

describe('AdvancedOptions (skip audit warnings)', () => {
    it('warning toggles for internal exchange if user does not have authority and skipAudit:true', async () => {
        const user = userEvent.setup()
        setUp(
            <AdvancedOptions
                typeValue={EXCHANGE_TYPES.internal}
                editTargetSetupDisabled={false}
                setEditTargetSetupDisabled={noop}
            />
        )

        await user.click(screen.getByText('Advanced options'))
        await user.click(screen.getByText(SKIP_AUDIT_TEXT))
        expect(screen.getByText(INTERNAL_WARNING)).toBeInTheDocument()
        await user.click(screen.getByText(SKIP_AUDIT_TEXT))
        expect(screen.queryByText(INTERNAL_WARNING)).not.toBeInTheDocument()
    })

    it('warning does not show for internal exchange if user has have authority and skipAudit:true', async () => {
        const user = userEvent.setup()
        setUp(
            <AdvancedOptions
                typeValue={EXCHANGE_TYPES.internal}
                editTargetSetupDisabled={false}
                setEditTargetSetupDisabled={noop}
            />,
            { hasSkipAuditInfoAuthority: true }
        )

        await user.click(screen.getByText('Advanced options'))
        await user.click(screen.getByText(SKIP_AUDIT_TEXT))
        expect(screen.queryByText(INTERNAL_WARNING)).not.toBeInTheDocument()
    })

    it('warning for external shows if type:external and user has skip audit authority', async () => {
        const user = userEvent.setup()
        setUp(
            <AdvancedOptions
                typeValue={EXCHANGE_TYPES.external}
                editTargetSetupDisabled={false}
                setEditTargetSetupDisabled={noop}
            />,
            { hasSkipAuditInfoAuthority: true }
        )

        await user.click(screen.getByText('Advanced options'))
        await user.click(screen.getByText(SKIP_AUDIT_TEXT))
        expect(screen.getByText(EXTERNAL_WARNING)).toBeInTheDocument()
    })

    it('warning for external shows if type:external and user does not have skip audit authority', async () => {
        const user = userEvent.setup()
        setUp(
            <AdvancedOptions
                typeValue={EXCHANGE_TYPES.external}
                editTargetSetupDisabled={false}
                setEditTargetSetupDisabled={noop}
            />,
            { hasSkipAuditInfoAuthority: false }
        )

        await user.click(screen.getByText('Advanced options'))
        await user.click(screen.getByText(SKIP_AUDIT_TEXT))
        expect(screen.getByText(EXTERNAL_WARNING)).toBeInTheDocument()
    })
})
