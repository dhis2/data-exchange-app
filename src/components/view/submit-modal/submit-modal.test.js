import '@testing-library/jest-dom'
import { faker } from '@faker-js/faker'
import { render, screen } from '@testing-library/react'
import React from 'react'
import { useExchangeContext, useUserContext } from '../../../context/index.js'
import { SubmitModal, getReportText } from './submit-modal.js'

jest.mock('../../../context/index.js', () => ({
    ...jest.requireActual('../../../context/index.js'),
    useUserContext: jest.fn(() => ({})),
    useExchangeContext: jest.fn(() => ({})),
}))

describe('getReportText', () => {
    it('returns the report name', () => {
        const name = faker.word.noun()
        const orgUnits = []
        const periods = []
        const result = getReportText({ name, orgUnits, periods })
        expect(result).toContain(name)
    })

    it('returns the org unit count when there is one', () => {
        const name = faker.word.noun()
        const orgUnits = ['anOrgUnit']
        const periods = []
        const result = getReportText({ name, orgUnits, periods })
        expect(result).toContain('1 organisation unit')
    })

    it('returns the org unit count when there is more than one', () => {
        const name = faker.word.noun()
        const orgUnitCounts = faker.number.int({ min: 2, max: 5 })
        const orgUnits = Array(orgUnitCounts).fill('anOrgUnit')
        const periods = []
        const result = getReportText({ name, orgUnits, periods })
        expect(result).toContain(`${orgUnitCounts} organisation units`)
    })

    it('returns the period when there is only one', () => {
        const name = faker.word.noun()
        const orgUnits = []
        const periods = ['a period']
        const result = getReportText({ name, orgUnits, periods })
        expect(result).toContain(`1 period: a period`)
    })

    it('returns the periods when there is two', () => {
        const name = faker.word.noun()
        const orgUnits = []
        const periods = ['a period', 'another period']
        const result = getReportText({ name, orgUnits, periods })
        expect(result).toContain(`2 periods: a period, another period`)
    })

    it('returns the periods when there is three', () => {
        const name = faker.word.noun()
        const orgUnits = []
        const periods = ['a period', 'another period', 'one more period']
        const result = getReportText({ name, orgUnits, periods })
        expect(result).toContain(
            `3 periods: a period, another period, one more period`
        )
    })

    it('returns the periods count when there is more than three', () => {
        const name = faker.word.noun()
        const orgUnits = []
        const periodsCounts = faker.number.int({ min: 4, max: 10 })
        const periods = Array(periodsCounts).fill('a period')
        const result = getReportText({ name, orgUnits, periods })
        expect(result).toContain(
            `3+ periods: a period, a period, a period, and ${
                periodsCounts - 3
            } more`
        )
    })
})

const noop = () => {}

const INTERNAL_WARNING =
    'This exchange is configured to skip audit information on submit, but you do not have the Skip data import audit authority. If you submit this exchange, the data will be ignored.'

describe('SubmitModal skipAudit warnings', () => {
    afterEach(() => {
        jest.clearAllMocks()
    })

    it('shows skip audit warning for internal type exchange, with skipAudit:true if is user is missing skip audit authority', () => {
        useUserContext.mockImplementationOnce(() => ({
            hasSkipAuditInfoAuthority: false,
        }))

        useExchangeContext.mockImplementationOnce(() => ({
            exchange: {
                target: { type: 'INTERNAL', request: { skipAudit: true } },
            },
            exchangeData: [],
        }))

        render(
            <SubmitModal open={true} setDataSubmitted={noop} onClose={noop} />
        )
        expect(screen.getByText(INTERNAL_WARNING)).toBeInTheDocument()
    })

    it('does not skip audit warning for internal type exchange, with skipAudit:false if is user is missing skip audit authority', () => {
        useUserContext.mockImplementationOnce(() => ({
            hasSkipAuditInfoAuthority: false,
        }))

        useExchangeContext.mockImplementationOnce(() => ({
            exchange: {
                target: { type: 'INTERNAL', request: { skipAudit: false } },
            },
            exchangeData: [],
        }))

        render(
            <SubmitModal open={true} setDataSubmitted={noop} onClose={noop} />
        )
        expect(screen.queryByText(INTERNAL_WARNING)).not.toBeInTheDocument()
    })

    it('does not show skip audit warning for internal type exchange, with skipAudit:true if is user has skip audit authority', () => {
        useUserContext.mockImplementationOnce(() => ({
            hasSkipAuditInfoAuthority: true,
        }))

        useExchangeContext.mockImplementationOnce(() => ({
            exchange: {
                target: { type: 'INTERNAL', request: { skipAudit: true } },
            },
            exchangeData: [],
        }))

        render(
            <SubmitModal open={true} setDataSubmitted={noop} onClose={noop} />
        )
        expect(screen.queryByText(INTERNAL_WARNING)).not.toBeInTheDocument()
    })

    it('does not show skip audit warning for external type exchange, with skipAudit:true', () => {
        useUserContext.mockImplementationOnce(() => ({
            hasSkipAuditInfoAuthority: true,
        }))

        useExchangeContext.mockImplementationOnce(() => ({
            exchange: {
                target: { type: 'EXTERNAL', request: { skipAudit: true } },
            },
            exchangeData: [],
        }))

        render(
            <SubmitModal open={true} setDataSubmitted={noop} onClose={noop} />
        )
        expect(screen.queryByText(INTERNAL_WARNING)).not.toBeInTheDocument()
    })
})
