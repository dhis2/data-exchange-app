import { faker } from '@faker-js/faker'
import {getReportText} from "./submit-modal";

describe('getReportText', () => {
    it('returns the report name', () => {
        const name = faker.word.noun()
        const orgUnits = []
        const periods = []
        const result = getReportText({name, orgUnits, periods})
        expect(result).toContain(name)
    })

    it('returns the org unit count when there is one', () => {
        const name = faker.word.noun()
        const orgUnits = ["anOrgUnit"]
        const periods = []
        const result = getReportText({name, orgUnits, periods})
        expect(result).toContain("1 organisation unit")
    })

    it('returns the org unit count when there is more than one', () => {
        const name = faker.word.noun()
        const orgUnitCounts = faker.number.int({min: 2, max: 5})
        const orgUnits = Array(orgUnitCounts).fill('anOrgUnit')
        const periods = []
        const result = getReportText({name, orgUnits, periods})
        expect(result).toContain(`${orgUnitCounts} organisation units`)
    })

    it('returns the period when there is only one', () => {
        const name = faker.word.noun()
        const orgUnits = []
        const periods = ['a period']
        const result = getReportText({name, orgUnits, periods})
        expect(result).toContain(`1 period: a period`)
    })

    it('returns the periods when there is two', () => {
        const name = faker.word.noun()
        const orgUnits = []
        const periods = ['a period', 'another period']
        const result = getReportText({name, orgUnits, periods})
        expect(result).toContain(`2 periods: a period, another period`)
    })

    it('returns the periods when there is three', () => {
        const name = faker.word.noun()
        const orgUnits = []
        const periods = ['a period', 'another period', 'one more period']
        const result = getReportText({name, orgUnits, periods})
        expect(result).toContain(`3 periods: a period, another period, one more period`)
    })

    it('returns the periods count when there is more than three', () => {
        const name = faker.word.noun()
        const orgUnits = []
        const periodsCounts = faker.number.int({min: 4, max: 10})
        const periods = Array(periodsCounts).fill('a period')
        const result = getReportText({name, orgUnits, periods})
        expect(result).toContain(`3+ periods: a period, a period, a period, and ${periodsCounts -3} more`)
    })
})
